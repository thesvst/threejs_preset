import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { AnimationAction, AnimationClip, AnimationMixer, Group, LoadingManager } from 'three';
import { Logger } from '@core/logger';
import { CharacterFSM } from '@core/states/FiniteStateMachine/CharacterFSM';
import { Motion, MotionManager } from '@core/motions';
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

export class FBXLoaderManagerClass<T extends string> extends LoaderManagerClass {
  _fbx: Group;
  _manager: LoadingManager;
  _mixer: AnimationMixer;
  _animations: { [key: T]: { clip: AnimationClip; action: AnimationAction } } = {};
  _motionManager: MotionManager<T>;
  _stateMachine = new CharacterFSM(this._animations);

  constructor(model: FBXModel, motions: MotionManager<T>) {
    super();
    this._fbx = model.fbx;
    this._manager = model.manager;
    this._mixer = model.mixer

    this._motionManager = motions;
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

  private _AnimationOnLoad<T>(motion: Motion<T>, { animations} : Group) {
    const clip = animations[0];
    const action = this._mixer.clipAction(clip);
    this._animations[motion.name] = { clip, action };
  }

  public async LoadAnimations() {
    LoaderManagerClass._CheckIfFolderExists(this._motionManager._folderPath);
    LoaderManagerClass._CheckIfFilesExists(this._motionManager._motions.map(({ fileName }) => fileName));

    this._mixer = new AnimationMixer(this._fbx);
    const loader = new FBXLoader(this._manager)
    loader.setPath(this._motionManager._folderPath)
    this._motionManager._motions.map((FBXAnimation) => {
      loader.load(FBXAnimation.fileName, (animation) => {
        this._AnimationOnLoad<T>(FBXAnimation, animation)
      })
    })
    this._manager.onLoad = () => {
      this._stateMachine.SetState(this._motionManager._motions[0].name);
    };
  }
}