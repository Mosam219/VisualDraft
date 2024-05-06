'use client';

import { MutableRefObject, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import rough from 'roughjs';
import { RoughCanvas } from 'roughjs/bin/canvas';
import { ROUGHNESS } from '../../constants';
import { useTheme } from 'next-themes';
import { useAtom } from 'jotai';
import { globalState } from '@/stores/globalStore';
import { MODES } from '@/app/project/[projectId]/__components/ToolBar/constants';
import { ElementType } from '@/stores/types';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useMutation, useQuery } from 'convex/react';
import { CanvasElementsType } from '@/convex/projects';
import { debounce } from 'lodash';
import useHistory from '@/app/hooks/useHistory';
import useKeyShortCut from '@/app/hooks/useKeyShortCut';
import { CanvasUtils } from './utils';

interface Props {
  width: number;
  canvasRef: MutableRefObject<HTMLCanvasElement | null>;
  textAreaRef: MutableRefObject<HTMLTextAreaElement | null>;
  canvasId: string;
}

interface SelectedElmType extends ElementType {
  offsetX: number;
  offsetY: number;
  position: string | null; // if it is available then nearby or else inside
}

const generator = rough.generator();

const useCanvas = ({ canvasRef, width, canvasId, textAreaRef }: Props) => {
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [selectedElm, setSelectedElm] = useState<SelectedElmType | null>(null);
  const [firstLoad, setFirstLoad] = useState<boolean>(true);
  const roughCanvas = useRef<RoughCanvas>();
  const { updateHistory, undo, redo } = useHistory();

  useKeyShortCut([
    {
      handler: () => handleRedo(),
      key: 'ctrl+shift+z',
    },
    {
      handler: () => handleUndo(),
      key: 'ctrl+z',
    },
  ]);

  const { data: session } = { data: {} };

  const [store, setStore] = useAtom(globalState);
  const updateCanvas = useMutation(api.projects.updateCanvas);

  const storedCanvas = useQuery(api.projects.getDoc, { id: canvasId as Id<'project'> });

  const {
    mode,
    canvas: { elements },
  } = store;

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

  const handleUpdateCanvas = async (elements: ElementType[]) => {
    if (!session) return;
    const canvasElms = elements.map(
      (item): CanvasElementsType => ({
        mode: item.mode,
        x1: item.x1,
        x2: item.x2,
        y2: item.y2,
        y1: item.y1,
        id: item.id,
        text: item.text,
      }),
    );
    try {
      await updateCanvas({
        elements: canvasElms,
        docId: canvasId as Id<'project'>,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const delayedSave = debounce(async (elements: ElementType[]) => {
    await handleUpdateCanvas(elements);
  }, 2000);

  const createNewElement = useCallback(
    (
      id: number,
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      mode: keyof typeof MODES,
      text?: string,
    ): ElementType | undefined => {
      if (MODES.selection === mode) {
        return;
      }
      switch (mode) {
        case MODES.line: {
          const roughElement = generator.line(x1, y1, x2, y2, {
            roughness: ROUGHNESS,
            stroke: theme === 'dark' ? 'white' : 'black',
          });
          return { id, x1, y1, x2, y2, mode, roughElement };
        }
        case MODES.rectangle: {
          const roughElement = generator.rectangle(x1, y1, x2 - x1, y2 - y1, {
            roughness: ROUGHNESS,
            stroke: theme === 'dark' ? 'white' : 'black',
          });
          return { id, x1, y1, x2, y2, mode, roughElement };
        }
        case MODES.text: {
          const width = canvasRef?.current?.getContext('2d')?.measureText(text || '').width;
          const height = 24;
          return { id, x1, y1, x2: x1 + (width || 0), y2: y1 + height, mode, text: text || '' };
        }
        default:
          throw `Wrong mode ${mode}`;
      }
    },
    [theme],
  );

  const handleMouseDown = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      console.log(selectedElm);
      if (selectedElm && mode === MODES.text) {
        return;
      }

      setIsDrawing(true);
      const canvas = canvasRef.current;
      if (!canvas) return;
      const { clientX, clientY } = event;
      const x = clientX - canvas.getBoundingClientRect().left;
      const y = clientY - canvas.getBoundingClientRect().top;

      if (mode === MODES.selection) {
        const elm = CanvasUtils.getElementsAtPosition(x, y, elements);
        const nearByElm = CanvasUtils.findElementNearBy(x, y, elements);
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
        if (element) {
          handleSetElements([...elements, element]);
          updateHistory([...elements, element], true);
          setSelectedElm({
            ...element,
            offsetX: 0,
            offsetY: 0,
            position: null,
          });
        }
      }
    },
    [canvasRef, createNewElement, elements, mode, handleSetElements],
  );

  const handleMouseUp = () => {
    if (selectedElm) {
      const { id, position } = selectedElm;
      const { mode } = elements[id];
      if (position) {
        const { x1, y1, x2, y2 } = CanvasUtils.adjustElementCoordinates(elements[id]);
        const updatedElm = createNewElement(id, x1, y1, x2, y2, mode);
        if (updatedElm) updateElement(id, updatedElm);
      }
    }
    if (mode !== MODES.text) {
      setSelectedElm(null);
      setIsDrawing(false);
    }
  };

  const updateElement = useCallback(
    (id: number, updatedElement: ElementType) => {
      const elementsCopy = [...elements];
      elementsCopy[id] = updatedElement;
      handleSetElements(elementsCopy);
      updateHistory(elementsCopy);
    },
    [elements, handleSetElements],
  );

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const { clientX, clientY } = event;
      const x = clientX - canvas.getBoundingClientRect().left;
      const y = clientY - canvas.getBoundingClientRect().top;

      if (mode === MODES.selection) {
        const element = CanvasUtils.getElementAtPosition(x, y, elements);
        const nearByElement = CanvasUtils.findElementNearBy(x, y, elements);
        if (nearByElement?.elm.mode !== MODES.text)
          event.currentTarget.style.cursor = nearByElement?.angle
            ? CanvasUtils.cursorForPosition(nearByElement.angle)
            : element
            ? 'move'
            : 'default';
      }
      if (!isDrawing) return;

      if (mode === MODES.selection) {
        if (!selectedElm) return;
        const { id, mode, x1, y1, x2, y2, offsetX, offsetY, position, text } = selectedElm;
        if (position && mode !== MODES.text) {
          // nearby
          const coordinates = CanvasUtils.resizedCoordinates(x, y, position, { x1, y1, x2, y2 });
          if (!coordinates) return;
          const updatedElm = createNewElement(
            id,
            coordinates.x1,
            coordinates.y1,
            coordinates.x2,
            coordinates.y2,
            mode,
            text,
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

          const updatedElm = createNewElement(
            id,
            newX,
            newY,
            newX + width,
            newY + height,
            mode,
            text,
          );
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

  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    if (!selectedElm) {
      return;
    }
    const { id, mode, x1, y1 } = selectedElm;
    const updatedElm = createNewElement(id, x1, y1, x1, y1, mode, e.target?.value || '');
    setIsDrawing(false);
    setSelectedElm(null);
    if (!updatedElm) return;
    updateElement(id, updatedElm);
  };

  const drawElement = useCallback(
    (element: ElementType) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas?.getContext('2d');
      if (!ctx) return;
      switch (element.mode) {
        case MODES.line:
        case MODES.rectangle:
          if (!element.roughElement) return;
          roughCanvas?.current?.draw(element.roughElement);
          break;
        case MODES.text: {
          ctx.textBaseline = 'top';
          ctx.font = '24px sans-serif';
          ctx.fillStyle = theme === 'dark' ? 'white' : 'black';
          ctx.fillText(element.text || '', element.x1, element.y1);
          break;
        }
        default:
          throw new Error(`mode not recognised: ${element.mode}`);
      }
    },
    [canvasRef, theme],
  );

  const handleUndo = () => {
    const elements = undo();
    handleSetElements(elements);
  };
  const handleRedo = () => {
    const elements = redo();
    handleSetElements(elements);
  };

  useEffect(() => {
    if (!storedCanvas || !firstLoad) return;
    setFirstLoad(false);
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
            item.text,
          )!!,
      ) || [],
    );
    updateHistory(
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
      true,
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
        createNewElement(item.id, item.x1, item.y1, item.x2, item.y2, item.mode, item.text)!!,
    );
    handleSetElements(elm);
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    elements.map((element) => {
      drawElement(element);
    });

    delayedSave(elements);
    return delayedSave.cancel;
  }, [elements, roughCanvas, canvasRef, width, delayedSave, drawElement]);

  return {
    mode,
    selectedElm,
    handleBlur,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    undo: handleUndo,
    redo: handleRedo,
  };
};

export default useCanvas;
