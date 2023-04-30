import { AnimationAction, AnimationMixer, Group, LoadingManager, Quaternion, Vector3 } from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

export type Model = { fbx: Group; mixer: AnimationMixer; manager: LoadingManager };

export class FBXModel {
  _fbx: Group | null = null;
  _mixer: AnimationMixer | null = null;
  _manager: LoadingManager | null = null;
  _animations: { [key: string]: { clip: any; action: AnimationAction } } = {};

  get Position() {
    const { x, y, z } = this._fbx?.position ?? new Vector3();

    return {
      asArray: (): [number, number, number] => [x, y, z],
      asVector3: () => new Vector3(x, y, z),
    };
  }

  get Quaternion() {
    const { x, y, z, w } = this._fbx?.quaternion ?? new Quaternion();

    return {
      asArray: (): [number, number, number, number] => [x, y, z, w],
      asQuaternion: () => new Quaternion(x, y, z, w),
    };
  }

  private constructor(fbx: Group, mixer: AnimationMixer, manager: LoadingManager) {
    this._fbx = fbx;
    this._mixer = mixer;
    this._manager = manager;
  }

  static async _CreateInstance(folder: string, file: string) {
    const model = await this.LoadModel(folder, file);
    return new FBXModel(model.fbx, model.mixer, model.manager);
  }

  static async LoadModel(path: string, fileName: string) {
    const model = {} as Model;

    const loader = new FBXLoader();
    loader.setPath(path);

    model.fbx = await loader.loadAsync(fileName, (fbx) => fbx);
    model.fbx.scale.setScalar(0.1);
    model.fbx.traverse((c) => {
      c.castShadow = true;
    });

    if (!model.fbx) throw new Error('Failed to load fbx');

    model.mixer = new AnimationMixer(model.fbx);
    model.manager = new LoadingManager();

    if (!model.mixer) throw new Error('Failed to load mixer');
    if (!model.manager) throw new Error('Failed to load manager');

    return model;
  }

  // TODO: Find a generic way
  public LoadAnimations() {
    const loader = new FBXLoader();

    const _OnLoad = (animName: string, anim: Group) => {
      if (!this._mixer) throw new Error('Cannot run OnLoad method, mixer is not defined');

      const clip = anim.animations[0];
      const action = this._mixer.clipAction(clip);

      this._animations[animName] = { clip, action };
    };

    loader.setPath('src/assets/animations/');
    loader.load('walk.fbx', (a) => {
      _OnLoad('walk', a);
    });
    loader.load('dance.fbx', (a) => {
      _OnLoad('dance', a);
    });
    loader.load('idle.fbx', (a) => {
      _OnLoad('idle', a);
    });
  }
}
