import { PerspectiveCamera, Vector3 } from 'three';
import { CharacterControllerInput } from './CharacterControllerInput';
import { FBXModel, FiniteStateMachine } from '../../';

export class CharacterController {
  _input = new CharacterControllerInput();
  _stateMachine = new FiniteStateMachine();
  _decceleration = new Vector3(-0.0005, -0.0001, -5.0);
  _acceleration = new Vector3(1, 0.25, 50.0);
  _velocity = new Vector3(0, 0, 0);
  _position = new Vector3();
  _lookAt = new Vector3();
  _target: FBXModel;
  _camera: PerspectiveCamera;

  constructor(target: FBXModel, camera: PerspectiveCamera) {
    this._target = target;
    this._camera = camera;
  }

  Update(time: number) {
    // TODO
  }
}
