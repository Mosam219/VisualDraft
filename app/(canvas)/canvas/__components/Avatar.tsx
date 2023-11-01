import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const UserAvatar = () => {
  return (
    <Avatar>
      <AvatarImage src='https://github.com/shadcn.png' alt='@shadcn' className='h-10 aspect-auto' />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  );
};
export default UserAvatar;
