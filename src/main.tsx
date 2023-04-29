import React from 'react';
import ReactDOM from 'react-dom/client';
import { Renderer } from './core';

const RendererRef = new Renderer('/src/assets/', 'character.fbx');

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <div></div>
  </React.StrictMode>,
);
