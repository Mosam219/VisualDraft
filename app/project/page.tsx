'use client';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { TypographyH2 } from '@/components/ui/Typography';
import NewTeam from '../profile/__components/NewTeam';

function CanvasPage({ params }: { params: { canvasId: string } }) {
  const { push } = useRouter();
  const redirectToProfile = () => {
    push(`/profile`);
  };
  return (
    <div className='h-full w-full flex justify-center items-center flex-col'>
      <TypographyH2 text='Hey There, Welcome to Visual Draft' />
      <div className='mt-4'>
        <NewTeam btnText='New Team' />
        <Button className='ml-3' onClick={() => redirectToProfile()}>
          Existing Projects
        </Button>
      </div>
    </div>
  );
}

export default CanvasPage;
