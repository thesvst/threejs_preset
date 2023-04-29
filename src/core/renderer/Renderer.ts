import { Camera, PerspectiveCamera, Scene, Vector3, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Model } from 'types';

// TODO: Rename to Framer
export class Renderer {
  private readonly _camera: Camera;
  private readonly _scene: Scene;
  private _player: Model;
  private readonly _renderer: WebGLRenderer;
  
  private _orbitControls: null | OrbitControls = null;
  private _lastFrameTimeElapsedMS = 0;

  constructor(scene: Scene, camera: PerspectiveCamera, player: Model, renderer: WebGLRenderer) {
    this._scene = scene;
    this._camera = camera;
    this._player = player;
    this._renderer = renderer;

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
    this._RequestAnimationFrame();
    this._renderer.render(this._scene, this._camera);
  }

  private _RequestAnimationFrame() {
    requestAnimationFrame((time) => {
      this._Frame(time);
    });
  }
}
