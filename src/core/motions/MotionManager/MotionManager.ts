import { AnimationActionNames, DanceState, FiniteStateMachine, IdleState, WalkState } from '@core/states';

export type Motion<T> = {
  name: T,
  fileName: string,
  manager: any; // TODO: states
}

export class MotionManager<T, K> extends FiniteStateMachine<T, K> {
  _folderPath: string;
  _motions: Motion<T>[];
  constructor(folderPath: string, motions: Motion<T>[]) {
    super();
    this._folderPath = folderPath
    this._motions = motions

    this._Init();
  }

  private _Init() {
    this._motions.map((motion) => {
      this.AddState(motion.name, motion.manager)
    })
  }
}