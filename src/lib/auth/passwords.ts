import {
  randomBytes,
  scrypt as scryptCallback,
  timingSafeEqual,
} from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback) as (
  password: string,
  salt: Buffer,
  keylen: number,
) => Promise<Buffer>;

const KEY_LENGTH = 64;
const FORMAT = "scrypt";

/**
 * Password hashing with Node's built-in scrypt (memory-hard KDF).
 * Stored format: `scrypt:<salt-hex>:<hash-hex>`, parameters are fixed here,
 * so no version negotiation is needed while the app is young.
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const derived = await scrypt(password, salt, KEY_LENGTH);
  return `${FORMAT}:${salt.toString("hex")}:${derived.toString("hex")}`;
}

export async function verifyPassword(
  password: string,
  stored: string,
): Promise<boolean> {
  const parts = stored.split(":");
  const [format, saltHex, hashHex] = parts;
  if (
    parts.length !== 3 ||
    format !== FORMAT ||
    !/^[a-f0-9]{32}$/i.test(saltHex ?? "") ||
    !/^[a-f0-9]{128}$/i.test(hashHex ?? "")
  )
    return false;

  try {
    const salt = Buffer.from(saltHex, "hex");
    const expected = Buffer.from(hashHex, "hex");
    const derived = await scrypt(password, salt, KEY_LENGTH);
    return timingSafeEqual(derived, expected);
  } catch {
    return false;
  }
}
