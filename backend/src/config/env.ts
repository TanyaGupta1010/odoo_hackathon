import dotenv from "dotenv";

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;
const JWT_SECRET = process.env.JWT_SECRET;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is missing");
}

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is missing (set a strong random value in .env)");
}

export const env = {
  PORT: Number(process.env.PORT) || 5000,
  DATABASE_URL,
  JWT_SECRET,
  // OAuth Web client ID — required to verify Google tokens were issued for this app.
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",
};
