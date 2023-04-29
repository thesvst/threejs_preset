import { AnimationMixer, Group, LoadingManager } from "three";

export type Model = { fbx: Group; mixer: AnimationMixer; manager: LoadingManager };