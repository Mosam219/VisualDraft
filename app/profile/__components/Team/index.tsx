'use client';
import { TypographyH3, TypographyP } from '@/components/ui/Typography';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { useState } from 'react';
import TeamDetails from './TeamDetails';

interface Props {
  team: { id: string; name: string; createdOn: string };
}
const Team: React.FC<Props> = ({ team }) => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <>
      <Card className='cursor-pointer' onClick={() => setOpen(true)}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: 'tween',
            duration: 0.2,
          }}
          className='h-[170px] rounded-md shadow-lg flex flex-col items-center justify-center gap-1'
        >
          <TypographyH3 text={team.name} />
          <TypographyP text={`Created On: ${team.createdOn}`} />
        </motion.div>
      </Card>

      <TeamDetails open={open} setOpen={setOpen} id={team.id} />
    </>
  );
};
export default Team;
