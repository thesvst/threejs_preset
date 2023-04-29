import React from 'react';
import ReactDOM from 'react-dom/client';

import { Game } from './Game';

new Game();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <div></div>
  </React.StrictMode>,
);
