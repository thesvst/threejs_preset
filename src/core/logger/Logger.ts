export class Logger {
  protected _Error(message: string) {
    throw new Error(message)
  }

  protected _Log(message: string) {
    console.info(message)
  }
}