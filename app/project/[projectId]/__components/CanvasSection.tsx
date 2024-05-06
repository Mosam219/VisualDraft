import Canvas from '../features/Canvas';
interface Props {
  width: number;
  fullView?: boolean;
  canvasId: string;
}
const CanvasSection = ({ width, fullView, canvasId }: Props) => {
  return (
    <div
      {...(width && { style: { width: `${width}px` } })}
      className={`${
        fullView
          ? 'w-full'
          : !width
          ? `w-[49%] min-w-[50%] max-w-[70%]`
          : ' min-w-[50%] max-w-[70%]'
      } h-full relative`}
    >
      <Canvas width={width} canvasId={canvasId} />
    </div>
  );
};

CanvasSection.displayName = 'Canvas Section';
export default CanvasSection;
