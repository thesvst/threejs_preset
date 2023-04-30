import { DanceState, IdleState, WalkState } from './states';

export enum AnimationActionNames {
  IDLE = 'IDLE',
  WALK = 'WALK',
  DANCE = 'DANCE',
}

export type AnimationType = typeof IdleState | typeof WalkState | typeof DanceState;

export const AnimationStates = {
  [AnimationActionNames.IDLE]: IdleState,
  [AnimationActionNames.WALK]: WalkState,
  [AnimationActionNames.DANCE]: DanceState,
};
