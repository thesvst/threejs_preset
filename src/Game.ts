import {
  AmbientLight,
  Color,
  Mesh,
  MeshStandardMaterial,
  PCFSoftShadowMap,
  PlaneGeometry,
  RepeatWrapping,
  Scene,
  TextureLoader,
  Vector3,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Framer } from '@core/renderer';
import { Gui } from '@core/gui';
import { ThirdPersonCamera } from '@core/cameras';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { NPC, NPCClass, Player, PlayerClass } from '@core/entities';
import { Motions } from '@core/motions/MotionStates';

// TODO: Replace all manually triggered errors by new logger class
export class Game {
  _player: PlayerClass | null = null;
  _NPCs: NPCClass[] = [];
  _Framer: Framer | null = null;
  _GUI: { camera: Gui; player: Gui } | null = null;
  _camera: ThirdPersonCamera | null = null;
  _light: AmbientLight | null = null;
  _scene: Scene | null = null;
  _renderer: WebGLRenderer | null = null;
  _orbitControls: OrbitControls | null = null;

  public async Init() {
    this._player = await Player();
    await this._InitScene();
    await this._InitializeNPCs()

    this._InitLights();
    this._InitCamera();
    this._InitPlayer();

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
    if (!this._scene) throw new Error('Cannot init framer, scene is not');
    if (!this._camera) throw new Error('Cannot init framer, scene is not defined');
    if (!this._player) throw new Error('Cannot init framer, scene is not defined');
    if (!this._renderer) throw new Error('Cannot init framer, scene is not defined');
    this._Framer = new Framer(this._scene, this._camera, this._player, this._renderer, this._NPCs);
  }

  private _InitLights() {
    if (this._scene) {
      this._scene.add(new AmbientLight(0xffffff, 0.5));
    } else {
      throw new Error('Cannot add light, scene is not defined');
    }
  }

  private _InitCamera() {
    if (!this._player?._target._fbx) throw new Error('Cannot initiate camera, player is not defined');
    this._camera = new ThirdPersonCamera(this._player);
  }

  private async _InitScene() {
    this._scene = new Scene();
    this._scene.background = new Color('skyblue');
    const mapSize = 250;
    const groundTexture = new TextureLoader().load('src/assets/grounds/ground.jpg');
    groundTexture.wrapS = groundTexture.wrapT = RepeatWrapping
    groundTexture.repeat.setScalar(mapSize / 25)

    const plane = new Mesh(
      new PlaneGeometry(500, 500, 50, 50),
      new MeshStandardMaterial({ map: groundTexture }),
    );
    plane.rotation.x = -Math.PI / 2;

    const wall1 = new Mesh(
      new PlaneGeometry(300, 150, 50, 50),
      new MeshStandardMaterial({ color: new Color('#000') }),
    );

    const wall2 = wall1.clone();
    const wall3 = wall1.clone();
    const wall4 = wall1.clone();
    const wall5 = wall1.clone();
    wall1.position.set(-35,0,0)
    wall1.rotation.y = Math.PI * 0.5;
    wall2.position.set(35,0,0)
    wall2.rotation.y = Math.PI * -0.5;
    wall3.position.set(35,0,150)
    wall3.rotation.y = Math.PI * -1;
    wall4.position.set(0,50,0)
    wall4.rotation.x = Math.PI * 0.5;
    wall5.position.z = -25;

    this._scene.add(wall1);
    this._scene.add(wall2);
    this._scene.add(wall3);
    this._scene.add(wall4);
    this._scene.add(wall5);

    const DJKitLoader = new GLTFLoader();
    DJKitLoader.load('src/assets/objects/djset.glb', (gltf) => {
      const obj = gltf.scene;
      obj.scale.setScalar(12)
      obj.position.set(-40,-15, 65)
      obj.rotation.set(obj.rotation.x, Math.PI * -1, obj.rotation.z)

      this._scene?.add(gltf.scene)
    })

    this._scene.add(plane);
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
    if (!this._player?._target._fbx) throw new Error('Cannot initialize player, player model is not defined');
    if (!this._scene) throw new Error('Cannot initialize player, scene is not defined');
    if (!this._camera) throw new Error('Cannot initialize player, camera is not defined');

    this._scene.add(this._player._target._fbx);
    this._player._target._fbx.position.set(0, -0.02, 0);
    this._camera._camera.lookAt(this._player.Position.asVector3());
  }
  private async _InitializeNPCs() {
    [
      new Vector3(-25, 0,50),
      new Vector3(0, 0,50),
      new Vector3(25, 0,50)
    ].map(async (vector, index) => {
      const npc = await NPC(`NPC-${index}`);
      this._NPCs.push(npc)
      npc._target._fbx.position.copy(vector)
      npc._target._fbx.lookAt(0,0,0)
      npc.SetMotionState(Motions.DANCE)
      this._scene?.add(npc._target._fbx)
    })
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
}
