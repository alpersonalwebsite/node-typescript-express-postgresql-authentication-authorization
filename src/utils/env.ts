import dotenv from 'dotenv';

dotenv.config();

// Fail fast on startup instead of silently falling back to an empty secret.
const required = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

export const TOKEN_SECRET = required('TOKEN_SECRET');
