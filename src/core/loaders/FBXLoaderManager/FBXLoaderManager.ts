import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
// import { LoaderManagerClass } from '@core/loaders';
import { AnimationAction, AnimationClip, AnimationMixer, Group, LoadingManager } from 'three';
import { Logger } from '@core/logger';
import { CharacterFSM } from '@core/states/FiniteStateMachine/CharacterFSM';
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

type FBXMotion<T> = { name: T, fileName: string };

export type FBXModel = { fbx: Group, mixer: AnimationMixer, manager: LoadingManager }

export class FBXMotions<T> {
  _folderPath: string;
  _animations: FBXMotion<T>[];

  constructor(folderPath, animations) {
    this._folderPath = folderPath;
    this._animations = animations;
  }
}

export class FBXLoaderManagerClass<T extends string> extends LoaderManagerClass {
  _fbx: Group;
  _manager: LoadingManager;
  _mixer: AnimationMixer;
  _animations: { [key: T]: { clip: AnimationClip; action: AnimationAction } } = {};
  _motions: FBXMotions<T>;
  _stateMachine = new CharacterFSM(this._animations);

  constructor(model, motions) {
    super();
    this._fbx = model.fbx;
    this._manager = model.manager;
    this._mixer = model.mixer

    this._motions = motions;
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

  private _AnimationOnLoad<T>(FBXAnimation: FBXMotion<T>, { animations }) {
    const clip = animations[0];
    const action = this._mixer.clipAction(clip);
    this._animations[FBXAnimation.name] = { clip, action };
  }

  public async LoadAnimations() {
    LoaderManagerClass._CheckIfFolderExists(this._motions._folderPath);
    LoaderManagerClass._CheckIfFilesExists(this._motions._animations.map(({ fileName }) => fileName));

    this._mixer = new AnimationMixer(this._fbx);
    const manager = new LoadingManager();
    const loader = new FBXLoader(manager)
    loader.setPath(this._motions._folderPath)
    this._motions._animations.map((FBXAnimation) => {
      loader.load(FBXAnimation.fileName, (animation) => {
        this._AnimationOnLoad<T>(FBXAnimation, animation)
      })
    })
  }
}