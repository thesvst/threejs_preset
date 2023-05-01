export class Logger {
  static _Error(message: string) {
    throw new Error(message)
  }

  static _Log(message: string) {
    console.info(message)
  }
}