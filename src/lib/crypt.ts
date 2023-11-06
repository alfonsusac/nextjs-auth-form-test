import argon2 from "argon2"

interface Hasher {
  hash(input: string): Promise<string>
  verify(hash: string, input: string): Promise<boolean>
}

class Argon2idHasher implements Hasher {
  hash = (input: string) => argon2.hash(input)
  verify = (hash: string, input: string) => argon2.verify(hash, input)
}

export namespace Cryptography {
  const hasher = new Argon2idHasher()
  export async function hash(input: string) {
    return await hasher.hash(input)
  }
  export async function verify(hash: string, input: string) {
    return await hasher.verify(hash, input)
  }
}

