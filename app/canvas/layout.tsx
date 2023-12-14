import Header from './[canvasId]/__components/Header';

export default function CanvasLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='h-full w-full'>
      <Header />
      <div className='h-[95%]'>{children}</div>
    </div>
  );
}
