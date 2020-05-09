class ServerDataError extends Error {
  constructor(message: string) {
    super(message)
  }
}

class AuthError extends Error {
  constructor(message: string) {
    super(message)
  }
}

class GameDataError extends Error {
  constructor(message: string) {
    super(message)
  }

}

export {ServerDataError, AuthError, GameDataError}
