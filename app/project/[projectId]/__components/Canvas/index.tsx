'use client';
import { useRef } from 'react';
import styles from './canvas.module.css';
import useCanvas from './useCanvas';
import ToolBar from '@/app/project/[projectId]/__components/ToolBar';

interface Props {
  width: number;
  canvasId: string;
}

const Canvas: React.FC<Props> = ({ width, canvasId }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { handleMouseMove, handleMouseUp, handleMouseDown } = useCanvas({
    canvasRef: canvasRef,
    width: width,
    canvasId: canvasId,
  });

  return (
    <>
      <ToolBar />
      <canvas
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        ref={canvasRef}
        id='canvas'
        className={styles.canvas}
      />
    </>
  );
};

Canvas.displayName = 'Drawer Canvas';
export default Canvas;
