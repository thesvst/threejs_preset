import { EntityControllerInputClass } from '@core/controllers/EntityControllerInputClass';

enum Actions {
  FORWARD = 'FORWARD',
  BACKWARD = 'BACKWARD',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
}

type ActionsMap = { [key: string]: Actions };

const actionsMapInitialState = {
  w: Actions.FORWARD,
  a: Actions.LEFT,
  s: Actions.BACKWARD,
  d: Actions.RIGHT,
};

export class KeyboardControllerInput extends EntityControllerInputClass {
  private readonly _actionsMap: ActionsMap = actionsMapInitialState;

  get actions() {
    return this._actions;
  }

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
    window.removeEventListener('keydown', this._onKeyDownListener.bind(this));
    window.removeEventListener('keyup', this._onKeyUpListener.bind(this));

    Object.keys(this._actions).forEach((key) => {
      this._actions[this._actionsMap[key]] = false;
    });
  }
}
