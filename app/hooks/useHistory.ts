import { globalState } from '@/stores/globalStore';
import { ElementType } from '@/stores/types';
import { useAtom } from 'jotai';
import { useState } from 'react';

const useHistory = ({ defaultElements }: { defaultElements: ElementType[] }) => {
  const [index, setIndex] = useState<number>(0);
  const [history, setHistory] = useState<Array<ElementType[]>>([defaultElements]);
  const [store, setStore] = useAtom(globalState);
  const setElements = (newState: ElementType[], isNew: boolean = false) => {
    if (isNew) {
      if (index === history.length - 1) setHistory((prev) => [...prev, newState]);
      else {
        const copyHistory = history;
        copyHistory[index + 1] = newState;
        setHistory(copyHistory.slice(0, index + 2));
      }
      setIndex(index + 1);
    } else {
      const copyHistory = history;
      copyHistory[index] = newState;
      setHistory(copyHistory);
    }
    setStore((prev) => ({
      ...prev,
      canvas: {
        ...prev.canvas,
        elements: newState,
      },
    }));
  };

  const undo = () => {
    if (index === 0) return;
    setStore((prev) => ({
      ...prev,
      canvas: {
        ...prev.canvas,
        elements: history[index - 1],
      },
    }));
    setIndex(index - 1);
  };
  const redo = () => {
    if (index === history.length - 1) return;
    setStore((prev) => ({
      ...prev,
      canvas: {
        ...prev.canvas,
        elements: history[index + 1],
      },
    }));
    setIndex(index + 1);
  };

  return { elements: history[index], setElements, undo, redo };
};
export default useHistory;
