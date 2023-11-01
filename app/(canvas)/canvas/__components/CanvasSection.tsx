import Canvas from './Canvas';
interface Props {
  width: number;
}
const CanvasSection = ({ width }: Props) => {
  return (
    <div
      {...(width && { style: { width: `${width}px` } })}
      className={`${!width ? `w-[49%]` : ''} min-w-[50%] max-w-[70%] h-full`}
    >
      <Canvas width={width} />
    </div>
  );
};

CanvasSection.displayName = 'Canvas Section';
export default CanvasSection;
