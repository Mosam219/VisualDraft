'use client';
import Image from 'next/image';
import { TypographyH2, TypographyP } from '@/components/ui/Typography';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import Projects from './__components/Projects';
import Projects from './__components/Projects';
import { useQuery } from 'convex/react';
import { useMemo } from 'react';
import { unixToStringFormat } from '@/lib/utils';
import { api } from '@/convex/_generated/api';
import UserProfile from './__components/UserDetails';
import { api } from '@/convex/_generated/api';
import UserProfile from './__components/UserDetails';

const Profile = () => {
  const session = useSession();
  const user = session.data?.user;
  const getAllUserCanvas = useQuery(api.tasks.getAllUserCanvas, { id: user?.id });


  const allCanvases = useMemo(() => {
    return getAllUserCanvas?.map((item) => ({
      createdOn: unixToStringFormat(item._creationTime),
      id: item._id,
      name: item.name,
    }));
  }, [getAllUserCanvas]);

  return (
    <div className='w-full h-full'>
      {user ? <UserProfile user={user} /> : <UserProfile.Skeleton />}
      {user ? <UserProfile user={user} /> : <UserProfile.Skeleton />}
      <hr className='w-[95%] h-1 mx-auto my-2  border-0 rounded md:my-8 dark:bg-muted-foreground bg-muted md:w-[85%]' />
      <div className='flex justify-center font-bold text-2xl mb-3'>Your Projects</div>
      {allCanvases ? <Projects allCanvases={allCanvases} /> : <Projects.Skeleton />}
      <div className='flex justify-center font-bold text-2xl mb-3'>Your Projects</div>
      {allCanvases ? <Projects allCanvases={allCanvases} /> : <Projects.Skeleton />}
    </div>
  );
};
export default Profile;
