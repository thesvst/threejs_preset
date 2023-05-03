import { Entity } from '@core/entities';
import { FBXLoaderManagerClass } from '@core/loaders';

import {
  characterFileName,
  characterFolderPath,
  characterMotionsFolderPath,
  playerMotions,
} from '../../../Game.consts';

export class PlayerClass extends Entity {
  _name = 'thesvst';

  constructor(loaderManager: FBXLoaderManagerClass) {
    super(loaderManager);
    this._target._fbx.scale.set(0.1,0.1,0.1)
  }
}

export const Player = async <T, K>() => {
  const FBXModel = await FBXLoaderManagerClass.LoadModel(characterFolderPath, characterFileName);
  const FBXLoaderManager = new FBXLoaderManagerClass(FBXModel);
  await FBXLoaderManager.LoadAnimations(characterMotionsFolderPath, playerMotions);

  const PlayerInstance = new PlayerClass(FBXLoaderManager);

  return PlayerInstance;
}