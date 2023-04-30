import { FBXModel } from 'core/models';
import { PerspectiveCamera, Vector3 } from 'three';

export class ThirdPersonCamera {
  readonly _currentPosition = new Vector3();
  readonly _currentLookat = new Vector3();

  _target: FBXModel;
  _camera = new PerspectiveCamera();

  constructor(target: FBXModel) {
    this._target = target;
  }

  _CalculateIdealOffset() {
    if (!this._target._fbx) throw new Error('Cannot calculate offset, fbx is missing');
    const idealOffset = new Vector3(-15, 20, -30);

    idealOffset.applyQuaternion(this._target.Quaternion.asQuaternion());
    idealOffset.add(this._target.Position.asVector3());
    return idealOffset;
  }

  _CalculateIdealLookat() {
    if (!this._target._fbx) throw new Error('Cannot calculate lookat, fbx is missing');
    const idealLookat = new Vector3(0, 10, 50);

    idealLookat.applyQuaternion(this._target.Quaternion.asQuaternion());
    idealLookat.add(this._target.Position.asVector3());
    return idealLookat;
  }

  Update() {
    let idealOffset = this._CalculateIdealOffset();
    let idealLookat = this._CalculateIdealLookat();

    this._currentPosition.copy(idealOffset);
    this._currentLookat.copy(idealLookat);

    this._camera.position.copy(this._currentPosition);
    this._camera.lookAt(this._currentLookat);
  }
}
