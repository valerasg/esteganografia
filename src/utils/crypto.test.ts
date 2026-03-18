import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { generateKeyPair, encryptMessage, decryptMessage } from './crypto';

describe('Crypto Utils', () => {
  it('should generate a valid RSA key pair', () => {
    const keys = generateKeyPair();
    expect(keys.publicKey).toContain('-----BEGIN PUBLIC KEY-----');
    expect(keys.privateKey).toContain('-----BEGIN RSA PRIVATE KEY-----');
  });

  it('should encrypt and decrypt a message correctly', () => {
    const message = 'This is a secret message';
    const keys = generateKeyPair();
    
    const encrypted = encryptMessage(message, keys.publicKey);
    expect(encrypted).not.toBe(message);
    expect(typeof encrypted).toBe('string');
    
    const decrypted = decryptMessage(encrypted, keys.privateKey);
    expect(decrypted).toBe(message);
  });

  it('should throw an error when decrypting with the wrong private key', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const message = 'Secret';
    const keys1 = generateKeyPair();
    const keys2 = generateKeyPair();
    
    const encrypted = encryptMessage(message, keys1.publicKey);
    expect(() => decryptMessage(encrypted, keys2.privateKey)).toThrow();
    errorSpy.mockRestore();
  });

  it('should handle special characters and long messages', () => {
    const message = 'Secret with emojis 🚀 and long text: ' + 'A'.repeat(1000);
    const keys = generateKeyPair();
    
    const encrypted = encryptMessage(message, keys.publicKey);
    const decrypted = decryptMessage(encrypted, keys.privateKey);
    expect(decrypted).toBe(message);
  });
});
