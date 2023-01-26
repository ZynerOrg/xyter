import crypto from "crypto";
import { IEncryptionData } from "../interfaces/EncryptionData";

const iv = crypto.randomBytes(16);

// Encrypts a string
const encrypt = (text: crypto.BinaryLike): IEncryptionData => {
  const cipher = crypto.createCipheriv(
    process.env.ENCRYPTION_ALGORITHM,
    process.env.ENCRYPTION_SECRET,
    iv
  );
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

  return {
    iv: iv.toString("hex"),
    content: encrypted.toString("hex"),
  };
};

// Decrypts a string
const decrypt = (hash: IEncryptionData) => {
  const decipher = crypto.createDecipheriv(
    process.env.ENCRYPTION_ALGORITHM,
    process.env.ENCRYPTION_SECRET,
    Buffer.from(hash.iv, "hex")
  );

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(hash.content, "hex")),
    decipher.final(),
  ]);

  return decrypted.toString();
};

export default {
  encrypt,
  decrypt,
};
