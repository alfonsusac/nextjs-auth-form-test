export class ClientError extends Error {
  constructor(
    public readonly clientMessage: string,
    serverMessage: string = clientMessage
  ) { super(serverMessage) }
}

export namespace ClientError {

  export function invalidInput(msg: string): never {
    throw new ClientError("Invalid Input", msg)
  }
  export function unauthorized() {
    throw new ClientError("Unauthorized")
  }
  
}