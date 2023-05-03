import React from 'react';
import ReactDOM from 'react-dom/client';

import { AnimationActionNames, MotionState } from '@core/motions/MotionStates';
import { Game } from './Game';

(async () => {
  const GameInstance = new Game<AnimationActionNames, MotionState>();
  await GameInstance.Init();
})()

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <div></div>
  </React.StrictMode>,
);
