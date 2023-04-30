import { AnimationActionNames, DanceState, FiniteStateMachine, IdleState, WalkState } from '../../';

export class CharacterFSM extends FiniteStateMachine {
  constructor() {
    super();
    this._Init();
  }

  private _Init() {
    this.AddState(AnimationActionNames.IDLE, IdleState);
    this.AddState(AnimationActionNames.WALK, WalkState);
    this.AddState(AnimationActionNames.DANCE, DanceState);
  }
}
