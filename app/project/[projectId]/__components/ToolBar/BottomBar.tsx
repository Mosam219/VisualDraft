import { ToolTipComponent } from '@/components/ui/tooltip';
import { Redo2, Undo2 } from 'lucide-react';

interface Props {
  undo: () => void;
  redo: () => void;
}

const BottomBar: React.FC<Props> = ({ undo, redo }) => {
  const menus = [
    {
      component: <Undo2 />,
      toolTip: 'Undo [ctrl+z]',
      onClick: undo,
    },
    {
      component: <Redo2 />,
      toolTip: 'Redo [ctrl+shift+z]',
      onClick: redo,
    },
  ];
  return (
    <div
      className={
        'absolute bottom-1 left-3 border-1 flex justify-center items-center h-10 divide-y-2 divide-primary-foreground shadow-md'
      }
    >
      {menus.map((menu, index) => (
        <div key={index} className={'p-2 cursor-pointer'} onClick={menu.onClick}>
          <ToolTipComponent text={menu.toolTip} position={'top'}>
            {menu.component}
          </ToolTipComponent>
        </div>
      ))}
    </div>
  );
};

export default BottomBar;
