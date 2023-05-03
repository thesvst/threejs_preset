import { FiniteStateMachine } from '@core/states';
import { EntityControllerInput } from '@core/controllers';

export enum Motions {
  IDLE = 'IDLE',
  WALK = 'WALK',
  DANCE = 'DANCE',
}

export type MotionState =
  typeof IdleState |
  typeof WalkState |
  typeof DanceState;

class MotionStateClass {
  _parent: FiniteStateMachine
  _name: Motions;

  constructor(parent: FiniteStateMachine, name: Motions) {
    this._parent = parent;
    this._name = name;
  }
}

export class IdleState extends MotionStateClass {
  constructor(parent: FiniteStateMachine) {
    super(parent, Motions.IDLE);
  }

  public Enter(prevState: InstanceType<MotionState>) {
    const idleAction = this._parent._target._animationsManager[this._name].action;

    if (prevState) {
      const prevAction = this._parent._target._animationsManager[prevState._name].action;
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

  public Update(time: number, input: EntityControllerInput) {
    if (input.actions.FORWARD || input.actions.BACKWARD) {
     this._parent.SetState(Motions.WALK)
    }
  }
}

export class WalkState extends MotionStateClass {
  constructor(parent: FiniteStateMachine) {
    super(parent, Motions.WALK);
  }

  public Enter(prevState: InstanceType<MotionState>) {
    const currentAction = this._parent._target._animationsManager[this._name].action;
    const prevAction = this._parent._target._animationsManager[prevState._name].action;
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

  public Update(_: number, input: EntityControllerInput) {
    if (input.actions.FORWARD || input.actions.BACKWARD) return;
    this._parent.SetState(Motions.IDLE);
  }
}

export class DanceState extends MotionStateClass {
  constructor(parent: FiniteStateMachine) {
    super(parent, Motions.DANCE);
  }

  public Enter(prevState: InstanceType<MotionState>) {
    const currentAction = this._parent._target._animationsManager[this._name].action;
    currentAction.reset().play();
  }

  public Exit() {}

  public Update(time: number, input: EntityControllerInput) {}
}
