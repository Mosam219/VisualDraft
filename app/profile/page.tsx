'use client';
import userAvatar from '../../static/user_avatar.svg';
import Image from 'next/image';
import CanvasTile from './__components/CanvasTile';
import { TypographyH2, TypographyP } from '@/components/ui/Typography';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useMemo } from 'react';
import { unixToStringFormat } from '@/lib/utils';
import { useRouter } from 'next/navigation';

const Profile = () => {
  const { push } = useRouter();
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

  const redirectToCanvas = (id: string) => {
    push(`/canvas/${id}`);
  };
  return (
    <div className='w-full h-full bg-white text-black'>
      <div className='w-full flex flex-col items-center pt-7'>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.1 }}
        >
          <Image src={userAvatar} alt='user avatar' className='h-28' />
        </motion.div>
        <div className='w-2/3 pt-4 flex justify-center items-center'>
          <TypographyH2 text={user?.name || ''} />
        </div>
        <div className='w-2/3 flex justify-center'>
          <TypographyP text={user?.email || ''} />
        </div>
      </div>
      <hr className='w-[95%] h-1 mx-auto my-2 bg-gray-100 border-0 rounded md:my-8 dark:bg-gray-300 md:w-[85%]' />
      <div className='flex justify-center font-bold text-2xl'>Your Projects</div>
      <div className='w-[95%] mx-auto md:w-[85%] pt-2 max-h-[500px] overflow-scroll'>
        {allCanvases &&
          allCanvases.map((canvas, index) => (
            <CanvasTile
              onClick={() => redirectToCanvas(canvas.id)}
              key={index}
              name={canvas.name}
            />
          ))}
      </div>
    </div>
  );
};
export default Profile;
