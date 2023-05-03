import { Entity } from '@core/entities';
import { FBXLoaderManagerClass } from '@core/loaders';

import {
  characterFileName,
  characterFolderPath,
  characterMotionsFolderPath,
  playerMotions,
} from '../../../Game.consts';
import { KeyboardControllerInput } from '@core/controllers/Keyboard';

export class PlayerClass extends Entity {
  _name = 'thesvst';

  constructor(loaderManager: FBXLoaderManagerClass, input: KeyboardControllerInput) {
    super(loaderManager, input);
    this._target._fbx.scale.set(0.1,0.1,0.1)
  }
}

export const Player = async () => {
  const FBXModel = await FBXLoaderManagerClass.LoadModel(characterFolderPath, characterFileName);
  const FBXLoaderManager = new FBXLoaderManagerClass(FBXModel);
  await FBXLoaderManager.LoadAnimations(characterMotionsFolderPath, playerMotions);
  const Controller = new KeyboardControllerInput();
  Controller.turnOnKeyboardControls()

  const PlayerInstance = new PlayerClass(FBXLoaderManager, Controller);

  return PlayerInstance;
}