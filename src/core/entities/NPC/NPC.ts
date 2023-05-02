import { Entity } from '@core/entities';
import { FBXMotions, FBXLoaderManagerClass } from '@core/loaders';
import { FBXModel } from '@core/loaders/FBXLoaderManager/FBXLoaderManager';
import { AnimationActionNames } from '@core/states';

const playerMotions = [
  { name: AnimationActionNames.IDLE, fileName: 'idle.fbx' },
  { name: AnimationActionNames.DANCE, fileName: 'dance.fbx' },
  { name: AnimationActionNames.WALK, fileName: 'walk.fbx' }
]
const characterFolderPath = 'src/assets/characters/';
const characterFileName = 'character.fbx';
const characterMotionsFolderPath = 'src/assets/animations/'

export class NPCClass<T> extends Entity<T> {
  constructor(model: FBXModel, motions: FBXMotions<T>) {
    super(model, motions);
    this._fbx.scale.set(0.1,0.1,0.1)
  }
}

export const NPC = async () => {
  const FBXModelInstance = await FBXLoaderManagerClass.LoadModel(characterFolderPath, characterFileName);
  const FBXMotionsInstance =  new FBXMotions<AnimationActionNames>(characterMotionsFolderPath, playerMotions);
  const PlayerInstance = new NPCClass(FBXModelInstance, FBXMotionsInstance)
  await PlayerInstance.LoadAnimations();

  return PlayerInstance;
}