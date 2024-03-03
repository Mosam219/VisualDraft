'use client';
import { TypographyH4 } from '@/components/ui/Typography';
import { Button } from '@/components/ui/button';
import { useAtom } from 'jotai';
import { globalState } from '@/stores/globalStore';
import ModeToggle from '@/app/project/[projectId]/__components/ThemeToggle';
import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';
import { useParams } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

type SelectionType = 'document' | 'both' | 'canvas';

const Header: React.FC = () => {
  const { projectId } = useParams();
  const [store, setStore] = useAtom(globalState);
  const canvas = useQuery(api.tasks.getDoc, { id: projectId as Id<'canvas'> });
  const { view } = store;

  const handleChangeView = (newView: SelectionType) => {
    setStore((prev) => ({
      ...prev,
      view: newView,
    }));
  };

  return (
    <div className='h-[5%] bg-background border-b-2 flex justify-between px-5 items-center'>
      <TypographyH4 text={canvas?.name || 'New Project'} />
      {projectId ? (
        <div>
          <Button
            className={`w-24 rounded-l-lg ${
              view === 'document'
                ? 'bg-muted text-foreground'
                : 'bg-card text-foreground hover:bg-accent'
            }`}
            size={'default'}
            variant={'group'}
            onClick={() => handleChangeView('document')}
          >
            Document
          </Button>
          <Button
            className={`w-24 ${
              view === 'both'
                ? 'bg-muted text-foreground'
                : 'bg-card text-foreground hover:bg-accent'
            }`}
            size={'default'}
            variant={'group'}
            onClick={() => handleChangeView('both')}
          >
            Both
          </Button>
          <Button
            className={`w-24 rounded-r-lg ${
              view === 'canvas'
                ? 'bg-muted text-foreground'
                : 'bg-card text-foreground hover:bg-accent'
            }`}
            size={'default'}
            variant={'group'}
            onClick={() => handleChangeView('canvas')}
          >
            Canvas
          </Button>
        </div>
      ) : null}
      <div className={'flex gap-2 items-center'}>
        <ModeToggle />
        <Link href={'/profile'}>
          <UserButton afterSignOutUrl='/home' />
        </Link>
      </div>
    </div>
  );
};
export default Header;
