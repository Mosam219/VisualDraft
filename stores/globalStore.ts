import { atom } from 'jotai';
import { MODES } from '@/app/(canvas)/canvas/__components/ToolBar/constants';

interface GlobalStoreType {
  view: 'both' | 'canvas' | 'document';
  theme: 'light' | 'dark';
  mode: keyof typeof MODES;
}

export const INITIAL_STATE: GlobalStoreType = {
  view: 'both',
  theme: 'light',
  mode: 'selection',
};

export const globalState = atom<GlobalStoreType>(INITIAL_STATE);
