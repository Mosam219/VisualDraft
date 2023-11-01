'use client';
import { useCallback } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import './documentSection.css';

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

const DocumentSection: React.FC = () => {
  const documentSectionRef = useCallback((wrapper: HTMLDivElement) => {
    if (!wrapper) return;
    wrapper.innerHTML = '';
    const editor = document.createElement('div');
    wrapper.append(editor);

    new Quill(editor, { theme: 'snow', modules: { toolbar: TOOLBAR_OPTIONS } });
  }, []);

  return (
    <div
      className='flex flex-1 flex-col h-full border-r-2 border-secondary p-2 resize-x'
      ref={documentSectionRef}
    ></div>
  );
};
export default DocumentSection;
