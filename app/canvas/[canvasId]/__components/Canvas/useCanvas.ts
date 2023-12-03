'use client';

import { MutableRefObject, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import rough from 'roughjs';
import { RoughCanvas } from 'roughjs/bin/canvas';
import { Drawable } from 'roughjs/bin/core';
import { ROUGHNESS } from '../../constants';
import { useTheme } from 'next-themes';
import { useAtom } from 'jotai';
import { globalState } from '@/stores/globalStore';
import { MODES } from '@/app/canvas/[canvasId]/__components/ToolBar/constants';
import { ElementType } from '@/stores/types';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

interface Props {
  width: number;
  canvasRef: MutableRefObject<HTMLCanvasElement | null>;
  canvasId: string;
}

interface SelectedElmType extends ElementType {
  offsetX: number;
  offsetY: number;
}

const useCanvas = ({ canvasRef, width, canvasId }: Props) => {
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [selectedElm, setSelectedElm] = useState<SelectedElmType | null>(null);
  const roughCanvas = useRef<RoughCanvas>();

  const [store, setStore] = useAtom(globalState);
  const {
    mode,
    canvas: { elements },
  } = store;

  const generator = rough.generator();
  const { theme } = useTheme();

  const handleSetElements = useCallback(
    (elements: Array<ElementType>) => {
      setStore((prev) => ({
        ...prev,
        canvas: {
          ...prev.canvas,
          elements: elements,
        },
      }));
    },
    [setStore],
  );

  const createNewElement = useCallback(
    (
      id: number,
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      mode: keyof typeof MODES,
    ): ElementType | undefined => {
      if (MODES.selection === mode) {
        return;
      }
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
        }
      };
      const roughElement: Drawable = getElementBasedOnMode(mode);
      return { id, x1, y1, x2, y2, mode, roughElement };
    },
    [generator, theme],
  );

  const isWithinElement = (element: ElementType, x: number, y: number) => {
    const getDistance = (x1: number, y1: number, x2: number, y2: number) =>
      Math.sqrt(Math.pow(x1 - x2, 2) - Math.pow(y1 - y2, 2));
    const mode = element.mode;
    switch (mode) {
      case MODES.line:
        console.log(element.x1, element.y1);
        console.log(element.x2, element.y2);
        console.log(x, y);
        const offset =
          getDistance(element.x1, element.y1, element.x2, element.y2) -
          getDistance(element.x1, element.y1, x, y) -
          getDistance(x, y, element.x2, element.y2);
        return offset <= 1;
      case MODES.rectangle:
        return element.x1 <= x && element.x2 >= x && element.y1 <= y && element.y2 >= y;
    }
  };

  const getElementsAtPosition = useCallback(
    (x: number, y: number, elements: Array<ElementType>) => {
      return elements.find((element) => isWithinElement(element, x, y));
    },
    [],
  );

  const handleMouseDown = useCallback(
    (event: MouseEvent) => {
      setIsDrawing(true);
      const canvas = canvasRef.current;
      if (!canvas) return;
      const { clientX, clientY } = event;
      const x = clientX - canvas.getBoundingClientRect().left;
      const y = clientY - canvas.getBoundingClientRect().top;

      if (mode === MODES.selection) {
        const elm = getElementsAtPosition(x, y, elements);
        if (elm) setSelectedElm({ ...elm, offsetX: x - elm.x1, offsetY: y - elm.y1 });
      } else {
        const element = createNewElement(
          elements.length,
          clientX - canvas.getBoundingClientRect().left,
          clientY - canvas.getBoundingClientRect().top,
          clientX - canvas.getBoundingClientRect().left,
          clientY - canvas.getBoundingClientRect().top,
          mode,
        );
        if (element) handleSetElements([...elements, element]);
      }
    },
    [canvasRef, createNewElement, elements, getElementsAtPosition, mode, handleSetElements],
  );

  const handleMouseUp = useCallback(() => {
    setSelectedElm(null);
    setIsDrawing(false);
  }, []);

  const updateElements = useCallback(
    (id: number, updatedElement: ElementType) => {
      const elementsCopy = [...elements];
      elementsCopy[id] = updatedElement;
      handleSetElements(elementsCopy);
    },
    [elements, handleSetElements],
  );

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!isDrawing) return;
      const canvas = canvasRef.current;
      if (!canvas) return;

      const { clientX, clientY } = event;
      const x = clientX - canvas.getBoundingClientRect().left;
      const y = clientY - canvas.getBoundingClientRect().top;

      if (mode === MODES.selection) {
        if (!selectedElm) return;
        const { id, mode, x1, y1, offsetX, offsetY } = selectedElm;
        const height = Math.abs(selectedElm.x1 - selectedElm.x2);
        const width = Math.abs(selectedElm.y1 - selectedElm.y2);
        const newX = x - offsetX;
        const newY = y - offsetY;

        const updatedElm = createNewElement(id, newX, newY, newX + height, newY + width, mode);
        if (updatedElm) {
          updateElements(id, updatedElm);
        }
      } else {
        const latestElementIdx = elements.length - 1;

        if (latestElementIdx < 0) return;

        const { id, x1, y1 } = elements[latestElementIdx];
        const updatedElement = createNewElement(id, x1, y1, x, y, mode);

        if (!updatedElement) return;

        updateElements(id, updatedElement);
      }
    },
    [canvasRef, elements, isDrawing, createNewElement, mode, selectedElm, updateElements],
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

  const storedCanvas = useQuery(api.tasks.getCanvasById, { id: canvasId as Id<'canvas'> });
  console.log(storedCanvas);

  useEffect(() => {
    if (!storedCanvas) return;
    handleSetElements(
      storedCanvas?.elements?.map(
        (item) =>
          createNewElement(
            item.id,
            item.x1,
            item.y1,
            item.x2,
            item.y2,
            item.mode as keyof typeof MODES,
          )!!,
      ) || [],
    );
  }, [storedCanvas]);

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

    // Normalize coordinate system to use CSS pixels.
    ctx.scale(2, 2);
    roughCanvas.current = rough.canvas(canvas);
  }, [width, canvasRef]);

  useEffect(() => {
    const elm = elements.map(
      (item): ElementType =>
        createNewElement(item.id, item.x1, item.y1, item.x2, item.y2, item.mode)!!,
    );
    handleSetElements(elm);
  }, [theme]);

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
