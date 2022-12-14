"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const iv = crypto_1.default.randomBytes(16);
// Encrypts a string
const encrypt = (text) => {
    const cipher = crypto_1.default.createCipheriv(process.env.ENCRYPTION_ALGORITHM, process.env.ENCRYPTION_SECRET, iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    return {
        iv: iv.toString("hex"),
        content: encrypted.toString("hex"),
    };
};
// Decrypts a string
const decrypt = (hash) => {
    const decipher = crypto_1.default.createDecipheriv(process.env.ENCRYPTION_ALGORITHM, process.env.ENCRYPTION_SECRET, Buffer.from(hash.iv, "hex"));
    const decrypted = Buffer.concat([
        decipher.update(Buffer.from(hash.content, "hex")),
        decipher.final(),
    ]);
    return decrypted.toString();
};
exports.default = {
    encrypt,
    decrypt,
};
