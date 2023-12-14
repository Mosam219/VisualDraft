import React, { useCallback, useMemo } from 'react';
import { BoxSelect, Download, Minus, Square } from 'lucide-react';
import { MODES } from '@/app/canvas/[canvasId]/__components/ToolBar/constants';
import { ToolTipComponent } from '@/components/ui/tooltip';
import { globalState } from '@/stores/globalStore';
import { useAtom } from 'jotai';
import { CanvasElementsType } from '@/convex/tasks';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const ToolBar: React.FC = () => {
  const [
    {
      canvas: { elements },
    },
    setStore,
  ] = useAtom(globalState);

  const router = useRouter();

  const { data: session } = useSession();

  const createCanvas = useMutation(api.tasks.createCanvas);

  const changeMode = useCallback(
    (mode: string) => {
      setStore((prev) => ({
        ...prev,
        mode: mode as keyof typeof MODES,
      }));
    },
    [setStore],
  );
  const handleSaveCanvas = async () => {
    // router.push(`/canvas/${id}`);
  };
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
      {
        component: <BoxSelect />,
        toolTip: 'selection',
        handler: () => changeMode(MODES.selection),
      },
      {
        component: <Download />,
        toolTip: 'save',
        handler: () => handleSaveCanvas(),
      },
    ],
    [changeMode, elements],
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
