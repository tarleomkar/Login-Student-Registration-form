import CryptoJS from 'crypto-js';

/**
 * Reads the frontend AES key from Vite env (client/.env).
 */
function getFrontendKey(): string {
  const key = import.meta.env['VITE_FRONTEND_AES_KEY'];
  if (!key || key.trim() === '') {
    throw new Error('VITE_FRONTEND_AES_KEY is not configured in the .env file');
  }
  return key;
}

/**
 * Encrypts plaintext with the frontend AES key before sending to the backend.
 */
export function encryptFrontend(plainText: string): string {
  try {
    if (typeof plainText !== 'string') {
      throw new Error('encryptFrontend expects a string');
    }
    return CryptoJS.AES.encrypt(plainText, getFrontendKey()).toString();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown encryption error';
    throw new Error(`Frontend AES encryption failed: ${message}`, { cause: error });
  }
}

/**
 * Decrypts ciphertext returned from the backend (encrypted with the frontend AES key).
 */
export function decryptFrontend(cipherText: string): string {
  try {
    if (typeof cipherText !== 'string' || cipherText.trim() === '') {
      throw new Error('decryptFrontend expects a non-empty ciphertext string');
    }
    const bytes = CryptoJS.AES.decrypt(cipherText, getFrontendKey());
    const plainText = bytes.toString(CryptoJS.enc.Utf8);
    if (!plainText) {
      throw new Error('Invalid ciphertext or incorrect VITE_FRONTEND_AES_KEY');
    }
    return plainText;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown decryption error';
    throw new Error(`Frontend AES decryption failed: ${message}`, { cause: error });
  }
}
