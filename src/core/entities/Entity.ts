import { FBXLoaderManagerClass } from '@core/loaders';
import { Vector3, Quaternion } from 'three';
import { MotionManager } from '@core/motions';
import { Motions, MotionState } from '@core/motions/MotionStates';
import { EntityController, EntityControllerInput } from '@core/controllers';

export class Entity extends MotionManager {
  _target: FBXLoaderManagerClass;
  _controller: EntityController;

  constructor(model: FBXLoaderManagerClass, input: EntityControllerInput) {
    super(model);
    this._target = model;
    this._controller = new EntityController(this, input)
  }

  get Position() {
    const { x, y, z } = this._target._fbx.position

    return {
      asArray: (): [number, number, number] => [x, y, z],
      asVector3: () => new Vector3(x, y, z),
      asReference: () => this._target._fbx.position
    };
  }

  get Quaternion() {
    const { x, y, z, w } = this._target._fbx.quaternion

    return {
      asArray: (): [number, number, number, number] => [x, y, z, w],
      asQuaternion: () => new Quaternion(x, y, z, w),
      asReference: () => this._target._fbx.quaternion
    };
  }

  public AddMotionState(name: Motions, type: MotionState) {
    this.AddState(name, type)
  }

  public SetMotionState(name: Motions) {
    this.SetState(name)
  }

  public UpdateMotionState(timeFromLastFrame: number, input: EntityControllerInput) {
    this.Update(timeFromLastFrame, input)
  }
}