'use client';
import { TypographyH4 } from '@/components/ui/Typography';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import UserAvatar from './Avatar';

type SelectionType = 'document' | 'both' | 'canvas';

const Header = () => {
  const [selected, setSelected] = useState<SelectionType>('document');
  return (
    <div className='h-[5%] bg-secondary flex justify-between px-5 items-center'>
      <TypographyH4 text='Project Name' />
      <div>
        <Button
          className={`w-24 rounded-l-lg ${
            selected === 'document' ? ' bg-slate-50 text-slate-900' : ''
          }`}
          size={'default'}
          variant={'group'}
          onClick={() => setSelected('document')}
        >
          Document
        </Button>
        <Button
          className={`w-24 ${selected === 'both' ? ' bg-slate-50 text-slate-900' : ''}`}
          size={'default'}
          variant={'group'}
          onClick={() => setSelected('both')}
        >
          Both
        </Button>
        <Button
          className={`w-24 rounded-r-lg ${
            selected === 'canvas' ? ' bg-slate-50 text-slate-900' : ''
          }`}
          size={'default'}
          variant={'group'}
          onClick={() => setSelected('canvas')}
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
