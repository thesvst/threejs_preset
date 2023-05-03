import { Entity } from '@core/entities';
import { FBXLoaderManagerClass } from '@core/loaders';

import {
  characterFileName,
  characterFolderPath,
  characterMotionsFolderPath,
  playerMotions,
} from '../../../Game.consts';

export class NPCClass extends Entity {
  _name = 'thesvst';

  constructor(loaderManager: FBXLoaderManagerClass) {
    super(loaderManager);
    this._target._fbx.scale.set(0.1,0.1,0.1)
  }
}

export const NPC = async <T, K>() => {
  const FBXModel = await FBXLoaderManagerClass.LoadModel(characterFolderPath, characterFileName);
  const FBXLoaderManager = new FBXLoaderManagerClass(FBXModel);
  await FBXLoaderManager.LoadAnimations(characterMotionsFolderPath, playerMotions);

  const NPCInstance = new NPCClass(FBXLoaderManager);

  return NPCInstance;
}