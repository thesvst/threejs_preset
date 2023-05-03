import { AnimationActionNames, DanceState, IdleState, WalkState } from '@core/states';

export const playerMotions = [
  { name: AnimationActionNames.IDLE, fileName: 'idle.fbx', manager: IdleState },
  { name: AnimationActionNames.DANCE, fileName: 'dance.fbx', manager: DanceState },
  { name: AnimationActionNames.WALK, fileName: 'walk.fbx', manager: WalkState }
]
export const characterFolderPath = 'src/assets/characters/';
export const characterFileName = 'character.fbx';
export const characterMotionsFolderPath = 'src/assets/animations/'

