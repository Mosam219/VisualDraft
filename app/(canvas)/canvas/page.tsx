'use client';
import { useRef, useState } from 'react';
import Border from './__components/Border';
import CanvasSection from './__components/CanvasSection';
import DocumentSection from './__components/DocumentSection';
import { useAtom } from 'jotai';
import { globalState } from '@/stores/globalStore';

export default function CanvasPage() {
  const [store] = useAtom(globalState);
  const [canvasSectionWidth, setCanvasSectionWidth] = useState<number>(0);

  const changeCanvasSectionWidth = (newWidth: number) => {
    setCanvasSectionWidth(newWidth);
  };

  return (
    <div className=' h-full w-full flex'>
      {store.view === 'both' ? (
        <>
          <DocumentSection />
          <Border changeCanvasSectionWidth={changeCanvasSectionWidth} />
          <CanvasSection width={canvasSectionWidth} />
        </>
      ) : null}
      {store.view === 'canvas' ? <CanvasSection width={canvasSectionWidth} fullView /> : null}
      {store.view === 'document' ? <DocumentSection /> : null}
    </div>
  );
}
