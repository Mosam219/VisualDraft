'use client';
import { useState } from 'react';
import Border from './__components/Border';
import CanvasSection from './__components/CanvasSection';
import DocumentSection from './__components/DocumentSection';
import { useAtom } from 'jotai';
import { globalState } from '@/stores/globalStore';
import { Id } from '@/convex/_generated/dataModel';

function CanvasPage({
  params: { canvasId },
}: {
  params: {
    canvasId: Id<'canvas'>;
  };
}) {
  const [store] = useAtom(globalState);
  const [canvasSectionWidth, setCanvasSectionWidth] = useState<number>(0);

  const changeCanvasSectionWidth = (newWidth: number) => {
    setCanvasSectionWidth(newWidth);
  };

  return (
    <div className=' h-full w-full flex'>
      {store.view === 'both' ? (
        <>
          <DocumentSection docId={canvasId} />
          <Border changeCanvasSectionWidth={changeCanvasSectionWidth} />
          <CanvasSection canvasId={canvasId} width={canvasSectionWidth} />
        </>
      ) : null}
      {store.view === 'canvas' ? (
        <CanvasSection canvasId={canvasId} width={canvasSectionWidth} fullView />
      ) : null}
      {store.view === 'document' ? <DocumentSection docId={canvasId} /> : null}
    </div>
  );
}

export default CanvasPage;
