import { TypographyH2, TypographyP } from '@/components/ui/Typography';
import { motion } from 'framer-motion';
import Image from 'next/image';
import userAvatar from '../../../static/user_avatar.svg';
import { Skeleton } from '@/components/ui/skeleton';

interface Props {
  user:
    | ({
        id: string;
      } & {
        name?: string | null | undefined;
        email?: string | null | undefined;
        image?: string | null | undefined;
      })
    | undefined;
}
const UserProfile = ({ user }: Props) => {
  return (
    <div className='w-full h-56 md:h-48 flex flex-col items-center pt-7'>
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
  );
};

UserProfile.Skeleton = function ProfileSkeleton() {
  return (
    <div className='w-full h-48 flex flex-col items-center pt-7'>
      <Skeleton className='w-28 rounded-full h-28' />
      <Skeleton className='w-36 h-8 mt-7' />
      <Skeleton className='w-36 h-8 mt-2' />
    </div>
  );
};
export default UserProfile;
