import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { Model } from './types/Model';
import { AnimationMixer, LoadingManager, PerspectiveCamera } from 'three';
import { Gui, Renderer } from './core';

export class Game {
  _player: Model | null = null;
  _renderer: Renderer | null = null;
  _GUI: { camera: Gui; player: Gui } | null = null;
  _camera = new PerspectiveCamera(); // TODO: Pass to renderer as an argument

  constructor() {
    this._Init();
  }

  private async _Init() {
    const model = await this._LoadModel('/src/assets/', 'character.fbx');
    this._player = model;

    this._InitGui()
    this._InitRerender();
  }

  _InitRerender() {
    if (!this._player) throw new Error('Cannot initailize rerender due to missing player!')
    
    this._renderer = new Renderer(this._player);
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

  private _InitGui() {
    const gui = { camera: new Gui(), player: new Gui() };

    const camPosition = { folderName: 'Cam Position', target: this._camera.position, name: 'Position' };
    const camRotation = { folderName: 'Cam Rotation', target: this._camera.rotation, name: 'Rotation' };
    const playerPosition = { folderName: 'Player Position', target: this._camera.position, name: 'Position' };
    const playerRotation = { folderName: 'Player Rotation', target: this._camera.position, name: 'Rotation' };

    gui.camera.AddEntityToFolder(camPosition);
    gui.camera.AddEntityToFolder(camRotation);
    gui.player.AddEntityToFolder(playerPosition);
    gui.player.AddEntityToFolder(playerRotation);
  }
}
