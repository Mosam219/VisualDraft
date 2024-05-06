import Header from './[projectId]/__components/Header';

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='h-full w-full'>
      <Header />
      <div className='h-[95%]'>{children}</div>
    </div>
  );
}
