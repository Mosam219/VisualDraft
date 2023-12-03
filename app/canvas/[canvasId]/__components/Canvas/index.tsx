'use client';
import { useRef, useState } from 'react';
import styles from './canvas.module.css';
import useCanvas from './useCanvas';
import ToolBar from '@/app/canvas/[canvasId]/__components/ToolBar';

interface Props {
  width: number;
  canvasId: string;
}

const Canvas: React.FC<Props> = ({ width, canvasId }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useCanvas({ canvasRef: canvasRef, width: width, canvasId: canvasId });

  return (
    <>
      <ToolBar />
      <canvas ref={canvasRef} id='canvas' className={styles.canvas} />
    </>
  );
};

Canvas.displayName = 'Drawer Canvas';
export default Canvas;
