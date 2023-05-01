export class FiniteStateMachine<T, K> {
  _states: Record<T, K>;
  _currentState: InstanceType<K> | null = null;

  constructor() {
    this._states = {} as Record<T, K>;
    this._currentState = null;
  }

  public AddState(name: T, type: K) {
    this._states[name] = type;
  }

  public SetState(name: T) {
    const prevState = this._currentState;

    if (prevState) {
      if (prevState.Name == name) return;
      prevState.Exit();
    }

    const state = new this._states[name](this);

    this._currentState = state;
    state.Enter(prevState);
  }
}
