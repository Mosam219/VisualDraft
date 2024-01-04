import React, { useCallback, useMemo } from 'react';
import { BoxSelect, Minus, Square } from 'lucide-react';
import { MODES } from '@/app/project/[projectId]/__components/ToolBar/constants';
import { ToolTipComponent } from '@/components/ui/tooltip';
import { globalState } from '@/stores/globalStore';
import { useAtom } from 'jotai';
import BottomBar from './BottomBar';

interface Props {
  undo: () => void;
  redo: () => void;
}

const ToolBar: React.FC<Props> = ({ undo, redo }) => {
  const [{ mode }, setStore] = useAtom(globalState);

  const changeMode = useCallback(
    (mode: string) => {
      setStore((prev) => ({
        ...prev,
        mode: mode as keyof typeof MODES,
      }));
    },
    [setStore],
  );
  const menus = [
    {
      component: <Minus />,
      toolTip: 'Line',
      handler: () => changeMode(MODES.line),
      isSelected: MODES.line === mode,
    },
    {
      component: <Square />,
      toolTip: 'Rectangle',
      handler: () => changeMode(MODES.rectangle),
      isSelected: MODES.rectangle === mode,
    },
    {
      component: <BoxSelect />,
      toolTip: 'selection',
      handler: () => changeMode(MODES.selection),
      isSelected: MODES.selection === mode,
    },
  ];
  return (
    <>
      <div
        className={
          'absolute top-10 left-3 border-1 flex flex-col justify-center items-center w-10 divide-y-2 divide-primary-foreground shadow-md'
        }
      >
        {menus.map((menu, index) => (
          <div
            key={index}
            className={`p-2 cursor-pointer ${menu.isSelected && 'bg-secondary'}`}
            onClick={menu.handler}
          >
            <ToolTipComponent text={menu.toolTip} position={'right'}>
              {menu.component}
            </ToolTipComponent>
          </div>
        ))}
      </div>
      <BottomBar undo={undo} redo={redo} />
    </>
  );
};
export default ToolBar;
