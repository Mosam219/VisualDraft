'use client';
import NewProject from '@/app/project/[projectId]/__components/NewProjectModal';
import { TypographyP } from '@/components/ui/Typography';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { unixToStringFormat } from '@/lib/utils';
import { useQuery } from 'convex/react';
import React, { SetStateAction } from 'react';
import { DataTable } from './data-table';
import { columns } from './constants';

const TeamDetails = ({
  id,
  open,
  setOpen,
}: {
  id: string;
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
}) => {
  const teamDetails = useQuery(api.teams.getTeamById, { id: id as Id<'teams'> });
  const teamProjects = useQuery(api.projects.getProjectsByTeamId, { id: id as Id<'teams'> });
  console.log(teamProjects);
  return (
    <Dialog open={open} onOpenChange={setOpen} defaultOpen={open} modal>
      <DialogContent className='max-w-full w-3/5 xl:w-2/5'>
        <DialogHeader>
          <DialogTitle>{teamDetails?.name}</DialogTitle>
        </DialogHeader>
        <div>
          <div className='flex gap-3'>
            <TypographyP text={`Created By: `} />
            <TypographyP text={`${teamDetails?.createdBy}`} />
          </div>
          <div className='flex gap-3'>
            <TypographyP text={`Created On: `} />
            <TypographyP text={`${unixToStringFormat(teamDetails?._creationTime)}`} />
          </div>
        </div>
        <div className='flex flex-col items-center gap-3'>
          <NewProject teamId={id} />
          {/* listing of project */}
          <DataTable
            columns={columns}
            data={teamProjects?.map((item, index) => ({ ...item, index: index + 1 })) || []}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default TeamDetails;
