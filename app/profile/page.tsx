'use client';
import Projects from './__components/Projects';
import { useQuery } from 'convex/react';
import { useMemo } from 'react';
import { unixToStringFormat } from '@/lib/utils';
import { api } from '@/convex/_generated/api';
import UserProfile from './__components/UserDetails';
import { useUser } from '@clerk/nextjs';

const Profile = () => {
  const { user } = useUser();
  console.log(user);
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
      {user ? (
        <UserProfile
          user={{
            id: user.id,
            email: user?.primaryEmailAddress?.emailAddress,
            name: user?.fullName,
            image: user.imageUrl,
          }}
        />
      ) : (
        <UserProfile.Skeleton />
      )}
      <hr className='w-[95%] h-1 mx-auto my-2  border-0 rounded md:my-8 dark:bg-muted-foreground bg-muted md:w-[85%]' />
      <div className='flex justify-center font-bold text-2xl mb-3'>Your Projects</div>
      {allCanvases ? <Projects allCanvases={allCanvases} /> : <Projects.Skeleton />}
    </div>
  );
};
export default Profile;
