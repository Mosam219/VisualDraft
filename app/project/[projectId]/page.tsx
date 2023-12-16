'use client';
import { useState } from 'react';
import Border from './__components/Border';
import CanvasSection from './__components/CanvasSection';
import DocumentSection from './__components/DocumentSection';
import { useAtom } from 'jotai';
import { globalState } from '@/stores/globalStore';
import { Id } from '@/convex/_generated/dataModel';

function CanvasPage({
  params: { projectId },
}: {
  params: {
    projectId: Id<'canvas'>;
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
          <DocumentSection docId={projectId} />
          <Border changeCanvasSectionWidth={changeCanvasSectionWidth} />
          <CanvasSection canvasId={projectId} width={canvasSectionWidth} />
        </>
      ) : null}
      {store.view === 'canvas' ? (
        <CanvasSection canvasId={projectId} width={canvasSectionWidth} fullView />
      ) : null}
      {store.view === 'document' ? <DocumentSection docId={projectId} /> : null}
    </div>
  );
}

export default CanvasPage;
