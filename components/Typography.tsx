const TypographyH1 = ({ text }: { text: string }) => {
  return <h1 className='scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl'>{text}</h1>;
};

const TypographyH2 = ({ text }: { text: string }) => {
  return <h2 className='scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0'>{text}</h2>;
};

const TypographyH3 = ({ text }: { text: string }) => {
  return <h3 className='scroll-m-20 text-2xl font-semibold tracking-tight'>{text}</h3>;
};

const TypographyH4 = ({ text }: { text: string }) => {
  return <h4 className='scroll-m-20 text-xl font-semibold tracking-tight'>{text}</h4>;
};

const TypographyP = ({ text }: { text: string }) => {
  return <p className='leading-7 [&:not(:first-child)]:mt-6'>{text}</p>;
};

export { TypographyH1, TypographyH2, TypographyH3, TypographyH4, TypographyP };
