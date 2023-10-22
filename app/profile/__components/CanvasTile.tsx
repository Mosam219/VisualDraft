import Image from 'next/image';
import { Image as CanvasImage } from 'lucide-react';
import { TypographyP } from '@/components/Typography';
import { motion } from 'framer-motion';

interface Props {
  name: string;
  img?: string;
}

const CanvasTile = (props: Props) => {
  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className='h-32 bg-secondary flex flex-col items-center justify-center border rounded-sm'
    >
      {props.img ? (
        <Image className='w-1/2' src={props.img} alt='canvas-image' />
      ) : (
        <CanvasImage className='w-1/2 h-1/2 bg-card' />
      )}
      <TypographyP text={props.name} />
    </motion.div>
  );
};
export default CanvasTile;
