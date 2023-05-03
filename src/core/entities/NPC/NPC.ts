import { Entity } from '@core/entities';
import { FBXLoaderManagerClass } from '@core/loaders';

import {
  characterFileName,
  characterFolderPath,
  characterMotionsFolderPath,
  playerMotions,
} from '../../../Game.consts';
import { AIControllerInput } from '@core/controllers/AI';

export class NPCClass extends Entity {
  _name = 'thesvst';

  constructor(loaderManager: FBXLoaderManagerClass, input: AIControllerInput) {
    super(loaderManager, input);
    this._target._fbx.scale.set(0.1,0.1,0.1)
  }
}

export const NPC = async () => {
  const FBXModel = await FBXLoaderManagerClass.LoadModel(characterFolderPath, characterFileName);
  const FBXLoaderManager = new FBXLoaderManagerClass(FBXModel);
  await FBXLoaderManager.LoadAnimations(characterMotionsFolderPath, playerMotions);
  const Controller = new AIControllerInput()

  const NPCInstance = new NPCClass(FBXLoaderManager, Controller);

  return NPCInstance;
}