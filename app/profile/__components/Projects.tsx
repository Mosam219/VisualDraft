import { Skeleton } from '@/components/ui/skeleton';
import CanvasTile from './CanvasTile';
import { useRouter } from 'next/navigation';
import { Id } from '@/convex/_generated/dataModel';

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
      {allCanvases ? (
        allCanvases.map((canvas, index) => (
          <CanvasTile onClick={() => redirectToCanvas(canvas.id)} key={index} name={canvas.name} />
        ))
      ) : (
        <div className='flex justify-center items-center'>No Project Available</div>
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
