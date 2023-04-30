enum Actions {
  FORWARD = 'FORWARD',
  BACKWARD = 'BACKWARD',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
}

export class CharacterController {
  private readonly _actionsMap: { [key: string]: Actions } = {
    w: Actions.FORWARD,
    a: Actions.LEFT,
    s: Actions.BACKWARD,
    d: Actions.RIGHT,
  };

  private _actions = {
    [Actions.FORWARD]: false,
    [Actions.BACKWARD]: false,
    [Actions.LEFT]: false,
    [Actions.RIGHT]: false,
  };

  private _onKeyUpListener(e: KeyboardEvent) {
    e.preventDefault();
    if (Object.hasOwn(this._actions, this._actionsMap[e.key])) this._actions[this._actionsMap[e.key]] = false;
  }

  private _onKeyDownListener(e: KeyboardEvent) {
    e.preventDefault();
    if (Object.hasOwn(this._actions, this._actionsMap[e.key])) this._actions[this._actionsMap[e.key]] = true;
  }

  public turnOnKeyboardControls() {
    window.addEventListener('keydown', this._onKeyDownListener.bind(this));
    window.addEventListener('keyup', this._onKeyUpListener.bind(this));
  }

  public turnOffKeyboardControls() {
    window.removeEventListener('keydown', this._onKeyDownListener);
    window.removeEventListener('keyup', this._onKeyUpListener);

    Object.keys(this._actions).forEach((key) => {
      this._actions[this._actionsMap[key]] = false;
    });
  }
}
