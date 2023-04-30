import { AnimationActionNames, AnimationType } from './types';

class State {
  get Name() {
    return 'unknown';
  }
}

export class IdleState extends State {
  get Name() {
    return AnimationActionNames.IDLE;
  }

  Enter(state: InstanceType<AnimationType>) {}

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
