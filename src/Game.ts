import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { Model } from './types/Model';
import {
  AmbientLight,
  AnimationMixer,
  Color,
  LoadingManager,
  PCFSoftShadowMap,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer,
} from 'three';
import { Gui, Renderer } from './core';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export class Game {
  _player: Model | null = null;
  _Framer: Renderer | null = null;
  _GUI: { camera: Gui; player: Gui } | null = null;
  _camera: PerspectiveCamera | null = null; // TODO: Pass to renderer as an argument
  _light: AmbientLight | null = null;
  _scene: Scene | null = null;
  _renderer: WebGLRenderer | null = null;
  _orbitControls: OrbitControls | null = null;

  get playerPosition() {
    const position = this._player?.fbx.position ?? new Vector3();

    return {
      asArray: (): [number, number, number] => [position.x, position.y, position.z],
      asVector3: () => position,
    };
  }

  get playerRotation() {
    const rotation = this._player?.fbx.rotation ?? new Vector3();

    return {
      asArray: (): [number, number, number] => [rotation.x, rotation.y, rotation.z],
      asVector3: () => rotation,
    };
  }

  constructor() {
    this._Init();
  }

  private async _Init() {
    const model = await this._LoadModel('/src/assets/', 'character.fbx');
    this._player = model;

    this._InitScene();
    this._InitLights();
    this._InitCamera();
    this._InitPlayer();

    this._InitRenderer();
    this._InitFramer();

    this._InitGui();
    this._InitOrbitControls();

    this._AppendToDOMElement();
    window.addEventListener('resize', this._OnWindowResize);
  }

  private _InitRenderer() {
    this._renderer = new WebGLRenderer({ antialias: true });
    this._renderer.shadowMap.enabled = true;
    this._renderer.shadowMap.type = PCFSoftShadowMap;
    this._renderer.setPixelRatio(window.devicePixelRatio);
    this._renderer.setSize(window.innerWidth, window.innerHeight);
  }

  private _InitFramer() {
    if (!this._scene) throw new Error('Cannot initailize rerender due to missing scene!');
    if (!this._camera) throw new Error('Cannot initailize rerender due to missing camera!');
    if (!this._player) throw new Error('Cannot initailize rerender due to missing player!');
    if (!this._renderer) throw new Error('Cannot initialize framer due to missing renderer');

    this._Framer = new Renderer(this._scene, this._camera, this._player, this._renderer);
  }

  private _InitLights() {
    if (this._scene) {
      this._scene.add(new AmbientLight(0xffffff, 0.5));
    } else {
      throw new Error('Cannot add light, scene is not defined');
    }
  }

  private _InitCamera() {
    this._camera = new PerspectiveCamera();
    this._camera.position.set(0, 0, -40);
  }

  private _InitScene() {
    this._scene = new Scene();
    this._scene.background = new Color('skyblue');
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
    if (this._camera) {
      const gui = { camera: new Gui(), player: new Gui() };

      const camPosition = { folderName: 'Cam Position', target: this._camera.position, name: 'Position' };
      const camRotation = { folderName: 'Cam Rotation', target: this._camera.rotation, name: 'Rotation' };
      const playerPosition = { folderName: 'Player Position', target: this._camera.position, name: 'Position' };
      const playerRotation = { folderName: 'Player Rotation', target: this._camera.position, name: 'Rotation' };

      gui.camera.AddEntityToFolder(camPosition);
      gui.camera.AddEntityToFolder(camRotation);
      gui.player.AddEntityToFolder(playerPosition);
      gui.player.AddEntityToFolder(playerRotation);
    } else {
      throw new Error('Cannot set Gui, camera is not defined');
    }
  }

  private _OnWindowResize() {
    if (!this._camera) throw new Error('Cannot set on resize event, camera is not defined');
    if (!this._renderer) throw new Error('Cannto set on resize event, renderer is not defined');

    this._camera.aspect = window.innerWidth / window.innerHeight;
    this._camera.updateProjectionMatrix();
    this._renderer.setSize(window.innerWidth, window.innerHeight);
  }

  private _InitOrbitControls() {
    if (!this._camera) throw new Error('Cannot initialize orbit controls, camera is missing');
    if (!this._renderer) throw new Error('Cannot initialize orbit controls, renderer is missing');

    this._orbitControls = new OrbitControls(this._camera, this._renderer.domElement);
    this._orbitControls.target.set(0, 0, 0);
    this._orbitControls.update();
  }

  private _InitPlayer() {
    if (!this._player) throw new Error('Cannot initialize player, player model is not defined');
    if (!this._scene) throw new Error('Cannot initialize player, scene is not defined');
    if (!this._camera) throw new Error('Cannot initialize player, camera is not defined');

    this._scene.add(this._player.fbx);
    this._player.fbx.position.set(0, 0, 0);
    this._camera.lookAt(...this.playerPosition.asArray());
  }

  private _AppendToDOMElement() {
    if (!this._renderer) throw new Error('Cannot append to DOM, renderer is not defined');

    const root = document.getElementById('root');
    if (root) {
      root.appendChild(this._renderer.domElement);
    } else {
      throw new Error('Cannot append to DOM, root element not found');
    }
  }
}
