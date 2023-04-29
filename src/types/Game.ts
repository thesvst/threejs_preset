import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { Model } from './Model';
import { AnimationMixer, LoadingManager } from 'three';
import { Renderer } from 'core';

// TODO: In next iteration of refactor, call an instance of Game instead of Rerender
export class Game {
  _player: Model | null = null;
  _renderer: Renderer | null = null;

  constructor() {
    this._Init();
  }

  private async _Init() {
    const model = await this._LoadModel('/src/assets/', 'character.fbx');
    this._player = model;
    // TODO: In next iteration of refactor, rerender should model as an argument
    this._renderer = new Renderer('/src/assets/', 'character.fbx');
  }

  private async _LoadModel(path: string, fileName: string) {
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
}
