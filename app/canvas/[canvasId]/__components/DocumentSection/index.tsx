'use client';
import 'react-quill/dist/quill.snow.css';
import './documentSection.css';
import { useQuill } from 'react-quilljs';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import debounce from 'lodash/debounce';

const TOOLBAR_OPTIONS = [
  ['bold', 'italic', 'underline'], // toggled buttons
  ['blockquote', 'code-block'],

  // [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: 'ordered' }, { list: 'bullet' }],
  // [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
  // [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
  // [{ direction: 'rtl' }], // text direction

  // [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  // [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  // [{ font: [inter] }],
  // [{ align: [] }],

  // ['clean'], // remove formatting button
];

const DocumentSection: React.FC<{ docId: string }> = ({ docId }) => {
  // const documentSectionRef = useCallback((wrapper: HTMLDivElement) => {
  //   if (!wrapper) return;
  //   wrapper.innerHTML = '';
  //   const editor = document.createElement('div');
  //   wrapper.append(editor);
  //   if (!window.document) return;
  //   new Quill(editor, { theme: 'snow', modules: { toolbar: TOOLBAR_OPTIONS } });
  // }, []);
  const [firstLoad, setFirstLoad] = useState<boolean>(true);
  const { quill, quillRef } = useQuill({ modules: { toolbar: TOOLBAR_OPTIONS }, theme: 'snow' });
  const updateDoc = useMutation(api.tasks.updateDoc);
  const getDoc = useQuery(api.tasks.getDoc, { id: docId as Id<'canvas'> });
  const saveToDb = async (content: string) => {
    console.log('saving to db', content, docId);
    await updateDoc({ content: content, docId: docId as Id<'canvas'> });
  };
  const delayedSave = debounce(async (content: string) => {
    await saveToDb(content);
  }, 3000);

  const changeHandler = () => {
    if (!quill) return;
    const content = quill.root.innerHTML;
    delayedSave(content);
  };

  useEffect(() => {
    if (!quill) return;
    if (getDoc?.docContent && firstLoad) {
      setFirstLoad(false);
      quill.clipboard.dangerouslyPasteHTML(getDoc?.docContent);
    }

    quill.on('text-change', changeHandler);
    return () => {
      quill.off('text-change', changeHandler); // Clean up the event listener
    };
  }, [quill, getDoc]);

  return (
    <div
      className='flex flex-1 flex-col h-full border-r-2 border-secondary p-2 resize-x'
      // ref={documentSectionRef}
    >
      <div ref={quillRef} />
    </div>
  );
};
export default DocumentSection;
