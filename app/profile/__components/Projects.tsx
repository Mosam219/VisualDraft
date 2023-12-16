import { Skeleton } from '@/components/ui/skeleton';
import CanvasTile from './CanvasTile';
import { useRouter } from 'next/navigation';
import { Id } from '@/convex/_generated/dataModel';
import { TypographyH1, TypographyH4 } from '@/components/ui/Typography';
import NewCanvasDialog from '@/app/project/[projectId]/__components/NewProjectModal';

interface Props {
  allCanvases:
    | {
        createdOn: string;
        id: Id<'canvas'>;
        name: string;
      }[]
    | undefined;
}

const Projects = ({ allCanvases }: Props) => {
  const { push } = useRouter();
  const redirectToCanvas = (id: string) => {
    push(`/project/${id}`);
  };
  return (
    <div className='w-[95%] min-h-[30%] mx-auto md:w-[85%] pt-2 max-h-[500px] bg-secondary dark:bg-secondary overflow-scroll'>
      <div className='w-full flex justify-end px-2'>
        <NewCanvasDialog />
      </div>
      {allCanvases?.length ? (
        allCanvases.map((canvas, index) => (
          <CanvasTile onClick={() => redirectToCanvas(canvas.id)} key={index} name={canvas.name} />
        ))
      ) : (
        <div className='w-[100%] h-[260px] flex justify-center items-center'>
          <div className='flex flex-col justify-center items-center'>
            <TypographyH4 text='Looks like you do not have any projects' />
            <NewCanvasDialog />
          </div>
        </div>
      )}
    </div>
  );
};

Projects.Skeleton = function ProjectSkeleton() {
  return (
    <Skeleton className='mx-auto md:w-[85%] pt-2 max-h-[500px] w-[95%] min-h-[30%] rounded-md' />
  );
};
export default Projects;
