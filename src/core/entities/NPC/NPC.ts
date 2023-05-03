import { Entity } from '@core/entities';
import { FBXLoaderManagerClass } from '@core/loaders';
import { FBXModel } from '@core/loaders/FBXLoaderManager/FBXLoaderManager';
import { MotionManager } from '@core/motions';
import {
  characterFileName,
  characterFolderPath,
  characterMotionsFolderPath,
  playerMotions,
} from '../../../Game.consts';

export class NPCClass<T> extends Entity<T> {
  constructor(model: FBXModel, motions: MotionManager<T>) {
    super(model, motions);
    this._fbx.scale.set(0.1,0.1,0.1)
  }
}

export const NPC = async <T>() => {
  const FBXModelInstance = await FBXLoaderManagerClass.LoadModel(characterFolderPath, characterFileName);
  const FBXMotionsInstance =  new MotionManager<T>(characterMotionsFolderPath, playerMotions);
  const PlayerInstance = new NPCClass(FBXModelInstance, FBXMotionsInstance)
  await PlayerInstance.LoadAnimations();

  return PlayerInstance;
}