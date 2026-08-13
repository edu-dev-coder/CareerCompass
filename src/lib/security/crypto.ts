import crypto from "crypto";

// 32-byte key for AES-256 (64 hex characters)
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY 
  ? Buffer.from(process.env.ENCRYPTION_KEY, "hex")
  : crypto.scryptSync("fallback-local-key-please-change-in-production", "salt", 32);

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12; // GCM standard IV length is 12 bytes

export interface EncryptedPayload {
  encryptedText: string;
  iv: string; // hex formatted
}

/**
 * Encrypts cleartext using AES-256-GCM
 */
export function encryptText(text: string): EncryptedPayload {
  if (!text) {
    return { encryptedText: "", iv: "" };
  }
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
  
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  
  const authTag = cipher.getAuthTag().toString("hex");

  // We append the auth tag directly to the encrypted text for GCM verification
  return {
    encryptedText: `${encrypted}:${authTag}`,
    iv: iv.toString("hex")
  };
}

/**
 * Decrypts AES-256-GCM encrypted text
 */
export function decryptText(encryptedText: string, ivHex: string): string {
  if (!encryptedText || !ivHex) {
    return "";
  }
  try {
    const [encrypted, authTag] = encryptedText.split(":");
    if (!authTag) {
      throw new Error("Missing GCM authentication tag");
    }

    const iv = Buffer.from(ivHex, "hex");
    const tag = Buffer.from(authTag, "hex");
    const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
    decipher.setAuthTag(tag);
    
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    
    return decrypted;
  } catch (error) {
    console.error("Decryption failed:", error);
    return "[Decryption Failed - Access Restricted]";
  }
}
