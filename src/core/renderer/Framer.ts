import { ThirdPersonCamera } from 'core/cameras';
import { CharacterController } from 'core/controllers';
import { FBXModel } from 'core/models';
import { Scene, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export class Framer {
  private readonly _camera: ThirdPersonCamera;
  private readonly _scene: Scene;
  private _player: FBXModel;
  private readonly _renderer: WebGLRenderer;
  private readonly _controller: CharacterController;

  private _orbitControls: null | OrbitControls = null;
  private _lastFrameTimeElapsedMS = 0;

  constructor(
    scene: Scene,
    camera: ThirdPersonCamera,
    player: FBXModel,
    renderer: WebGLRenderer,
    controller: CharacterController,
  ) {
    this._scene = scene;
    this._camera = camera;
    this._player = player;
    this._renderer = renderer;
    this._controller = controller;

    this._Init();
  }

  public UpdateOrbitControls(orbitControls: null | OrbitControls) {
    this._orbitControls = orbitControls;
  }

  private async _Init() {
    this._RequestAnimationFrame();
  }

  private _Frame(timeMS: number) {
    this._orbitControls?.update();
    this._lastFrameTimeElapsedMS = timeMS - this._lastFrameTimeElapsedMS;
    this._controller.Update(timeMS);
    this._camera.Update();
    this._RequestAnimationFrame();
    this._renderer.render(this._scene, this._camera._camera);
  }

  private _RequestAnimationFrame() {
    requestAnimationFrame((time) => {
      this._Frame(time);
    });
  }
}
