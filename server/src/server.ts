import { webcrypto } from 'node:crypto';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './app';

// MongoDB driver needs globalThis.crypto (missing in some ts-node-dev contexts)
if (!globalThis.crypto) {
  globalThis.crypto = webcrypto as Crypto;
}

// Load .env first so AES keys and Mongo URI are available
dotenv.config();

const PORT = Number(process.env.PORT) || 5000;

async function startServer(): Promise<void> {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;

    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI is not set in the .env file');
    }

    if (!process.env.FRONTEND_AES_KEY || !process.env.BACKEND_AES_KEY) {
      throw new Error('FRONTEND_AES_KEY and BACKEND_AES_KEY must be set in the .env file');
    }

    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected');

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to start server';
    console.error(message);
    process.exit(1);
  }
}

void startServer();
