export default function ProjectLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='h-full w-full'>
      <div className='h-full'>{children}</div>
    </div>
  );
}
