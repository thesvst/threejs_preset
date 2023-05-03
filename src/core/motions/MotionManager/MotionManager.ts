import { FiniteStateMachine } from '@core/states';
import { FBXLoaderManagerClass } from '@core/loaders';
import { Motions, MotionState } from '@core/motions/MotionStates';
import { CharacterControllerInput } from '@core/controllers/ThirdPerson/CharacterControllerInput';

export type Motion = {
  name: Motions,
  fileName: string,
  manager: MotionState;
}

export class MotionManager extends FiniteStateMachine {
  _target: FBXLoaderManagerClass

  constructor(target: FBXLoaderManagerClass) {
    super(target);
    this._target = target;

    this._Init();
  }

  private _Init() {
    this._target._motions.map((motion) => {
      this.AddMotionState(motion.name, motion.manager)
    })

    const defaultMotionName = this._target._motions[0].name
    this.SetMotionState(defaultMotionName)
    this._target._animationsManager[defaultMotionName].action.play()
  }

  protected AddMotionState(name: Motions, type: MotionState) {
    this.AddState(name, type)
  }

  protected SetMotionState(name: Motions) {
    this.SetState(name)
  }

  protected UpdateMotionState(timeFromLastFrame: number, input: CharacterControllerInput) {
    this.Update(timeFromLastFrame, input)
  }
}