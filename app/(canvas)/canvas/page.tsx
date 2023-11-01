'use client';
import { useRef, useState } from 'react';
import Border from './__components/Border';
import CanvasSection from './__components/CanvasSection';
import DocumentSection from './__components/DocumentSection';

export default function CanvasPage() {
  const [canvasSectionWidth, setCanvasSectionWidth] = useState<number>(0);

  const changeCanvasSectionWidth = (newWidth: number) => {
    // canvasSectionRef?.current?.clientWidth = newWidth;
    setCanvasSectionWidth(newWidth);
  };

  return (
    <div className=' h-full w-full flex'>
      <DocumentSection />
      <Border changeCanvasSectionWidth={changeCanvasSectionWidth} />
      <CanvasSection width={canvasSectionWidth} />
    </div>
  );
}
