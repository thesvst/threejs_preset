import { FBXMotions, FBXLoaderManagerClass, FBXModel } from '@core/loaders';
import { Vector3, Quaternion } from 'three';
import { MotionManager } from '@core/motions';

export class Entity<T> extends FBXLoaderManagerClass<T> {
  constructor(model: FBXModel, motions: MotionManager<T>) {
    super(model, motions);
  }

  get Position() {
    const { x, y, z } = this._fbx.position

    return {
      asArray: (): [number, number, number] => [x, y, z],
      asVector3: () => new Vector3(x, y, z),
      asReference: () => this._fbx.position
    };
  }

  get Quaternion() {
    const { x, y, z, w } = this._fbx.quaternion

    return {
      asArray: (): [number, number, number, number] => [x, y, z, w],
      asQuaternion: () => new Quaternion(x, y, z, w),
      asReference: () => this._fbx.quaternion
    };
  }
}