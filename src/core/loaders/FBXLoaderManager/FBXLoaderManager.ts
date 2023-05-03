import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { AnimationAction, AnimationClip, AnimationMixer, Group, LoadingManager } from 'three';

import { Motion } from '@core/motions';

export type FBXModel = { fbx: Group, mixer: AnimationMixer, manager: LoadingManager }

export class FBXLoaderManagerClass {
  _fbx: Group;
  _loadingManager: LoadingManager;
  _animationMixer: AnimationMixer;
  _animationsManager: {
    [key: string]: { clip: AnimationClip; action: AnimationAction }
  } = {};
  _motions: Motion[] = [];

  constructor(model: FBXModel) {
    this._fbx = model.fbx;
    this._loadingManager = model.manager;
    this._animationMixer = model.mixer
  }

  static async LoadModel(folderPath: string, fileName: string) {
    const loader = new FBXLoader().setPath(folderPath);
    const fbx = await loader.loadAsync(fileName, (fbx) => fbx)
    const mixer = new AnimationMixer(fbx);
    const manager = new LoadingManager();

    return { fbx, mixer, manager }
  }

  private _AnimationOnLoad(motion: Motion, { animations } : Group) {
    const clip = animations[0];
    const action = this._animationMixer.clipAction(clip);
    this._animationsManager[motion.name] = { clip, action };
  }

  public async LoadAnimations(folderPath: string, motions: Motion[]) {
    this._motions = motions;

    this._animationMixer = new AnimationMixer(this._fbx);
    const loader = new FBXLoader(this._loadingManager)
    loader.setPath(folderPath)
    await Promise.all(motions.map(async (motion) => {
      this._AnimationOnLoad(motion, await loader.loadAsync(motion.fileName))
    }))
  }
}