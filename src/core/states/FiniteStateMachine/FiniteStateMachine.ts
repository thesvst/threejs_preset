import { AnimationActionNames, AnimationType } from './types';

export class FiniteStateMachine {
  _states: Record<AnimationActionNames, AnimationType>;
  _currentState: InstanceType<AnimationType> | null = null;

  constructor() {
    this._states = {} as Record<AnimationActionNames, AnimationType>;
    this._currentState = null;
  }

  public AddState(name: AnimationActionNames, type: AnimationType) {
    this._states[name] = type;
  }

  public SetState(name: AnimationActionNames) {
    const prevState = this._currentState;

    if (prevState) {
      if (prevState.Name == name) return;
      prevState.Exit();
    }

    const state = new this._states[name](); // TODO: check this context
    this._currentState = state;
    if (prevState) {
      // TODO: Check if won't be any coflicts
      state.Enter(prevState);
    }
  }
}
