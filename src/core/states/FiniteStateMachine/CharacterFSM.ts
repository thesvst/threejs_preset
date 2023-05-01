import { AnimationAction } from 'three';
import {
  AnimationActionNames,
  AnimationType,
  DanceState,
  FiniteStateMachine,
  IdleState,
  WalkState,
} from '@core/states';

type Animations = { [key: string]: { clip: any; action: AnimationAction } }

export class CharacterFSM extends FiniteStateMachine<AnimationActionNames, AnimationType> {
  _animations: Animations

  constructor(animations: Animations) {
    super();
    this._Init();
    this._animations = animations
  }

  private _Init() {
    this.AddState(AnimationActionNames.IDLE, IdleState);
    this.AddState(AnimationActionNames.WALK, WalkState);
    this.AddState(AnimationActionNames.DANCE, DanceState);
  }
}
