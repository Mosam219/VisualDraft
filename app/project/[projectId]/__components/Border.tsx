'use client';
import { useRef, useState } from 'react';

interface Props {
  changeCanvasSectionWidth: (newWidth: number) => void;
}

const Border: React.FC<Props> = ({ changeCanvasSectionWidth }) => {
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const borderRef = useRef<HTMLDivElement>(null);

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    if (!isResizing || !e.clientX) return;
    const leftWidth = window.innerWidth - e.clientX - 10;
    changeCanvasSectionWidth(leftWidth);
  };

  const handleDragStart = () => {
    setIsResizing(true);
  };

  const handleDragEnd = () => {
    setIsResizing(false);
  };

  return (
    <div
      ref={borderRef}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDrag={handleDrag}
      className={`w-[10px] cursor-ew-resize select-none focus:bg-red`}
      draggable
    />
  );
};

Border.displayName = 'Canvas Section';

export default Border;
