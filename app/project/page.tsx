'use client';
import { Button } from '@/components/ui/button';
import NewCanvasDialog from './[projectId]/__components/NewProjectModal';
import { useRouter } from 'next/navigation';
import { TypographyH1, TypographyH2 } from '@/components/ui/Typography';

function CanvasPage({ params }: { params: { canvasId: string } }) {
  const { push } = useRouter();
  const redirectToProfile = () => {
    push(`/profile`);
  };
  return (
    <div className='h-full w-full flex justify-center items-center flex-col'>
      <TypographyH2 text='Hey There, Welcome to Idea Drawer' />
      <div className='mt-4'>
        <NewCanvasDialog />
        <Button className='ml-3' onClick={() => redirectToProfile()}>
          Existing Projects
        </Button>
      </div>
    </div>
  );
}

export default CanvasPage;
