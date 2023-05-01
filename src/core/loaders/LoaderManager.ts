import { Logger } from '@core/logger';

export class LoaderManagerClass extends Logger {
  public _CheckIfFolderExists(path: string) {
    try {
      require(path)
    } catch {
      throw new Error(`Folder doesn't exist`)
    }
  }

  public  _CheckIfFileExists(path: string) {
    try {
      require(path)
    } catch {
      this._Error(`File doesn't exist`)
    }
  }

  public _CheckIfFilesExists(paths: string[]) {
    paths.map((path) => this._CheckIfFileExists(path))
  }
}