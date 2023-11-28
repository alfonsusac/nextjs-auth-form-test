export class ClientErrorBaseClass extends Error {
  constructor(
    public readonly clientMessage: string,
    serverMessage: string = clientMessage
  ) { super(serverMessage) }
}

export namespace ClientError {
  
  export function invalidInput(clientmsg: string): never {
    throw new ClientErrorBaseClass(clientmsg, clientmsg)
  }
  export function unauthorized(): never {
    throw new ClientErrorBaseClass("You are unauthorized to access this resource")
  }
  export function notAuthenticated(): never {
    throw new ClientErrorBaseClass("Not Authenticated. Please sign in to continue.")
  }
  export function invalidCredential(servermsg: string): never {
    throw new ClientErrorBaseClass("Invalid Credentials", servermsg)
  }

}