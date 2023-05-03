import { Motions, MotionState } from '@core/motions/MotionStates';
import { FBXLoaderManagerClass } from '@core/loaders';
import { EntityControllerInput } from '@core/controllers';

export class FiniteStateMachine {
  _states: Partial<Record<Motions, MotionState>> = {};
  _currentState: InstanceType<MotionState> | null;
  _target: FBXLoaderManagerClass

  constructor(target: FBXLoaderManagerClass) {
    this._currentState = null;
    this._target = target;
  }

  public AddState(name: Motions, type: MotionState) {
    this._states[name] = type;
  }

  public SetState(name: Motions) {
    const prevState = this._currentState;
    const NewStateClass = this._states[name];

    if (prevState) {
      if (prevState._name == name) return;
      prevState.Exit();
    }

    if (NewStateClass) {
      const state = new NewStateClass(this);
      this._currentState = state;

      if (!prevState) {
        this._currentState.Enter(state)
      } else {
        this._currentState.Enter(prevState)
      }
    }
  }

  public Update(timeFromLastFrame: number, input: EntityControllerInput) {
    if (this._currentState) {
      this._currentState.Update(timeFromLastFrame, input);
    }
  }
}