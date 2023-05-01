import { Logger } from '@core/logger';

export class LoaderManagerClass extends Logger {
  static _CheckIfFolderExists(path: string) {
    try {
      require(path)
    } catch {
      Logger._Error(`Folder doesn't exist`)
    }
  }

  static _CheckIfFileExists(path: string) {
    try {
      require(path)
    } catch {
      Logger._Error(`File doesn't exist`)
    }
  }

  static _CheckIfFilesExists(paths: string[]) {
    paths.map((path) => LoaderManagerClass._CheckIfFileExists(path))
  }
}