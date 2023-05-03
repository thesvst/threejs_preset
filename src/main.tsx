import React from 'react';
import ReactDOM from 'react-dom/client';

import { AnimationActionNames } from '@core/states';

import { Game } from './Game';

(async () => {
  const GameInstance = new Game<AnimationActionNames>();
  await GameInstance.Init();
})()

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <div></div>
  </React.StrictMode>,
);
