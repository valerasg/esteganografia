import forge from 'node-forge';

export interface KeyPair {
  publicKey: string;
  privateKey: string;
}

export function generateKeyPair(): KeyPair {
  // Using 2048 bits for reasonable speed in browser and good security
  const keypair = forge.pki.rsa.generateKeyPair({ bits: 2048, e: 0x10001 });
  const publicKey = forge.pki.publicKeyToPem(keypair.publicKey);
  const privateKey = forge.pki.privateKeyToPem(keypair.privateKey);
  return { publicKey, privateKey };
}

/**
 * Encrypts a message using a hybrid approach:
 * 1. Generate random AES-GCM key and IV.
 * 2. Encrypt the message using AES-GCM.
 * 3. Encrypt the AES key using the RSA public key.
 * 4. Package everything together.
 */
export function encryptMessage(message: string, publicKeyPem: string): string {
  try {
    const publicKey = forge.pki.publicKeyFromPem(publicKeyPem) as forge.pki.rsa.PublicKey;
    
    // 1. Generate AES key (16 bytes = 128 bits) and IV (12 bytes)
    const key = forge.random.getBytesSync(16);
    const iv = forge.random.getBytesSync(12);

    // 2. Encrypt message with AES-GCM
    const cipher = forge.cipher.createCipher('AES-GCM', key);
    cipher.start({ iv: iv });
    cipher.update(forge.util.createBuffer(forge.util.encodeUtf8(message)));
    cipher.finish();
    const encryptedMessage = cipher.output.getBytes();
    const tag = cipher.mode.tag.getBytes();

    // 3. Encrypt AES key with RSA-OAEP
    const encryptedKey = publicKey.encrypt(key, 'RSA-OAEP');

    // 4. Combine: keyLength (2 bytes) + encryptedKey + iv (12 bytes) + tag (16 bytes) + encryptedMessage
    const keyLenBuffer = forge.util.createBuffer();
    keyLenBuffer.putInt16(encryptedKey.length);
    
    const combined = keyLenBuffer.getBytes() + encryptedKey + iv + tag + encryptedMessage;
    
    return forge.util.encode64(combined);
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Encryption failed. Make sure the public key is valid.');
  }
}

/**
 * Decrypts a message using the hybrid approach
 */
export function decryptMessage(encryptedBase64: string, privateKeyPem: string): string {
  try {
    const privateKey = forge.pki.privateKeyFromPem(privateKeyPem) as forge.pki.rsa.PrivateKey;
    const combined = forge.util.decode64(encryptedBase64);
    const buffer = forge.util.createBuffer(combined);
    
    // Parse combined package
    const keyLen = buffer.getInt16();
    const encryptedKey = buffer.getBytes(keyLen);
    const iv = buffer.getBytes(12);
    const tag = buffer.getBytes(16);
    const encryptedMessage = buffer.getBytes(); // rest of the buffer

    // Decrypt AES key
    const key = privateKey.decrypt(encryptedKey, 'RSA-OAEP');

    // Decrypt message with AES-GCM
    const decipher = forge.cipher.createDecipher('AES-GCM', key);
    decipher.start({ iv: iv, tag: forge.util.createBuffer(tag) });
    decipher.update(forge.util.createBuffer(encryptedMessage));
    const pass = decipher.finish();

    if (!pass) {
      throw new Error('AES authentication failed. Message may be corrupted.');
    }

    return forge.util.decodeUtf8(decipher.output.getBytes());
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error("Decryption failed. The private key doesn't match or no message exists.");
  }
}
