import { useEffect, useRef } from 'react';
import { Renderer } from './core';

export const App = () => {
  const RendererRef = useRef<Renderer | null>();

  useEffect(() => {
    RendererRef.current = new Renderer('/src/assets/', 'character.fbx');

    return () => {
      const canvas = document.querySelector('#root canvas');
      if (canvas) canvas.remove();
      RendererRef.current = null;
    };
  }, []);

  return <div></div>;
};
