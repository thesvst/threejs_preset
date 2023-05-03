import { Motions, DanceState, IdleState, WalkState } from '@core/motions/MotionStates';

export const playerMotions = [
  { name: Motions.IDLE, fileName: 'idle.fbx', manager: IdleState },
  { name: Motions.DANCE, fileName: 'dance.fbx', manager: DanceState },
  { name: Motions.WALK, fileName: 'walk.fbx', manager: WalkState }
]
export const characterFolderPath = 'src/assets/characters/';
export const characterFileName = 'character.fbx';
export const characterMotionsFolderPath = 'src/assets/animations/'
