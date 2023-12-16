export default function CanvasLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='h-full w-full'>
      <div className='h-[95%]'>{children}</div>
    </div>
  );
}
