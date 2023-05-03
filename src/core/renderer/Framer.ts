import { Scene, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { ThirdPersonCamera } from '@core/cameras';
import { NPCClass, PlayerClass } from '@core/entities';

export class Framer {
  private readonly _camera: ThirdPersonCamera;
  private readonly _scene: Scene;
  private readonly _player: PlayerClass;
  private readonly _renderer: WebGLRenderer;
  private readonly _NPCs: NPCClass[];

  private _orbitControls: null | OrbitControls = null;
  private _lastFrameTime = new Date().getTime();

  constructor(
    scene: Scene,
    camera: ThirdPersonCamera,
    player: PlayerClass,
    renderer: WebGLRenderer,
    NPCs: NPCClass[]
  ) {
    this._scene = scene;
    this._camera = camera;
    this._player = player;
    this._renderer = renderer;
    this._NPCs = NPCs;

    this._Init();
  }

  // TODO: Add switch to disable other controls, enable Orbit
  public UpdateOrbitControls(orbitControls: null | OrbitControls) {
    this._orbitControls = orbitControls;
  }

  private _Init() {
    this._RequestAnimationFrame();
  }

  private _Frame(timeFromLastFrame: number) {
    this._orbitControls?.update();
    this._player._controller.Update(timeFromLastFrame);
    this._NPCs.forEach((npc) => {
      npc._controller.Update(timeFromLastFrame)
    })
    this._camera.Update();
    this._renderer.render(this._scene, this._camera._camera);
  }

  private _RequestAnimationFrame() {
    this._renderer.setAnimationLoop(() => {
      const time = (new Date().getTime() - this._lastFrameTime);
      this._Frame(time);
      this._lastFrameTime = new Date().getTime();
    });
  }
}