import { AnimationActionNames, AnimationType } from './types';
import { CharacterFSM } from '@core/states/FiniteStateMachine/CharacterFSM';

class State {
  _parent: CharacterFSM

  constructor(parent) {
    this._parent = parent;
  }
}

export class IdleState extends State {
  constructor(parent) {
    super(parent);
  }
  get Name() {
    return AnimationActionNames.IDLE;
  }

  Enter(prevState: InstanceType<AnimationType>) {
    const idleAction = this._parent._animations[AnimationActionNames.IDLE].action;

    if (prevState) {

    } else {
      idleAction.play();
    }
  }

  Exit() {}

  Update() {}
}

export class WalkState extends State {
  get Name() {
    return AnimationActionNames.WALK;
  }

  Enter(state: InstanceType<AnimationType>) {}

  Exit() {}

  Update() {}
}

export class DanceState extends State {
  get Name() {
    return AnimationActionNames.DANCE;
  }

  Enter(state: InstanceType<AnimationType>) {}

  Exit() {}

  Update() {}
}
