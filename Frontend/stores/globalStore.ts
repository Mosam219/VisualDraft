import { atom } from 'jotai';
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
