export type Motion<T> = {
  name: T,
  fileName: string,
  manager: any; // TODO: states
}

export class MotionManager<T> {
  _folderPath: string;
  _motions: Motion<T>[];
  constructor(folderPath: string, motions: Motion<T>[]) {
    this._folderPath = folderPath
    this._motions = motions
  }
}