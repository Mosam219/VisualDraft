'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { LampContainer } from '../../components/ui/lamp';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';

const Page = () => {
  const { push } = useRouter();

  const { isSignedIn } = useAuth();
  const handleNavigate = (url: string) => {
    push(url);
  };
  return (
    <>
      <LampContainer>
        <motion.h1
          initial={{ opacity: 0.5, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: 'easeInOut',
          }}
          className='mt-8 bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl'
        >
          <div className='flex flex-col items-center gap-7'>
            Build Docs <br /> the right way
            {isSignedIn ? (
              <Button
                className='w-[150px] bg-slate-50 text-slate-900 '
                variant={'secondary'}
                onClick={() => handleNavigate('profile')}
              >
                Dashboard
              </Button>
            ) : (
              <div className='flex gap-3'>
                <Button
                  className='w-[100px] bg-slate-50 text-slate-900 '
                  variant={'secondary'}
                  onClick={() => handleNavigate('sign-in')}
                >
                  Sign In
                </Button>
                <Button
                  className='w-[100px] bg-slate-50 text-slate-900 '
                  variant={'secondary'}
                  onClick={() => handleNavigate('sign-up')}
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </motion.h1>
      </LampContainer>
    </>
  );
};
export default Page;
