import Image from 'next/image';
import { Image as CanvasImage } from 'lucide-react';
import { TypographyP } from '@/components/ui/Typography';
import { motion } from 'framer-motion';

interface Props {
  name: string;
  img?: string;
  onClick: () => void;
}

const CanvasTile = (props: Props) => {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={props.onClick}
      className='h-10 bg-secondary flex flex-col items-center justify-center border rounded-sm m-2 cursor-pointer'
    >
      <TypographyP text={props.name} />
    </motion.div>
  );
};
export default CanvasTile;
