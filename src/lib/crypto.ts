import hkdf from "@panva/hkdf"
import argon2 from "argon2"
import { logger } from "./logger"
import crypto from "crypto"

/**
 * Hasher Class Template
 */
interface Hasher {
  hash(input: string): Promise<string>
  verify(hash: string, input: string): Promise<boolean>
}

/**
 * Argon2id Hasher
 */
class Argon2idHasher implements Hasher {
  hash = (input: string) => argon2.hash(input)
  verify = (hash: string, input: string) => argon2.verify(hash, input)
}

export namespace Cryptography {

  const log = logger("Cryptography ", "grey")

  // Change hashing algorithm here
  const hasher: Hasher = new Argon2idHasher()

  export async function hash(input: string) {
    log("Hashing input")
    return await hasher.hash(input)
  }
  export async function verify(hash: string, input: string) {
    log("Verifying input")
    return await hasher.verify(hash, input)
  }


  const ENCRYPTIONSECRET = "asdssfg"
  export async function encrypt(data: string) {
    // Generated from ChatGPT
    const iv = crypto.randomBytes(16) // Random Initialization Vector (IV)
    const key = crypto.createHash('sha256').update(ENCRYPTIONSECRET).digest()
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv)
    
    let encrypted = cipher.update(data, 'utf-8', 'hex')
    encrypted += cipher.final('hex')
    const encryptedDataWithIV = encrypted + iv.toString('hex')
    return encryptedDataWithIV
  }

  export async function decrypt(gibberish: string) {
    const ivLength = 32 // Assuming the IV is 16 bytes (32 hex characters)
    const encrypted = gibberish.slice(0, -ivLength)
    const iv = Buffer.from(gibberish.slice(-ivLength), 'hex')
    const key = crypto.createHash('sha256').update(ENCRYPTIONSECRET).digest()
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv)

    let decrypted = decipher.update(encrypted, 'hex', 'utf-8')
    decrypted += decipher.final('utf-8')
    return decrypted
  }

  /**
   * Gets Derived Encryption Key
   * 
   * Derived encrypted keys can be used to generate keys of different 
   * lengths and strengths, depending on the specific application. 
   * 
   * This allows for a more tailored security solution.
 */
  export async function getEncryptionKey(sourceKey: string) {
    // log("Getting Encryption Key")
    const digest = "sha256"
    const ikm = sourceKey
    const salt = ""
    const info = "Alfon-Auth.js Generated Encryption Key"
    const keylen = 32
    return await hkdf(digest, ikm, salt, info, keylen)
  }
}