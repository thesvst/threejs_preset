import { AnimationActionNames, AnimationType } from '../../states/FiniteStateMachine/types';
import { MotionManager } from '@core/motions';

// TODO: Think how to resolve generic/hardcoded names issue

export type MotionState =
  typeof IdleState |
  typeof WalkState |
  typeof DanceState;

class State<T, K> {
  _parent: MotionManager<T, K>

  constructor(parent) {
    this._parent = parent;
  }
}

export class IdleState<T, K> extends State<T, K> {
  constructor(parent) {
    super(parent);
  }
  get Name() {
    return AnimationActionNames.IDLE;
  }

  public Enter(prevState: InstanceType<AnimationType>) {
    const idleAction = this._parent._target._animationsManager[AnimationActionNames.IDLE].action;

    if (prevState) {
      const prevAction = this._parent._target._animationsManager[prevState.Name].action;
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

export class WalkState<T, K> extends State<T, K> {
  get Name() {
    return AnimationActionNames.WALK;
  }

  public Enter(prevState: InstanceType<AnimationType>) {
    const currentAction = this._parent._target._animationsManager[AnimationActionNames.WALK].action;
    const prevAction = this._parent._target._animationsManager[prevState.Name].action;
    if (prevState) {
      currentAction.enabled = true;
      currentAction.time = 0.0;
      currentAction.setEffectiveTimeScale(1.0);
      currentAction.setEffectiveWeight(1.0);
      currentAction.crossFadeFrom(prevAction, 0.5, true);
      currentAction.play();
    } else {
      currentAction.reset().play();
    }
  }

  public Exit() {}

  public Update(_, input) {
    if (input._actions.FORWARD || input._actions.BACKWARD) return;
    this._parent.SetState(AnimationActionNames.IDLE);
  }
}

export class DanceState<T, K> extends State<T, K> {
  get Name() {
    return AnimationActionNames.DANCE;
  }

  public Enter(prevState: InstanceType<AnimationType>) {}

  public Exit() {}

  public Update() {}
}
