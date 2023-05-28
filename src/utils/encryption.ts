import crypto, { CipherGCMTypes } from "crypto";

export type EncryptedData = {
  iv: string;
  content: string;
  authTag: string;
};

class EncryptionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EncryptionError";
  }
}

class Encryption {
  private encryptionSecret: Buffer;
  private encryptionAlgorithm: CipherGCMTypes;
  private encryptionKeyLength: number;

  constructor() {
    const encryptionSecret = process.env.ENCRYPTION_SECRET;

    if (!encryptionSecret) {
      throw new EncryptionError("Encryption secret is required.");
    }

    this.encryptionSecret = crypto
      .createHash("sha256")
      .update(encryptionSecret)
      .digest();
    this.encryptionAlgorithm = "aes-256-gcm";
    this.encryptionKeyLength = 32;
  }

  private generateRandomKey(length: number): Buffer {
    return crypto.randomBytes(length);
  }

  private createCipher(iv: Buffer): crypto.CipherGCM {
    const key = this.encryptionSecret.slice(0, this.encryptionKeyLength);
    return crypto.createCipheriv(this.encryptionAlgorithm, key, iv);
  }

  private createDecipher(iv: Buffer): crypto.DecipherGCM {
    const key = this.encryptionSecret.slice(0, this.encryptionKeyLength);
    return crypto.createDecipheriv(this.encryptionAlgorithm, key, iv);
  }

  private transformData(
    data: Buffer,
    transform: crypto.CipherGCM | crypto.DecipherGCM
  ): Buffer {
    return Buffer.concat([transform.update(data), transform.final()]);
  }

  public async encrypt(text: string): Promise<EncryptedData> {
    return new Promise<EncryptedData>((resolve, reject) => {
      const iv = this.generateRandomKey(12);
      const cipher = this.createCipher(iv);

      let encrypted: Buffer;
      let authTag: Buffer;

      try {
        encrypted = this.transformData(Buffer.from(text), cipher);
        authTag = cipher.getAuthTag();
      } catch (error) {
        reject(new EncryptionError("Encryption failed."));
        return;
      }

      resolve({
        iv: iv.toString("hex"),
        content: encrypted.toString("hex"),
        authTag: authTag.toString("hex"),
      });
    });
  }

  public async decrypt(data: EncryptedData): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const iv = Buffer.from(data.iv, "hex");
      const content = Buffer.from(data.content, "hex");
      const authTag = Buffer.from(data.authTag, "hex");

      const decipher = this.createDecipher(iv);
      decipher.setAuthTag(authTag);

      let decrypted: Buffer;

      try {
        decrypted = this.transformData(content, decipher);
      } catch (error) {
        reject(new EncryptionError("Decryption failed."));
        return;
      }

      resolve(decrypted.toString());
    });
  }
}

export default Encryption;
