'use client';
import userAvatar from '../../static/user_avatar.svg';
import Image from 'next/image';
import CanvasTile from './__components/CanvasTile';
import { TypographyH2, TypographyP } from '@/components/ui/Typography';
import { motion } from 'framer-motion';

const Profile = () => {
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
          <TypographyH2 text='Mosam Patel' />
        </div>
        <div className='w-2/3 flex justify-center'>
          <TypographyP text='Software Engineer' />
        </div>
      </div>
      <hr className='w-[95%] h-1 mx-auto my-2 bg-gray-100 border-0 rounded md:my-10 dark:bg-gray-300 md:w-[85%]' />
      <div className='w-[95%] mx-auto grid grid-cols-2 gap-4 md:w-[85%] pt-4 md:grid-cols-3 md:gap-5'>
        <CanvasTile name='Test 1' />
        <CanvasTile name='Test 2' />
        <CanvasTile name='Test 1' />
        <CanvasTile name='Test 2' />
        <CanvasTile name='Test 1' />
        <CanvasTile name='Test 2' />
        <CanvasTile name='Test 1' />
        <CanvasTile name='Test 2' />
        <CanvasTile name='Test 1' />
        <CanvasTile name='Test 2' />
        <CanvasTile name='Test 1' />
        <CanvasTile name='Test 2' />
      </div>
    </div>
  );
};
export default Profile;
