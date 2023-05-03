import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { AnimationAction, AnimationClip, AnimationMixer, Group, LoadingManager } from 'three';
import { Logger } from '@core/logger';
import { Motion } from '@core/motions';
// TODO: Move classes to separated folders
// TODO: fix dep cycle
// TODO: fix file accessibility methods (require proper path)
export class LoaderManagerClass extends Logger {
  static _CheckIfFolderExists(path: string) {
    try {
      // require(path)
    } catch {
      Logger._Error(`Folder doesn't exist`)
    }
  }

  static _CheckIfFileExists(path: string) {
    try {
      // require(path)
    } catch {
      Logger._Error(`File doesn't exist`)
    }
  }

  static _CheckIfFilesExists(paths: string[]) {
    paths.map((path) => LoaderManagerClass._CheckIfFileExists(path))
  }
}

export type FBXModel = { fbx: Group, mixer: AnimationMixer, manager: LoadingManager }

export class FBXLoaderManagerClass<T extends string, K> extends LoaderManagerClass {
  _fbx: Group;
  _loadingManager: LoadingManager;
  _animationMixer: AnimationMixer;
  _animationsManager: {
    [key: string]: { clip: AnimationClip; action: AnimationAction }
  } = {};
  _motions: Motion<T>[];

  constructor(model: FBXModel) {
    super();
    this._fbx = model.fbx;
    this._loadingManager = model.manager;
    this._animationMixer = model.mixer
  }

  static async LoadModel(folderPath: string, fileName: string) {
    this._CheckIfFolderExists(folderPath);
    this._CheckIfFileExists(`${folderPath}${fileName}`)

    const loader = new FBXLoader().setPath(folderPath);
    const fbx = await loader.loadAsync(fileName, (fbx) => fbx)
    const mixer = new AnimationMixer(fbx);
    const manager = new LoadingManager();

    return { fbx, mixer, manager }
  }

  private _AnimationOnLoad<T>(motion: Motion<T>, { animations } : Group) {
    const clip = animations[0];
    const action = this._animationMixer.clipAction(clip);
    this._animationsManager[motion.name] = { clip, action };
  }

  public async LoadAnimations(folderPath, motions: Motion<T>[]) {
    LoaderManagerClass._CheckIfFolderExists(folderPath);
    LoaderManagerClass._CheckIfFilesExists(motions.map((motion) => motion.name));
    this._motions = motions;

    this._animationMixer = new AnimationMixer(this._fbx);
    const loader = new FBXLoader(this._loadingManager)
    loader.setPath(folderPath)
    await Promise.all(motions.map(async (motion) => {
      this._AnimationOnLoad<T>(motion, await loader.loadAsync(motion.fileName))
    }))
  }
}