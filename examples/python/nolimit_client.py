"""
noLimit Base SDK - Python Client
Unofficial Python wrapper for noLimit services
"""

import os
import json
import base64
import time
from typing import Optional, List, Dict, Any
from dataclasses import dataclass
from eth_account import Account
from eth_account.messages import encode_defunct
from web3 import Web3
import requests


@dataclass
class ChatMessage:
    role: str  # 'user' | 'assistant' | 'system'
    content: str


@dataclass
class ChatResponse:
    message: str
    payment_tx: Optional[str] = None


@dataclass
class SwapResult:
    tx_hash: str
    from_amount: str
    to_amount: str
    nl_rewards: str


@dataclass
class MixResult:
    mix_id: str
    deposit_address: str
    deposit_amount: str
    fee: str
    output_amount: str


class NoLimitClient:
    """
    Python client for noLimit Foundation services on Base chain.
    
    Usage:
        client = NoLimitClient(private_key="0x...")
        response = client.chat.send("Hello")
        print(response.message)
    """
    
    DEFAULT_SERVER = "https://x402.nolimit.foundation"
    
    def __init__(
        self,
        private_key: Optional[str] = None,
        api_key: Optional[str] = None,
        server_url: Optional[str] = None,
        rpc_url: str = "https://mainnet.base.org"
    ):
        self.server_url = server_url or self.DEFAULT_SERVER
        self.api_key = api_key
        self.w3 = Web3(Web3.HTTPProvider(rpc_url))
        
        if private_key:
            self.account = Account.from_key(private_key)
            self.address = self.account.address
        else:
            self.account = None
            self.address = None
            
        self.chat = ChatClient(self)
        self.swap = SwapClient(self)
        self.mixer = MixerClient(self)
    
    def _make_request(
        self,
        endpoint: str,
        body: Dict[str, Any],
        timeout: int = 60
    ) -> Dict[str, Any]:
        """Make request with x402 payment or API key"""
        url = f"{self.server_url}{endpoint}"
        headers = {"Content-Type": "application/json"}
        
        if self.api_key:
            headers["X-API-Key"] = self.api_key
            response = requests.post(url, json=body, headers=headers, timeout=timeout)
            response.raise_for_status()
            return {"data": response.json()}
        
        # x402 flow
        response = requests.post(url, json=body, headers=headers, timeout=timeout)
        
        if response.status_code != 402:
            response.raise_for_status()
            return {"data": response.json()}
        
        # Handle 402 - create payment
        payment_req = response.json()
        accepts = payment_req.get("accepts", [{}])[0]
        
        payment_header = self._create_payment(accepts)
        headers["X-Payment"] = payment_header
        
        response = requests.post(url, json=body, headers=headers, timeout=timeout)
        response.raise_for_status()
        
        return {
            "data": response.json(),
            "payment_tx": response.headers.get("X-Payment-Response")
        }
    
    def _create_payment(self, requirements: Dict[str, Any]) -> str:
        """Create x402 payment header"""
        if not self.account:
            raise ValueError("Wallet required for payment")
        
        payload = {
            "version": "1",
            "network": "base",
            "from": self.address,
            "to": requirements.get("payTo"),
            "amount": requirements.get("maxAmountRequired"),
            "asset": requirements.get("asset"),
            "resource": requirements.get("resource"),
            "timestamp": int(time.time() * 1000)
        }
        
        payload_str = json.dumps(payload)
        message = encode_defunct(text=payload_str)
        signature = self.account.sign_message(message).signature.hex()
        
        full_payload = {**payload, "signature": signature}
        return base64.b64encode(json.dumps(full_payload).encode()).decode()
    
    def _sign_transaction(self, tx: Dict[str, Any]) -> str:
        """Sign and send transaction"""
        if not self.account:
            raise ValueError("Wallet required")
        
        tx["from"] = self.address
        tx["nonce"] = self.w3.eth.get_transaction_count(self.address)
        tx["chainId"] = 8453  # Base
        
        if "gas" not in tx:
            tx["gas"] = self.w3.eth.estimate_gas(tx)
        
        signed = self.account.sign_transaction(tx)
        tx_hash = self.w3.eth.send_raw_transaction(signed.raw_transaction)
        return tx_hash.hex()


