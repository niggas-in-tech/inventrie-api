import * as argon2 from 'argon2';
import * as bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../../config/env.config';
/**
 * Provides helper methods for authentication
 */

/**
 * generates password hash and salt
 * @param {string} password - plain password string
 * @returns {Promise<object|error>} - resolves with object containing hashed password and salt or rejects with error
 */
export async function hashPassword(
  password: string,
): Promise<{ hash: string; salt: string }> {
  const salt = await bcrypt.genSalt();
  const hash = await argon2.hash(password + salt);
  return { hash, salt };
}

/**
 * Compares password with hashed password
 * @param {string} plainPassword  - plain password input
 * @param {string} salt - password salt
 * @param {string} hashedPassword - hashed password
 * @returns {boolean} - whether password matches with hash
 */
export async function comparePassword(
  plainPassword: string,
  salt: string,
  hashedPassword: string,
): Promise<boolean> {
  return argon2.verify(hashedPassword, plainPassword + salt);
}

/**
 * Generate jwt token from user object
 * @param {object} user - user object data - object containing user data
 * @param {string} secretKey - application key
 * @param {object} options - extra jwt options
 * @returns {string} - jwt token
 */
export function generateJwt(
  data: Record<string, unknown>,
  secretKey = 'accessTokenKey',
  options?: jwt.SignOptions | undefined,
) {
  const key = config[secretKey];
  return jwt.sign(data, key, { ...options });
}

/**
 * Checks validity of a token
 * @param {string} token - jwt token
 * @param {string} secretKey - application key
 * @returns {object|null} - resolves to decode jwt data or null
 */
export async function verifyJwt(token: string, secretKey = 'accessTokenKey') {
  try {
    const key = config[secretKey];
    return jwt.verify(token, key);
  } catch (error) {
    return null;
  }
}
