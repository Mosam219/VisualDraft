'use client';
import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/nextjs';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { api } from '@/convex/_generated/api';
import { useMutation } from 'convex/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Id } from '@/convex/_generated/dataModel';

interface SFormState {
  name: string;
}
interface Props {
  teamId: string;
}

const NewProject: React.FC<Props> = ({ teamId }) => {
  const [formState, setFormState] = useState<SFormState>({} as SFormState);
  const createProject = useMutation(api.projects.createProject);
  const { user } = useUser();
  const { toast } = useToast();
  const { push } = useRouter();

  const handleChange = (key: string, value: string) => {
    setFormState((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  const createNewProject = async () => {
    const userId = user?.id;
    if (!userId) return;
    try {
      const id = await createProject({
        docContent: '',
        elements: [],
        name: formState.name,
        createdBy: user?.primaryEmailAddress?.emailAddress || '',
        teamId: teamId as Id<'teams'>,
      });
      push(`/project/${id}`);
      toast({ title: 'New Canvas Created' });
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create New Project</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>New Project</DialogTitle>
          <DialogDescription>Add Your project details</DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='name' className='text-right'>
              Name
            </Label>
            <Input
              id='name'
              value={formState.name || ''}
              className='col-span-3'
              onChange={(e) => handleChange('name', e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type='submit' onClick={() => createNewProject()}>
              Create
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default NewProject;
