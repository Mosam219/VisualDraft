'use client';

import { MutableRefObject, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import rough from 'roughjs';
import { RoughCanvas } from 'roughjs/bin/canvas';
import { Drawable } from 'roughjs/bin/core';
import { ROUGHNESS } from '../../constants';
import { useTheme } from 'next-themes';
import { useAtom, useAtomValue } from 'jotai';
import { globalState } from '@/stores/globalStore';
import { MODES } from '@/app/(canvas)/canvas/__components/ToolBar/constants';

interface Props {
  width: number;
  canvasRef: MutableRefObject<HTMLCanvasElement | null>;
}
interface ElementType {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  roughElement: Drawable;
}

const useCanvas = ({ canvasRef, width }: Props) => {
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [elements, setElements] = useState<Array<ElementType>>([]);
  const roughCanvas = useRef<RoughCanvas>();
  const store = useAtomValue(globalState);
  const { mode } = store;

  const generator = rough.generator();
  const { theme } = useTheme();

  const createNewElement = useCallback(
    (x1: number, y1: number, x2: number, y2: number) => {
      const getElementBasedOnMode = (mode: keyof typeof MODES) => {
        switch (mode) {
          case MODES.line:
            return generator.line(x1, y1, x2, y2, {
              roughness: ROUGHNESS,
              stroke: theme === 'dark' ? 'white' : 'black',
            });
            break;
          case MODES.rectangle:
            return generator.rectangle(x1, y1, x2 - x1, y2 - y1, {
              roughness: ROUGHNESS,
              stroke: theme === 'dark' ? 'white' : 'black',
            });
          default:
            return generator.line(x1, y1, x2, y2, {
              roughness: ROUGHNESS,
              stroke: theme === 'dark' ? 'white' : 'black',
            });
            break;
        }
      };
      const roughElement: Drawable = getElementBasedOnMode(mode);
      return { x1, y1, x2, y2, roughElement };
    },
    [generator, mode],
  );

  const handleMouseDown = useCallback(
    (event: MouseEvent) => {
      setIsDrawing(true);
      const canvas = canvasRef.current;
      if (!canvas) return;
      const { clientX, clientY } = event;
      const element = createNewElement(
        clientX - canvas.getBoundingClientRect().left,
        clientY - canvas.getBoundingClientRect().top,
        clientX - canvas.getBoundingClientRect().left,
        clientY - canvas.getBoundingClientRect().top,
      );
      setElements((prev) => [...prev, element]);
    },
    [canvasRef, createNewElement],
  );

  const handleMouseUp = useCallback(() => {
    setIsDrawing(false);
  }, []);

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!isDrawing) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const { clientX, clientY } = event;
      const latestElementIdx = elements.length - 1;
      const { x1, y1 } = elements[latestElementIdx];
      const updatedElement = createNewElement(
        x1,
        y1,
        clientX - canvas.getBoundingClientRect().left,
        clientY - canvas.getBoundingClientRect().top,
      );
      const elementsCopy = [...elements];
      elementsCopy[latestElementIdx] = updatedElement;
      setElements(elementsCopy);
    },
    [canvasRef, elements, isDrawing, createNewElement],
  );

  const addCanvasEventListeners = useCallback(() => {
    canvasRef?.current?.addEventListener('mousedown', handleMouseDown);
    canvasRef?.current?.addEventListener('mouseup', handleMouseUp);
    canvasRef?.current?.addEventListener('mousemove', handleMouseMove);
  }, [canvasRef, handleMouseDown, handleMouseUp, handleMouseMove]);

  const removeCanvasEventListeners = useCallback(() => {
    canvasRef?.current?.removeEventListener('mousedown', handleMouseDown);
    canvasRef?.current?.removeEventListener('mouseup', handleMouseUp);
    canvasRef?.current?.removeEventListener('mousemove', handleMouseMove);
  }, [canvasRef, handleMouseDown, handleMouseUp, handleMouseMove]);

  useEffect(() => {
    addCanvasEventListeners();
    return () => {
      removeCanvasEventListeners();
    };
  }, [addCanvasEventListeners, removeCanvasEventListeners]);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx || !canvasRef?.current) return;

    canvas.style.width = `${width ? `${width}px` : '100%'}`;
    canvas.style.height = '100%';

    const canvasHeight = canvasRef.current.clientHeight;
    const canvasWidth = canvasRef.current.clientWidth;
    const scale = window.devicePixelRatio;
    canvas.width = Math.floor(canvasWidth * scale);
    canvas.height = Math.floor(canvasHeight * scale);

    // ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Normalize coordinate system to use CSS pixels.
    ctx.scale(2, 2);
    roughCanvas.current = rough.canvas(canvas);
  }, [width, canvasRef]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    elements.map(({ roughElement }) => {
      roughCanvas?.current?.draw(roughElement);
    });
  }, [elements, roughCanvas, canvasRef, width]);
};
export default useCanvas;
