'use client';
import { useEffect, useRef } from 'react';
import rough from 'roughjs';
import styles from './canvas.module.css';

interface Props {
  width: number;
}

const Canvas: React.FC<Props> = ({ width }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx || !canvasRef?.current) return;

    canvas.style.width = `${width ? `${width}px` : '100%'}`;
    canvas.style.height = '100%';

    const canvasHeight = canvasRef.current.clientHeight;
    const canvasWidth = canvasRef.current.clientWidth;
    const scale = window.devicePixelRatio;
    canvas.width = Math.floor(canvasWidth * scale);
    canvas.height = Math.floor(canvasHeight * scale);

    // Normalize coordinate system to use CSS pixels.
    ctx.scale(2, 2);
    const rc = rough.canvas(canvas);
  }, [width]);

  return <canvas ref={canvasRef} id='canvas' className={styles.canvas} />;
};

Canvas.displayName = 'Drawer Canvas';
export default Canvas;
