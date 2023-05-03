import { PerspectiveCamera, Quaternion, Vector3 } from 'three';
import { Entity, PlayerClass } from '@core/entities';

import { CharacterControllerInput } from './CharacterControllerInput';

export class CharacterController {
  readonly _acceleration = new Vector3(1, 0.25, 500);
  readonly _velocity = new Vector3(0, 0 ,0 );
  readonly _input = new CharacterControllerInput();
  readonly _entity: Entity;
  readonly _camera: PerspectiveCamera;

  constructor(target: PlayerClass, camera: PerspectiveCamera) {
    this._entity = target;
    this._camera = camera;
  }

  Update(timeFromLastFrame: number) {
    this._entity.UpdateMotionState(timeFromLastFrame, this._input);

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
      this._entity._target._fbx.quaternion.multiply(quaternion);
    }

    if (RIGHT) {
      const axis = new Vector3(0, 1, 0);
      const quaternion = new Quaternion().setFromAxisAngle(axis, 4.0 * -Math.PI * time * this._acceleration.y);
      this._entity._target._fbx.quaternion.multiply(quaternion)
    }

    this._entity._target._fbx.quaternion.copy(this._entity._target._fbx.quaternion);
    const forward = new Vector3(0, 0, 1).applyQuaternion(this._entity._target._fbx.quaternion);
    const sideways = new Vector3(1, 0, 0).applyQuaternion(this._entity._target._fbx.quaternion);

    sideways.multiplyScalar(velocity.x * time);
    forward.multiplyScalar(velocity.z * time);

    this._entity._target._fbx.position.add(forward);
    this._entity._target._fbx.position.add(sideways);

    if (this._entity._target._animationMixer) this._entity._target._animationMixer.update(time)
    this._velocity.copy(new Vector3(0,0,0));
  }
}
