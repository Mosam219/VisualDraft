import React, { useCallback, useMemo } from 'react';
import { Minus, Square } from 'lucide-react';
import { MODES } from '@/app/(canvas)/canvas/__components/ToolBar/constants';
import { ToolTipComponent } from '@/components/ui/tooltip';
import { useAtom } from 'jotai';
import { globalState } from '@/stores/globalStore';

const ToolBar: React.FC = () => {
  const [store, setStore] = useAtom(globalState);
  const changeMode = useCallback(
    (mode: string) => {
      setStore((prev) => ({
        ...prev,
        mode: mode as keyof typeof MODES,
      }));
    },
    [setStore],
  );
  const menus = useMemo(
    () => [
      {
        component: <Minus />,
        toolTip: 'Line',
        handler: () => changeMode(MODES.line),
      },
      {
        component: <Square />,
        toolTip: 'Rectangle',
        handler: () => changeMode(MODES.rectangle),
      },
    ],
    [changeMode],
  );
  return (
    <div
      className={
        'absolute top-10 left-3 border-1 flex flex-col justify-center items-center w-10 divide-y-2 divide-primary-foreground shadow-md'
      }
    >
      {menus.map((menu, index) => (
        <div key={index} className={'p-2 cursor-pointer'} onClick={menu.handler}>
          <ToolTipComponent text={menu.toolTip} position={'right'}>
            {menu.component}
          </ToolTipComponent>
        </div>
      ))}
    </div>
  );
};
export default ToolBar;
