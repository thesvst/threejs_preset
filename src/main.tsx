import React from 'react';
import ReactDOM from 'react-dom/client';
import { Game } from './Game';

var global = window;

(async () => {
  const GameInstance = new Game();
  await GameInstance.Init();

  //@ts-ignore
  if (import.meta.env.DEV) global.game = GameInstance;
})()

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <div></div>
  </React.StrictMode>,
);
