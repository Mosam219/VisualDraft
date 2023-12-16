import { atom } from 'jotai';
import { MODES } from '@/app/project/[projectId]/__components/ToolBar/constants';
import { Drawable } from 'roughjs/bin/core';
import { GlobalStoreType } from './types';

export const INITIAL_STATE: GlobalStoreType = {
  view: 'both',
  theme: 'light',
  mode: 'selection',
  canvas: {
    elements: [],
  },
};

export const globalState = atom<GlobalStoreType>(INITIAL_STATE);
