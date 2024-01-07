import { useState } from 'react';
import { ElementType } from './../../stores/types';
const useHistory = () => {
  const [index, setIndex] = useState<number>(0);
  const [history, setHistory] = useState<Array<ElementType[]>>([[]]);
  const updateHistory = (elements: ElementType[], isNew: boolean = false) => {
    if (isNew) {
      setHistory((prev) => [...prev, elements]);
      setIndex(index + 1);
    } else {
      let copy = history;
      copy[index] = elements;
      setHistory(copy.slice(0, index + 1));
    }
  };

  const undo = () => {
    if (index === 0) return [];
    const pastElm = history[index - 1];
    setIndex(index - 1);
    return pastElm;
  };

  const redo = () => {
    if (index === history.length - 1) return history[index];
    const nextElm = history[index + 1];
    setIndex(index + 1);
    return nextElm;
  };
  return {
    history,
    updateHistory,
    undo,
    redo,
  };
};
export default useHistory;
