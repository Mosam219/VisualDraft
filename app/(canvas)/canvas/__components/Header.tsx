'use client';
import { TypographyH4 } from '@/components/ui/Typography';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import UserAvatar from './Avatar';
import { useAtom } from 'jotai';
import { globalState } from '@/stores/globalStore';

type SelectionType = 'document' | 'both' | 'canvas';

const Header = () => {
  const [store, setStore] = useAtom(globalState);

  const { view } = store;

  const handleChangeView = (newView: SelectionType) => {
    setStore((prev) => ({
      ...prev,
      view: newView,
    }));
  };

  return (
    <div className='h-[5%] bg-secondary flex justify-between px-5 items-center'>
      <TypographyH4 text='Project Name' />
      <div>
        <Button
          className={`w-24 rounded-l-lg ${
            view === 'document' ? ' bg-slate-50 text-slate-900' : ''
          }`}
          size={'default'}
          variant={'group'}
          onClick={() => handleChangeView('document')}
        >
          Document
        </Button>
        <Button
          className={`w-24 ${view === 'both' ? ' bg-slate-50 text-slate-900' : ''}`}
          size={'default'}
          variant={'group'}
          onClick={() => handleChangeView('both')}
        >
          Both
        </Button>
        <Button
          className={`w-24 rounded-r-lg ${view === 'canvas' ? ' bg-slate-50 text-slate-900' : ''}`}
          size={'default'}
          variant={'group'}
          onClick={() => handleChangeView('canvas')}
        >
          Canvas
        </Button>
      </div>
      <div>
        <UserAvatar />
      </div>
    </div>
  );
};
export default Header;
