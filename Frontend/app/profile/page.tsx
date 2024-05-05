'use client';
import { useConvex, useMutation, useQuery } from 'convex/react';
import { useEffect, useMemo } from 'react';
import { unixToStringFormat } from '@/lib/utils';
import { api } from '@/convex/_generated/api';
import UserProfile from './__components/UserDetails';
import { useUser } from '@clerk/nextjs';
import Teams from './__sections/Teams';

const Profile = () => {
  const convex = useConvex();
  const { user } = useUser();
  const getUser = useQuery(api.users.getUser, {
    email: user?.primaryEmailAddress?.emailAddress || '',
  });
  const createUser = useMutation(api.users.createUser);
  const getAllUserProject = useQuery(api.projects.getAllUserProject, {
    createdBy: getUser?.email,
  });

  const allCanvases = useMemo(() => {
    return getAllUserProject?.map((item) => ({
      createdOn: unixToStringFormat(item._creationTime),
      id: item._id,
      name: item.name,
    }));
  }, [getAllUserProject]);

  const checkUser = async () => {
    const dbUser = await convex.query(api.users.getUser, {
      email: user?.primaryEmailAddress?.emailAddress || '',
    });
    if (!dbUser)
      createUser({
        name: user?.fullName || '',
        email: user?.primaryEmailAddress?.emailAddress || '',
        image: user?.imageUrl || '',
      });
  };

  useEffect(() => {
    if (user) {
      checkUser();
    }
  }, [user]);

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

      <Teams />
    </div>
  );
};
export default Profile;
