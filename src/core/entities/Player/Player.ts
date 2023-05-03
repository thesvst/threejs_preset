import { Entity } from '@core/entities';
import { FBXLoaderManagerClass } from '@core/loaders';

import {
  characterFileName,
  characterFolderPath,
  characterMotionsFolderPath,
  playerMotions,
} from '../../../Game.consts';

export class PlayerClass<T extends string, K> extends Entity<T, K> {
  _name = 'thesvst';

  constructor(loaderManager: FBXLoaderManagerClass<T, K>) {
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