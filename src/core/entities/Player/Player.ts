import { Entity } from '@core/entities';
import { FBXMotions, FBXLoaderManagerClass } from '@core/loaders';
import { FBXModel } from '@core/loaders/FBXLoaderManager/FBXLoaderManager';
import { AnimationActionNames } from '@core/states';

const playerMotions = [
  { name: AnimationActionNames.DANCE, fileName: 'dance.fbx' },
  { name: AnimationActionNames.IDLE, fileName: 'idle.fbx' },
  { name: AnimationActionNames.WALK, fileName: 'walk.fbx' }
]
const characterFolderPath = 'src/assets/characters/';
const characterFileName = 'character.fbx';
const characterMotionsFolderPath = 'src/assets/animations/'

export class PlayerClass<T> extends Entity<T> {
  _name = 'thesvst';

  constructor(model: FBXModel, motions: FBXMotions<T>) {
    super(model, motions);
    this._fbx.scale.set(0.1,0.1,0.1)
  }
}

export const Player = async () => {
  const FBXModelInstance = await FBXLoaderManagerClass.LoadModel(characterFolderPath, characterFileName);
  const FBXMotionsInstance =  new FBXMotions<AnimationActionNames>(characterMotionsFolderPath, playerMotions);
  const PlayerInstance = new PlayerClass(FBXModelInstance, FBXMotionsInstance)
  await PlayerInstance.LoadAnimations();

  return PlayerInstance;
}