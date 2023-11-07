import { atom } from 'jotai';

interface GlobalStoreType {
  view: 'both' | 'canvas' | 'document';
}

export const INITIAL_STATE: GlobalStoreType = {
  view: 'both',
};

export const globalState = atom<GlobalStoreType>(INITIAL_STATE);
