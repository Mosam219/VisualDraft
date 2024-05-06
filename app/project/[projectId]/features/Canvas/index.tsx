'use client';
import { useEffect, useRef, useState } from 'react';
import styles from './canvas.module.css';
import useCanvas from './useCanvas';
import ToolBar from '@/app/project/[projectId]/__components/ToolBar';
import { MODES } from '../../__components/ToolBar/constants';

interface Props {
  width: number;
  canvasId: string;
}

const Canvas: React.FC<Props> = ({ width, canvasId }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const {
    mode,
    selectedElm,
    handleBlur,
    handleMouseMove,
    handleMouseUp,
    handleMouseDown,
    undo,
    redo,
  } = useCanvas({
    canvasRef: canvasRef,
    textAreaRef: textAreaRef,
    width: width,
    canvasId: canvasId,
  });

  useEffect(() => {
    if (mode !== MODES.text) return;
    setTimeout(() => {
      textAreaRef.current?.focus();
    }, 0);
  }, [mode, selectedElm]);

  return (
    <>
      <ToolBar undo={undo} redo={redo} />
      {mode === MODES.text && selectedElm ? (
        <textarea
          ref={textAreaRef}
          className={`absolute  m-0 p-0 border-0 outline-0 overflow-hidden whitespace-pre bg-transparent z-[2px]`}
          onBlur={handleBlur}
          style={{ left: selectedElm?.x1, top: selectedElm?.y1 - 2, font: '24px sans-serif' }}
        />
      ) : null}
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
