import { BinaryLike, randomBytes, scrypt, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { PASSWORD_SALT_LENGTH, PASSWORD_SCRYPT_KEYLEN } from "../../config";

const scryptAsync: (
  password: BinaryLike,
  salt: BinaryLike,
  keylen: number,
) => Promise<Buffer> = promisify(scrypt);

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(PASSWORD_SALT_LENGTH).toString("hex");
  const hashed_buf = await scryptAsync(password, salt, PASSWORD_SCRYPT_KEYLEN);
  return `${hashed_buf.toString("hex")}.${salt}`;
}

export async function comparePassword(
  hashedPassword: string,
  password: string,
): Promise<boolean> {
  const [hash, salt] = hashedPassword.split(".");
  const hash_buf = Buffer.from(hashedPassword, "hex");
  const new_hash_buf = await scryptAsync(
    password,
    salt,
    PASSWORD_SCRYPT_KEYLEN,
  );
  return timingSafeEqual(hash_buf, new_hash_buf);
}
