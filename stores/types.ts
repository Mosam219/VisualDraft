import { MODES } from '@/app/canvas/[id]/__components/ToolBar/constants';
import { Drawable } from 'roughjs/bin/core';

export interface GlobalStoreType {
  view: 'both' | 'canvas' | 'document';
  theme: 'light' | 'dark';
  mode: keyof typeof MODES;
  canvas: {
    elements: Array<ElementType>;
  };
}

export interface ElementType {
  id: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  mode: keyof typeof MODES;
  roughElement: Drawable;
}
