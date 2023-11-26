import hkdf from "@panva/hkdf"
import argon2 from "argon2"
import { logger } from "./logger"

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
  const hasher = new Argon2idHasher()

  export async function hash(input: string) {
    log("Hashing input")
    return await hasher.hash(input)
  }
  export async function verify(hash: string, input: string) {
    log("Verifying input")
    return await hasher.verify(hash, input)
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