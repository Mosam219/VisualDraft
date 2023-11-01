'use client';
import { useEffect, useLayoutEffect } from 'react';
import rough from 'roughjs';
import styles from './canvas.module.css';
interface Props {
  width: number;
}
const Canvas: React.FC<Props> = ({ width }) => {
  useEffect(() => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const context = canvas.getContext('2d');
    if (!context) return;
    canvas.style.width = `${width ? `${width}px` : '100%'}`;
    canvas.style.height = `100%`;
  }, [width]);

  useLayoutEffect(() => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const rc = rough.canvas(canvas);
    rc.circle(80, 120, 50, { fillWeight: 3 }); // centerX, centerY, diameter
  }, []);
  return (
    <canvas id='canvas' className={styles.canvas}>
      Canvas
    </canvas>
  );
};

Canvas.displayName = 'Drawer Canvas';
export default Canvas;
