/**
 * Chat Client Unit Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ChatClient } from '../../src/clients/chat';
import { ValidationError } from '../../src/core/errors';

describe('ChatClient', () => {
  let mockConfig: any;
  let chatClient: ChatClient;

  beforeEach(() => {
    mockConfig = {
      serverUrl: 'https://test.nolimit.foundation',
      apiKey: 'test_key',
      x402: null,
      getAddress: vi.fn().mockResolvedValue('0x1234567890abcdef1234567890abcdef12345678'),
      getSigner: vi.fn(),
      getWalletClient: vi.fn(),
      debug: false,
    };
    chatClient = new ChatClient(mockConfig);
  });

  describe('send', () => {
    it('should throw ValidationError for empty message', async () => {
      await expect(chatClient.send('')).rejects.toThrow(ValidationError);
      await expect(chatClient.send('   ')).rejects.toThrow(ValidationError);
    });

    it('should format conversation history correctly', () => {
      const history = [
        { role: 'user' as const, content: 'Hello', timestamp: Date.now() },
        { role: 'assistant' as const, content: 'Hi there!' },
      ];

      const formatted = chatClient.formatHistory(history);
      
      expect(formatted).toHaveLength(2);
      expect(formatted[0].role).toBe('user');
      expect(formatted[0].content).toBe('Hello');
    });

    it('should limit history to last 10 messages', () => {
      const history = Array(20).fill(null).map((_, i) => ({
        role: i % 2 === 0 ? 'user' as const : 'assistant' as const,
        content: `Message ${i}`,
      }));

      const formatted = chatClient.formatHistory(history);
      
      expect(formatted).toHaveLength(10);
      expect(formatted[0].content).toBe('Message 10');
    });
  });
});

// mock
