import CryptoJS from 'crypto-js';

/** Temporary test flag — set to true for real AES flow, false to send plain JSON from Postman */
const USE_ENCRYPTION = true;

/**
 * Reads an AES key from process.env (loaded via dotenv in server.ts).
 */
function getKey(envName: 'FRONTEND_AES_KEY' | 'BACKEND_AES_KEY'): string {
  const key = process.env[envName];
  if (!key || key.trim() === '') {
    throw new Error(`${envName} is not configured in the .env file`);
  }
  return key;
}

/**
 * Encrypts plaintext with the frontend AES key (used before sending to client).
 */
export function encryptFrontend(plainText: string): string {
  if (!USE_ENCRYPTION) return plainText;

  try {
    if (typeof plainText !== 'string') {
      throw new Error('encryptFrontend expects a string');
    }
    return CryptoJS.AES.encrypt(plainText, getKey('FRONTEND_AES_KEY')).toString();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown encryption error';
    throw new Error(`Frontend AES encryption failed: ${message}`, { cause: error });
  }
}

/**
 * Decrypts ciphertext that was encrypted on the client with the frontend AES key.
 */
export function decryptFrontend(cipherText: string): string {
  if (!USE_ENCRYPTION) return cipherText;

  try {
    if (typeof cipherText !== 'string' || cipherText.trim() === '') {
      throw new Error('decryptFrontend expects a non-empty ciphertext string');
    }
    const bytes = CryptoJS.AES.decrypt(cipherText, getKey('FRONTEND_AES_KEY'));
    const plainText = bytes.toString(CryptoJS.enc.Utf8);
    if (!plainText) {
      throw new Error('Invalid ciphertext or incorrect FRONTEND_AES_KEY');
    }
    return plainText;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown decryption error';
    throw new Error(`Frontend AES decryption failed: ${message}`, { cause: error });
  }
}

/**
 * Encrypts plaintext with the backend AES key before persisting to MongoDB.
 */
export function encryptBackend(plainText: string): string {
  if (!USE_ENCRYPTION) return plainText;

  try {
    if (typeof plainText !== 'string') {
      throw new Error('encryptBackend expects a string');
    }
    return CryptoJS.AES.encrypt(plainText, getKey('BACKEND_AES_KEY')).toString();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown encryption error';
    throw new Error(`Backend AES encryption failed: ${message}`, { cause: error });
  }
}

/**
 * Decrypts ciphertext stored in MongoDB using the backend AES key.
 */
export function decryptBackend(cipherText: string): string {
  if (!USE_ENCRYPTION) return cipherText;

  try {
    if (typeof cipherText !== 'string' || cipherText.trim() === '') {
      throw new Error('decryptBackend expects a non-empty ciphertext string');
    }
    const bytes = CryptoJS.AES.decrypt(cipherText, getKey('BACKEND_AES_KEY'));
    const plainText = bytes.toString(CryptoJS.enc.Utf8);
    if (!plainText) {
      throw new Error('Invalid ciphertext or incorrect BACKEND_AES_KEY');
    }
    return plainText;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown decryption error';
    throw new Error(`Backend AES decryption failed: ${message}`, { cause: error });
  }
}
