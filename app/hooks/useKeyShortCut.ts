import React from 'react';

type eventKey = 'ctrlKey' | 'shiftKey' | 'altKey' | 'metaKey';
const map: { [key: string]: eventKey } = {
  ctrl: 'ctrlKey',
  alt: 'altKey',
  shift: 'shiftKey',
  command: 'metaKey',
};

interface keyMapType {
  key: string;
  handler: () => void;
  condition?: boolean;
}
const useKeyShortCut = (keyMap: keyMapType[]) => {
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key) {
        // Prevent Default Behaviour for some keys
        if (e.key === 'F1') e.preventDefault();

        keyMap.map((keyMapItem) => {
          const { key: keys, handler, condition = true } = keyMapItem;
          if (
            keys
              .split('+')
              .every(
                (key) =>
                  e[map[key]] ||
                  e.key.toLowerCase() === key.toLowerCase() ||
                  e.code.toLowerCase() === key.toLowerCase(),
              ) &&
            condition
          ) {
            handler();
          }
        });
        for (const index in keyMap) {
          const keyMapItem = keyMap[index];
          const { key: keys, handler, condition = true } = keyMapItem;
          if (
            keys
              .split('+')
              .every(
                (key) =>
                  e[map[key]] ||
                  e.key.toLowerCase() === key.toLowerCase() ||
                  e.code.toLowerCase() === key.toLowerCase(),
              ) &&
            condition
          ) {
            handler();
            break;
          }
        }
      }
    };
    window.addEventListener('keydown', handler);

    return () => {
      window.removeEventListener('keydown', handler);
    };
  }, [keyMap]);
};

export default useKeyShortCut;
