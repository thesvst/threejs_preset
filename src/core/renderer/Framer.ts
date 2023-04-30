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
  private _lastFrameTime = new Date().getTime();

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
