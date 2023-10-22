import Header from './__components/Header';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='mx-auto h-full w-[80%] md:w-3/5'>
      <Header />
      {children}
    </div>
  );
};
export default Layout;
