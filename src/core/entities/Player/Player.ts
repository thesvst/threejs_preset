import { Entity } from '@core/entities';
import { FBXMotions, FBXLoaderManagerClass } from '@core/loaders';
import { FBXModel } from '@core/loaders/FBXLoaderManager/FBXLoaderManager';

import {
  characterFileName,
  characterFolderPath,
  characterMotionsFolderPath,
  playerMotions,
} from '../../../Game.consts';
import { MotionManager } from '@core/motions';

export class PlayerClass<T> extends Entity<T> {
  _name = 'thesvst';

  constructor(model: FBXModel, motions: MotionManager<T>) {
    super(model, motions);
    this._fbx.scale.set(0.1,0.1,0.1)
  }
}

export const Player = async <T>() => {
  const FBXModelInstance = await FBXLoaderManagerClass.LoadModel(characterFolderPath, characterFileName);
  const FBXMotionsInstance =  new MotionManager<T>(characterMotionsFolderPath, playerMotions);
  const PlayerInstance = new PlayerClass(FBXModelInstance, FBXMotionsInstance)
  await PlayerInstance.LoadAnimations();

  return PlayerInstance;
}