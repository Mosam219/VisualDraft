import Canvas from './Canvas';
interface Props {
  width: number;
  fullView?: boolean;
}
const CanvasSection = ({ width, fullView }: Props) => {
  return (
    <div
      {...(width && { style: { width: `${width}px` } })}
      className={`${
        fullView
          ? 'w-full'
          : !width
          ? `w-[49%] min-w-[50%] max-w-[70%]`
          : ' min-w-[50%] max-w-[70%]'
      } h-full`}
    >
      <Canvas width={width} />
    </div>
  );
};

CanvasSection.displayName = 'Canvas Section';
export default CanvasSection;
