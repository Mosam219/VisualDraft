'use client';

import { MutableRefObject, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import rough from 'roughjs';
import { RoughCanvas } from 'roughjs/bin/canvas';
import { Drawable } from 'roughjs/bin/core';
import { ROUGHNESS } from '../../constants';
import { useTheme } from 'next-themes';
import { useAtom } from 'jotai';
import { globalState } from '@/stores/globalStore';
import { MODES } from '@/app/project/[projectId]/__components/ToolBar/constants';
import { ElementType } from '@/stores/types';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useMutation, useQuery } from 'convex/react';
import { useSession } from 'next-auth/react';
import { CanvasElementsType } from '@/convex/tasks';
import { useRouter } from 'next/navigation';
import { debounce } from 'lodash';
import useHistory from '@/app/hooks/useHistory';
import useKeyShortCut from '@/app/hooks/useKeyShortCut';

interface Props {
  width: number;
  canvasRef: MutableRefObject<HTMLCanvasElement | null>;
  canvasId: string;
}

interface SelectedElmType extends ElementType {
  offsetX: number;
  offsetY: number;
  position: string | null; // if it is available then nearby or else inside
}

const useCanvas = ({ canvasRef, width, canvasId }: Props) => {
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [selectedElm, setSelectedElm] = useState<SelectedElmType | null>(null);
  const roughCanvas = useRef<RoughCanvas>();

  const { data: session } = useSession();

  const [store, setStore] = useAtom(globalState);
  const updateCanvas = useMutation(api.tasks.updateCanvas);

  const storedCanvas = useQuery(api.tasks.getDoc, { id: canvasId as Id<'canvas'> });

  const { mode } = store;

  const generator = rough.generator();
  const { theme } = useTheme();

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

  const { elements, setElements, undo, redo } = useHistory({
    defaultElements:
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
  });
  useKeyShortCut([
    {
      key: 'ctrl+shift+z',
      handler: () => redo(),
    },
    {
      key: 'ctrl+z',
      handler: () => undo(),
    },
  ]);

  const handleUpdateCanvas = async (elements: ElementType[]) => {
    if (!session) return;
    console.log('updating');
    const canvasElms = elements.map(
      (item): CanvasElementsType => ({
        mode: item.mode,
        x1: item.x1,
        x2: item.x2,
        y2: item.y2,
        y1: item.y1,
        id: item.id,
      }),
    );
    try {
      await updateCanvas({
        elements: canvasElms,
        docId: canvasId as Id<'canvas'>,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const delayedSave = debounce(async (elements: ElementType[]) => {
    await handleUpdateCanvas(elements);
  }, 1000);

  const isWithinElement = (element: ElementType, x: number, y: number) => {
    const getDistance = (x1: number, y1: number, x2: number, y2: number) =>
      Math.sqrt(Math.pow(Math.abs(x1 - x2), 2) - Math.pow(Math.abs(y1 - y2), 2));
    const mode = element.mode;
    switch (mode) {
      case MODES.line:
        const offset =
          getDistance(element.x1, element.y1, element.x2, element.y2) -
          getDistance(element.x1, element.y1, x, y) -
          getDistance(x, y, element.x2, element.y2);
        return offset && Math.abs(offset) <= 1;
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
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      setIsDrawing(true);
      const canvas = canvasRef.current;
      if (!canvas) return;
      const { clientX, clientY } = event;
      const x = clientX - canvas.getBoundingClientRect().left;
      const y = clientY - canvas.getBoundingClientRect().top;

      if (mode === MODES.selection) {
        const elm = getElementsAtPosition(x, y, elements);
        const nearByElm = findElementNearBy(x, y, elements);
        if (nearByElm)
          setSelectedElm({ ...nearByElm.elm, offsetX: 0, offsetY: 0, position: nearByElm.angle });
        else if (elm)
          setSelectedElm({ ...elm, offsetX: x - elm.x1, offsetY: y - elm.y1, position: null });
      } else {
        const element = createNewElement(
          elements.length,
          clientX - canvas.getBoundingClientRect().left,
          clientY - canvas.getBoundingClientRect().top,
          clientX - canvas.getBoundingClientRect().left,
          clientY - canvas.getBoundingClientRect().top,
          mode,
        );
        if (element) setElements([...elements, element], true);
      }
    },
    [canvasRef, createNewElement, elements, getElementsAtPosition, mode, setElements],
  );
  console.log(elements);

  const adjustElementCoordinates = (element: ElementType) => {
    const { mode, x1, y1, x2, y2 } = element;
    if (mode === 'rectangle') {
      const minX = Math.min(x1, x2);
      const maxX = Math.max(x1, x2);
      const minY = Math.min(y1, y2);
      const maxY = Math.max(y1, y2);
      return { x1: minX, y1: minY, x2: maxX, y2: maxY };
    } else {
      if (x1 < x2 || (x1 === x2 && y1 < y2)) {
        return { x1, y1, x2, y2 };
      } else {
        return { x1: x2, y1: y2, x2: x1, y2: y1 };
      }
    }
  };

  const handleMouseUp = () => {
    if (selectedElm) {
      const { id, position } = selectedElm;
      const { mode } = elements[id];
      if (position) {
        const { x1, y1, x2, y2 } = adjustElementCoordinates(elements[id]);
        const updatedElm = createNewElement(id, x1, y1, x2, y2, mode);
        if (updatedElm) updateElement(id, updatedElm);
      }
    }
    setSelectedElm(null);
    setIsDrawing(false);
  };

  const updateElement = useCallback(
    (id: number, updatedElement: ElementType) => {
      const elementsCopy = [...elements];
      elementsCopy[id] = updatedElement;
      setElements(elementsCopy);
    },
    [elements, setElements],
  );

  const getElementAtPosition = (x: number, y: number, elements: ElementType[]) => {
    return elements.find((element) => isWithinElement(element, x, y));
  };

  const cursorForPosition = (position: string) => {
    switch (position) {
      case 'tl':
      case 'br':
      case 'start':
      case 'end':
        return 'nwse-resize';
      case 'tr':
      case 'bl':
        return 'nesw-resize';
      default:
        return 'move';
    }
  };

  const isElementNearBy = (x: number, y: number, element: ElementType) => {
    const nearPoint = (x: number, y: number, x1: number, y1: number, name: string) =>
      Math.abs(x - x1) < 5 && Math.abs(y - y1) < 5 ? name : null;
    const { x1, x2, y1, y2 } = element;
    const topLeft = nearPoint(x, y, x1, y1, 'tl');
    const topRight = nearPoint(x, y, x2, y1, 'tr');
    const bottomLeft = nearPoint(x, y, x1, y2, 'bl');
    const bottomRight = nearPoint(x, y, x2, y2, 'br');
    return topLeft || topRight || bottomLeft || bottomRight || null;
  };

  const findElementNearBy = (x: number, y: number, elements: ElementType[]) => {
    const elem = elements.find((item) => isElementNearBy(x, y, item));
    return elem ? { elm: elem, angle: isElementNearBy(x, y, elem) } : null;
  };

  const resizedCoordinates = (
    x: number,
    y: number,
    position: string,
    coordinates: { x1: number; y1: number; x2: number; y2: number },
  ) => {
    const { x1, y1, x2, y2 } = coordinates;
    switch (position) {
      case 'tl':
      case 'start':
        return { x1: x, y1: y, x2, y2 };
      case 'tr':
        return { x1, y1: y, x2: x, y2 };
      case 'bl':
        return { x1: x, y1, x2, y2: y };
      case 'br':
      case 'end':
        return { x1, y1, x2: x, y2: y };
      default:
        return null; //should not really get here...
    }
  };

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const { clientX, clientY } = event;
      const x = clientX - canvas.getBoundingClientRect().left;
      const y = clientY - canvas.getBoundingClientRect().top;

      if (mode === MODES.selection) {
        const element = getElementAtPosition(x, y, elements);
        const nearByElement = findElementNearBy(x, y, elements);
        event.currentTarget.style.cursor = nearByElement?.angle
          ? cursorForPosition(nearByElement.angle)
          : element
          ? 'move'
          : 'default';
      }
      if (!isDrawing) return;

      if (mode === MODES.selection) {
        if (!selectedElm) return;
        const { id, mode, x1, y1, x2, y2, offsetX, offsetY, position } = selectedElm;
        if (position) {
          // nearby
          const coordinates = resizedCoordinates(x, y, position, { x1, y1, x2, y2 });
          if (!coordinates) return;
          const updatedElm = createNewElement(
            id,
            coordinates.x1,
            coordinates.y1,
            coordinates.x2,
            coordinates.y2,
            mode,
          );
          if (updatedElm) {
            updateElement(id, updatedElm);
          }
        } else {
          // inside
          const width = selectedElm.x2 - selectedElm.x1;
          const height = selectedElm.y2 - selectedElm.y1;
          const newX = x - offsetX;
          const newY = y - offsetY;

          const updatedElm = createNewElement(id, newX, newY, newX + width, newY + height, mode);
          if (updatedElm) {
            updateElement(id, updatedElm);
          }
        }
      } else {
        const latestElementIdx = elements.length - 1;

        if (latestElementIdx < 0) return;

        const { id, x1, y1 } = elements[latestElementIdx];
        const updatedElement = createNewElement(id, x1, y1, x, y, mode);

        if (!updatedElement) return;

        updateElement(id, updatedElement);
      }
    },
    [canvasRef, elements, isDrawing, createNewElement, mode, selectedElm, updateElement],
  );

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
    setElements(elm);
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
    delayedSave(elements);
    return () => delayedSave.cancel();
  }, [elements, roughCanvas, canvasRef, width, delayedSave]);

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    undo,
    redo,
  };
};

export default useCanvas;
