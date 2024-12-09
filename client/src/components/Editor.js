import React from 'react';
import ReactQuill from 'react-quill';

const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
    ['link', 'image'],
    ['clean'],
  ],
};

function Editor({ content, onChange }) {
  return (
    <div>
      <ReactQuill 
        value={content} 
        modules={modules} 
        onChange={onChange} 
      />
    </div>
  );
}

export default Editor;
