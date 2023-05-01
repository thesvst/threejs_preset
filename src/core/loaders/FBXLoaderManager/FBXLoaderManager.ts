import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { LoaderManagerClass } from '@core/loaders';
import { AnimationAction, AnimationClip, AnimationMixer, Group, LoadingManager } from 'three';

type FBXAnimation<T> = { name: T, fileName: string };

class Animations<T> {
  _folderPath: string;
  _animations: FBXAnimation<T>[];
}

class FBXLoaderManagerClass<T extends string> {
  _fbx: Group;
  _manager: LoadingManager;
  _mixer: AnimationMixer;
  _loaderManager: LoaderManagerClass;
  _animations: { [key: T]: { clip: AnimationClip; action: AnimationAction } } = {};
  _motions: Animations<T>;

  constructor(model, manager, motions) {
    this._fbx = model.fbx;
    this._manager = model.manager;
    this._mixer = model.mixer
    this._loaderManager = manager
    this._motions = motions;
  }

  static async LoadModel(folderPath: string, fileName: string) {
    const loader = new FBXLoader().setPath(folderPath);
    const fbx = await loader.loadAsync(fileName, (fbx) => fbx)
    const mixer = new AnimationMixer(fbx);
    const manager = new LoadingManager();

    return { fbx, mixer, manager }
  }

  private _AnimationOnLoad<T>(FBXAnimation: FBXAnimation<T>, { animations }) {
    const clip = animations[0];
    const action = this._mixer.clipAction(clip);
    this._animations[FBXAnimation.name] = { clip, action };
  }

  public async LoadAnimations() {
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

export const FBXLoaderManager = async <T>(modelFolderPath: string, modelFileName: string, motions: Animations<T>) => {
  const LoaderManager = new LoaderManagerClass();
  LoaderManager._CheckIfFolderExists(modelFolderPath);
  LoaderManager._CheckIfFolderExists(motions._folderPath);
  LoaderManager._CheckIfFilesExists(motions._animations.map((anim) => anim.fileName));

  const FBXModel = await FBXLoaderManagerClass.LoadModel(modelFolderPath, modelFileName);
  const Instance = new FBXLoaderManagerClass<T>(FBXModel, LoaderManager, motions);
  await Instance.LoadAnimations()

  return Instance
}