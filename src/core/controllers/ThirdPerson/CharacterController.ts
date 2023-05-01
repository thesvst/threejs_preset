import { PerspectiveCamera, Quaternion, Vector3 } from 'three';
import { FBXModel } from '@core/models';

import { CharacterControllerInput } from './CharacterControllerInput';

export class CharacterController {
  readonly _acceleration = new Vector3(1, 0.25, 120);
  readonly _velocity = new Vector3(0, 0 ,0 );
  readonly _input = new CharacterControllerInput();
  readonly _target: FBXModel;
  readonly _camera: PerspectiveCamera;

  constructor(target: FBXModel, camera: PerspectiveCamera) {
    this._target = target;
    this._camera = camera;
  }

  Update(timeFromLastFrame: number) {
    if (!this._target._fbx) throw new Error('Target model is not defined');
    if (!this._target._stateMachine) throw new Error ('State machine is not defined');
    this._target._stateMachine.Update(timeFromLastFrame, this._input);

    const time = timeFromLastFrame * 0.001;
    const velocity = this._velocity;

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
      this._target._fbx.quaternion.multiply(quaternion);
    }

    if (RIGHT) {
      const axis = new Vector3(0, 1, 0);
      const quaternion = new Quaternion().setFromAxisAngle(axis, 4.0 * -Math.PI * time * this._acceleration.y);
      this._target._fbx.quaternion.multiply(quaternion)
    }

    this._target._fbx.quaternion.copy(this._target._fbx.quaternion);
    const forward = new Vector3(0, 0, 1).applyQuaternion(this._target._fbx.quaternion);
    const sideways = new Vector3(1, 0, 0).applyQuaternion(this._target._fbx.quaternion);

    sideways.multiplyScalar(velocity.x * time);
    forward.multiplyScalar(velocity.z * time);

    this._target._fbx.position.add(forward);
    this._target._fbx.position.add(sideways);

    if (this._target._mixer) this._target._mixer.update(time)
    this._velocity.copy(new Vector3(0,0,0));
  }
}