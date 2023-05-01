import { Scene, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { ThirdPersonCamera } from '@core/cameras';
import { CharacterController } from '@core/controllers';
import { PlayerClass } from '@core/entities';

export class Framer<T> {
  private readonly _camera: ThirdPersonCamera<T>;
  private readonly _scene: Scene;
  private _player: PlayerClass<T>;
  private readonly _renderer: WebGLRenderer;
  private readonly _controller: CharacterController<T>;

  private _orbitControls: null | OrbitControls = null;
  private _lastFrameTime = new Date().getTime();

  constructor(
    scene: Scene,
    camera: ThirdPersonCamera<T>,
    player: PlayerClass<T>,
    renderer: WebGLRenderer,
    controller: CharacterController<T>,
  ) {
    this._scene = scene;
    this._camera = camera;
    this._player = player;
    this._renderer = renderer;
    this._controller = controller;

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
    this._controller.Update(timeFromLastFrame);
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