class ChatClient:
    """Chat client for noLimit LLM"""
    
    def __init__(self, client: NoLimitClient):
        self._client = client
    
    def send(
        self,
        message: str,
        history: Optional[List[ChatMessage]] = None,
        timeout: int = 60
    ) -> ChatResponse:
        """Send message to AI"""
        body = {
            "message": message,
            "userAddress": self._client.address or "0x0",
        }
        
        if history:
            body["conversationHistory"] = [
                {"role": m.role, "content": m.content}
                for m in history
            ]
        
        endpoint = "/api/agent" if self._client.api_key else "/noLimitLLM"
        result = self._client._make_request(endpoint, body, timeout)
        
        return ChatResponse(
            message=result["data"]["response"],
            payment_tx=result.get("payment_tx")
        )


class SwapClient:
    """Swap client for noLimit Swap"""
    
    TOKENS = {
        "ETH": "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
        "USDC": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
        "USDT": "0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2",
    }
    
    def __init__(self, client: NoLimitClient):
        self._client = client
    
    def execute(
        self,
        from_token: str,
        to_token: str,
        amount: str,
        slippage: float = 1.0
    ) -> SwapResult:
        """Execute token swap"""
        from_addr = self.TOKENS.get(from_token.upper(), from_token)
        to_addr = self.TOKENS.get(to_token.upper(), to_token)
        
        decimals = 18 if from_token.upper() == "ETH" else 6
        amount_wei = str(int(float(amount) * (10 ** decimals)))
        
        body = {
            "chain": "base",
            "fromToken": from_addr,
            "toToken": to_addr,
            "amount": amount_wei,
            "userAddress": self._client.address,
            "slippage": slippage,
        }
        
        result = self._client._make_request("/noLimitSwap", body, 120)
        data = result["data"]
        
        # Execute swap tx
        tx = data["tx"]
        tx_hash = self._client._sign_transaction({
            "to": tx["to"],
            "data": tx["data"],
            "value": int(tx.get("value", 0)),
        })
        
        return SwapResult(
            tx_hash=tx_hash,
            from_amount=amount_wei,
            to_amount=data["quote"]["toAmount"],
            nl_rewards=data.get("nlEarned", "0")
        )


class MixerClient:
    """Mixer client for noLimit Mixer"""
    
    def __init__(self, client: NoLimitClient):
        self._client = client
    
    def create(
        self,
        token: str,
        amount: str,
        recipient: str,
        delay: int = 0
    ) -> MixResult:
        """Create mix request"""
        body = {
            "token": token,
            "amount": amount,
            "recipientAddress": recipient,
            "userAddress": self._client.address,
            "delayMinutes": delay,
        }
        
        result = self._client._make_request("/noLimitMixer", body, 30)
        data = result["data"]
        
        return MixResult(
            mix_id=data["mixId"],
            deposit_address=data["depositAddress"],
            deposit_amount=data["depositAmount"],
            fee=data["fee"],
            output_amount=data["outputAmount"]
        )
    
    def get_status(self, mix_id: str) -> Dict[str, Any]:
        """Get mix status"""
        url = f"{self._client.server_url}/mixer/status/{mix_id}"
        response = requests.get(url)
        response.raise_for_status()
        return response.json()


# Example usage
if __name__ == "__main__":
    # With private key
    client = NoLimitClient(private_key=os.environ.get("PRIVATE_KEY"))
    
    # Chat
    response = client.chat.send("What is blockchain?")
    print(f"AI: {response.message}")
    
    # With API key only (no wallet needed for chat)
    # client = NoLimitClient(api_key=os.environ.get("NOLIMIT_API_KEY"))

#   c h a t  
 #   s w a p  
 