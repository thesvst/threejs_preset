import {
  AmbientLight,
  AnimationMixer,
  Color,
  Group,
  LoadingManager,
  PCFSoftShadowMap,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer,
} from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Gui } from '../gui/Gui';

type Model = { fbx: Group; mixer: AnimationMixer; manager: LoadingManager };

export class Renderer {
  private readonly _camera = new PerspectiveCamera(60, 1920 / 1080, 1.0, 1000);
  private readonly _scene = new Scene();
  private readonly _light = new AmbientLight(0xffffff, 0.5);
  private readonly _renderer = new WebGLRenderer({ antialias: true });
  private _player: Model | null = null;
  private _lastFrameTimeElapsedMS = 0;
  private _orbitControls: null | OrbitControls = null;
  private _GUI: null | Gui = null;

  constructor(modelFolderPath: string, modelFileName: string) {
    this._Init(modelFolderPath, modelFileName);
  }

  private async _Init(modelFolderPath: string, modelFileName: string) {
    const model = await this._LoadModel(modelFolderPath, modelFileName);
    this._player = model;
    this._InitPlayer();
    this._InitOrbitControls();
    this._InitGui();

    this._InitiateRendererSettings();
    this._InitiateSceneSettings();
    this._InitiateCameraSettings();

    this._RequestAnimationFrame();

    const root = document.getElementById('root');
    const canvas = document.querySelector('#root canvas');
    if (root && !canvas) root.appendChild(this._renderer.domElement);
    window.addEventListener('resize', this._OnWindowResize);
  }

  private _OnWindowResize() {
    this._camera.aspect = window.innerWidth / window.innerHeight;
    this._camera.updateProjectionMatrix();
    this._renderer.setSize(window.innerWidth, window.innerHeight);
  }

  private _Frame() {
    this._orbitControls?.update();
  }

  private _RequestAnimationFrame() {
    requestAnimationFrame((time) => {
      this._lastFrameTimeElapsedMS = time - this._lastFrameTimeElapsedMS;
      this._RequestAnimationFrame();
      this._renderer.render(this._scene, this._camera);
      this._Frame();
    });
  }

  private _InitOrbitControls() {
    this._orbitControls = new OrbitControls(this._camera, this._renderer.domElement);
    this._orbitControls.target.set(0, 0, 0);
    this._orbitControls.update();
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

  private _InitPlayer() {
    if (this._player) {
      this._scene.add(this._player.fbx);
      this._player.fbx.position.set(0, 0, 0);
      this._camera.lookAt(this._player?.fbx?.position ?? new Vector3());
    }
  }

  private _InitiateSceneSettings() {
    this._scene.add(this._light);
    this._scene.background = new Color('skyblue');
  }

  private _InitiateCameraSettings() {
    this._camera.position.set(0, 0, -40);
  }

  private _InitiateRendererSettings() {
    this._renderer.shadowMap.enabled = true;
    this._renderer.shadowMap.type = PCFSoftShadowMap;
    this._renderer.setPixelRatio(window.devicePixelRatio);
    this._renderer.setSize(window.innerWidth, window.innerHeight);
  }

  private _InitGui() {
    this._GUI = new Gui();
    const camPos = { folderName: 'Cam Position', target: this._camera.position, name: 'Position' };
    const camRot = { folderName: 'Cam Rotation', target: this._camera.rotation, name: 'Rotation' };
    this._GUI.AddEntityToFolder(camPos);
    this._GUI.AddEntityToFolder(camRot);
  }
}
