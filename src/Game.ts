import { AmbientLight, Color, PCFSoftShadowMap, Scene, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { ThirdPersonCamera, CharacterController, Gui, Framer, FBXModel } from './core';

export class Game {
  _player: FBXModel | null = null;
  _Framer: Framer | null = null;
  _GUI: { camera: Gui; player: Gui } | null = null;
  _camera: ThirdPersonCamera | null = null;
  _light: AmbientLight | null = null;
  _scene: Scene | null = null;
  _renderer: WebGLRenderer | null = null;
  _orbitControls: OrbitControls | null = null;
  _controller: CharacterController | null = null;

  constructor() {
    this._Init();
  }

  private async _Init() {
    const model = await FBXModel._CreateInstance('src/assets/characters/', 'character.fbx');
    this._player = model;

    this._InitScene();
    this._InitLights();
    this._InitCamera();
    this._InitPlayer();

    this._InitCharacterController();
    this._InitRenderer();
    this._InitFramer();

    this._InitGui();
    this._InitOrbitControls();

    this._AppendToDOMElement();

    window.addEventListener('resize', this._OnWindowResize.bind(this));
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
    if (!this._controller) throw new Error('Cannot initialize framer due to missing controller');

    this._Framer = new Framer(this._scene, this._camera, this._player, this._renderer, this._controller);
  }

  private _InitLights() {
    if (this._scene) {
      this._scene.add(new AmbientLight(0xffffff, 0.5));
    } else {
      throw new Error('Cannot add light, scene is not defined');
    }
  }

  private _InitCamera() {
    if (!this._player?._fbx) throw new Error('Cannot initiate camera, player is not defined');

    this._camera = new ThirdPersonCamera(this._player);
    this._camera._camera.position.set(0, 0, -40);
  }

  private _InitScene() {
    this._scene = new Scene();
    this._scene.background = new Color('skyblue');
  }

  private _InitGui() {
    if (this._camera) {
      const gui = { camera: new Gui(), player: new Gui() };

      const camPosition = { folderName: 'Cam Position', target: this._camera._camera.position, name: 'Position' };
      const camRotation = { folderName: 'Cam Rotation', target: this._camera._camera.rotation, name: 'Rotation' };
      const playerPosition = { folderName: 'Player Position', target: this._camera._camera.position, name: 'Position' };
      const playerRotation = { folderName: 'Player Rotation', target: this._camera._camera.position, name: 'Rotation' };

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

    this._camera._camera.aspect = window.innerWidth / window.innerHeight;
    this._camera._camera.updateProjectionMatrix();
    this._renderer.setSize(window.innerWidth, window.innerHeight);
  }

  private _InitOrbitControls() {
    if (!this._camera) throw new Error('Cannot initialize orbit controls, camera is missing');
    if (!this._renderer) throw new Error('Cannot initialize orbit controls, renderer is missing');

    this._orbitControls = new OrbitControls(this._camera._camera, this._renderer.domElement);
    this._orbitControls.target.set(0, 0, 0);
    this._orbitControls.update();
  }

  private _InitPlayer() {
    if (!this._player?._fbx) throw new Error('Cannot initialize player, player model is not defined');
    if (!this._scene) throw new Error('Cannot initialize player, scene is not defined');
    if (!this._camera) throw new Error('Cannot initialize player, camera is not defined');

    this._scene.add(this._player._fbx);
    this._player._fbx.position.set(0, 0, 0);
    this._camera._camera.lookAt(...this._player.Position.asArray());
  }

  private _AppendToDOMElement() {
    if (!this._renderer) throw new Error('Cannot append to DOM, renderer is not defined');

    const root = document.getElementById('root');
    if (root) {
      root.appendChild(this._renderer.domElement);
      this._OnWindowResize();
    } else {
      throw new Error('Cannot append to DOM, root element not found');
    }
  }

  private _InitCharacterController() {
    if (!this._player) throw new Error('Cannot initiate character controller, player is not defined');
    if (!this._camera) throw new Error('Cannot initiate character controller, camera is not defined');

    this._controller = new CharacterController(this._player, this._camera._camera);
    this._controller._input.turnOnKeyboardControls();
  }
}
