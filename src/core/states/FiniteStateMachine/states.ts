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

  public Enter(prevState: InstanceType<AnimationType>) {
    const idleAction = this._parent._animations[AnimationActionNames.IDLE].action;

    if (prevState) {
      const prevAction = this._parent._animations[prevState.Name].action;
      idleAction.time = 0.0;
      idleAction.enabled = true;
      idleAction.setEffectiveTimeScale(1.0);
      idleAction.setEffectiveWeight(1.0);
      idleAction.crossFadeFrom(prevAction, 0.5, true);
      idleAction.play();
    } else {
      idleAction.reset().play();
    }
  }

  public Exit() {}

  public Update(_, input) {
    if (input._actions.FORWARD || input._actions.BACKWARD) {
     this._parent.SetState(AnimationActionNames.WALK)
    }
  }
}

export class WalkState extends State {
  get Name() {
    return AnimationActionNames.WALK;
  }

  public Enter(prevState: InstanceType<AnimationType>) {
    const currentAction = this._parent._animations[AnimationActionNames.WALK].action;
    const prevAction = this._parent._animations[prevState.Name].action;
    if (prevState) {
      currentAction.enabled = true;
      currentAction.time = 0.0;
      currentAction.setEffectiveTimeScale(1.0);
      currentAction.setEffectiveWeight(1.0);
      currentAction.crossFadeFrom(prevAction, 0.5, true);
      currentAction.play();
    } else {
      currentAction.play();
    }
  }

  public Exit() {}

  public Update(_, input) {
    if (input._actions.FORWARD || input._actions.BACKWARD) return;
    this._parent.SetState(AnimationActionNames.IDLE);
  }
}

export class DanceState extends State {
  get Name() {
    return AnimationActionNames.DANCE;
  }

  public Enter(prevState: InstanceType<AnimationType>) {}

  public Exit() {}

  public Update() {}
}
