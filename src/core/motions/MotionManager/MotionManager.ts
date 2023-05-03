import { FiniteStateMachine, MotionState } from '@core/states';
import { FBXLoaderManagerClass } from '@core/loaders';

export type Motion<T> = {
  name: T,
  fileName: string,
  manager: MotionState;
}

export class MotionManager<T, K> extends FiniteStateMachine<T, K> {
  _target: FBXLoaderManagerClass<T, K>

  constructor(target: FBXLoaderManagerClass<T, K>) {
    super();
    this._target = target;

    this._Init();
  }

  private _Init() {
    this._target._motions.map((motion) => {
      this.AddMotionState(motion.name, motion.manager)
    })

    this.SetMotionState(this._target._motions[0].name)
  }

  protected AddMotionState(name: T, type: K) {
    this.AddState(name, type)
  }

  protected SetMotionState(name: T) {
    this.SetState(name)
  }

  protected UpdateMotionState(timeFromLastFrame: number, input) {
    this.Update(timeFromLastFrame, input)
  }
}