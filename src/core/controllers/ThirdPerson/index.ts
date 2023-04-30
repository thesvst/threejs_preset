import { PerspectiveCamera, Quaternion, Vector3 } from 'three';
import { CharacterControllerInput } from './CharacterControllerInput';
import { FBXModel, FiniteStateMachine } from '../../';

export class CharacterController {
  _input = new CharacterControllerInput();
  _stateMachine = new FiniteStateMachine();
  _decceleration = new Vector3(-0.0005, -0.0001, -5.0);
  _acceleration = new Vector3(1, 0.25, 0.5);
  _velocity = new Vector3();
  _position = new Vector3();
  _lookAt = new Vector3();
  _target: FBXModel;
  _camera: PerspectiveCamera;

  constructor(target: FBXModel, camera: PerspectiveCamera) {
    this._target = target;
    this._camera = camera;
  }

  Update(timeMS: number) {
    const time = timeMS * 0.001;
    const velocity = this._velocity;
    if (!this._target._fbx) throw new Error('Target model is not defined');

    const acceleration = this._acceleration.clone();

    const { FORWARD, BACKWARD, LEFT, RIGHT } = this._input.actions;

    if (FORWARD) {
      velocity.z += acceleration.z * time;
    }

    if (BACKWARD) {
      velocity.z -= acceleration.z * time;
    }

    if (LEFT) {
      const axis = new Vector3(0, 1, 0);
      const quaternion = new Quaternion().setFromAxisAngle(axis, 4.0 * Math.PI * time * this._acceleration.y);
      this._target._fbx.quaternion.set(quaternion.x, quaternion.y, quaternion.z, quaternion.w);
    }

    if (RIGHT) {
      const axis = new Vector3(0, 1, 0);
      const quaternion = new Quaternion().setFromAxisAngle(axis, 4.0 * -Math.PI * time * this._acceleration.y);
      this._target._fbx.quaternion.set(quaternion.x, quaternion.y, quaternion.z, quaternion.w);
    }

    this._target._fbx.quaternion.copy(this._target._fbx.quaternion);
    const forward = new Vector3(0, 0, 1).applyQuaternion(this._target._fbx.quaternion);
    const sideways = new Vector3(1, 0, 0).applyQuaternion(this._target._fbx.quaternion);

    sideways.multiplyScalar(velocity.x * time);
    forward.multiplyScalar(velocity.z * time);

    this._target._fbx.position.add(forward);
    this._target._fbx.position.add(sideways);

    this._velocity = new Vector3();
  }
}
