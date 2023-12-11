'use client';
import { useState } from 'react';
import Border from './[canvasId]/__components/Border';
import CanvasSection from './[canvasId]/__components/CanvasSection';
import DocumentSection from './[canvasId]/__components/DocumentSection';
import { useAtom } from 'jotai';
import { globalState } from '@/stores/globalStore';

function CanvasPage({ params }: { params: { canvasId: string } }) {
  const [store] = useAtom(globalState);
  const [canvasSectionWidth, setCanvasSectionWidth] = useState<number>(0);

  const changeCanvasSectionWidth = (newWidth: number) => {
    setCanvasSectionWidth(newWidth);
  };

  return (
    <div className=' h-full w-full flex'>
      {store.view === 'both' ? (
        <>
          <DocumentSection docId={params.canvasId} />
          <Border changeCanvasSectionWidth={changeCanvasSectionWidth} />
          <CanvasSection canvasId={params.canvasId} width={canvasSectionWidth} />
        </>
      ) : null}
      {store.view === 'canvas' ? (
        <CanvasSection canvasId={params.canvasId} width={canvasSectionWidth} fullView />
      ) : null}
      {store.view === 'document' ? <DocumentSection docId={params.canvasId} /> : null}
    </div>
  );
}

export default CanvasPage;
