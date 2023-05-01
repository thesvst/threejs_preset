import { PerspectiveCamera, Vector3 } from 'three';
import { Entity } from '@core/entities';

export class ThirdPersonCamera<T> {
  readonly _currentPosition = new Vector3(0,0,0);
  readonly _currentLookAt = new Vector3(0,0,0);

  _target: Entity<T>;
  _camera = new PerspectiveCamera();

  constructor(target: Entity<T>) {
    this._target = target;
  }

  _CalculateIdealOffset() {
    if (!this._target._fbx) throw new Error('Cannot calculate offset, fbx is missing');
    const idealOffset = new Vector3(-15, 20, -30);

    idealOffset.applyQuaternion(this._target.Quaternion.asQuaternion());
    idealOffset.add(this._target.Position.asVector3());
    return idealOffset;
  }

  _CalculateIdealLookAt() {
    if (!this._target._fbx) throw new Error('Cannot calculate lookat, fbx is missing');
    const idealLookAt = new Vector3(0, 10, 50);

    idealLookAt.applyQuaternion(this._target.Quaternion.asQuaternion());
    idealLookAt.add(this._target.Position.asVector3());
    return idealLookAt;
  }

  Update() {
    let idealOffset = this._CalculateIdealOffset();
    let idealLookAt = this._CalculateIdealLookAt();

    this._currentPosition.copy(idealOffset);
    this._currentLookAt.copy(idealLookAt);

    this._camera.position.copy(this._currentPosition);
    this._camera.lookAt(this._currentLookAt);
  }
}
