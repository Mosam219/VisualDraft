'use client';
import { useRef, useState } from 'react';
import styles from './canvas.module.css';
import useCanvas from './useCanvas';

interface Props {
  width: number;
}

const Canvas: React.FC<Props> = ({ width }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useCanvas({ canvasRef: canvasRef, width: width });

  return <canvas ref={canvasRef} id='canvas' className={styles.canvas} />;
};

Canvas.displayName = 'Drawer Canvas';
export default Canvas;
