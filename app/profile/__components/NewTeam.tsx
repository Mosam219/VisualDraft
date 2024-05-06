import { Button } from '@/components/ui/button';
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
import { useMutation } from 'convex/react';
import { use, useState } from 'react';
import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs';

const NewTeam = ({ btnText }: { btnText: string }) => {
  const createTeam = useMutation(api.teams.createTeam);
  const { user } = useUser();
  const [formState, setFormState] = useState<{ name: string }>({ name: '' });
  const handleChange = (key: string, value: string) => {
    setFormState((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  const createNewTeam = () => {
    if (!user) return;
    createTeam({
      createdBy: user?.primaryEmailAddress?.emailAddress || '',
      name: formState.name,
      projects: [],
    });
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className='w-36'>{btnText}</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>New Team</DialogTitle>
          <DialogDescription>Add your team details</DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='name' className='text-right'>
              Team Name
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
            <Button type='submit' onClick={() => createNewTeam()}>
              Create
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default NewTeam;
