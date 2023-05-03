type Motion<T> = {
  name: T,
  fileName: string,
  manager: any; // TODO: states
}

export class MotionManager<T> {
  _motionsFolderPath: string;
  _motions: Motion<T>[];
  constructor(folderPath: string, motions: Motion<T>[]) {
    this._motionsFolderPath = folderPath
    this._motions = motions
  }
}