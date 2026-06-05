import React, { useMemo } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// Register custom line height format
const Parchment = Quill.import('parchment');
const LineHeightStyle = new Parchment.Attributor.Style('lineHeight', 'line-height', {
    scope: Parchment.Scope.BLOCK,
    whitelist: ['1.0', '1.5', '2.0', '2.5', '3.0']
});
Quill.register(LineHeightStyle, true);

export default function RichTextEditor({ value, onChange, className = '', placeholder = 'Write something amazing...' }) {
    
    // Memoize the modules so ReactQuill doesn't re-render unexpectedly
    const modules = useMemo(() => ({
        toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'align': [] }],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'lineHeight': ['1.0', '1.5', '2.0', '2.5', '3.0'] }],
            ['link'],
            ['clean']
        ],
        clipboard: {
            // toggle to add extra line breaks when pasting HTML:
            matchVisual: false,
        }
    }), []);

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike',
        'color', 'background',
        'align',
        'list', 'bullet',
        'lineHeight',
        'link'
    ];

    return (
        <div className={`rich-text-container bg-white dark:bg-gray-900 rounded-md shadow-sm border border-gray-300 dark:border-gray-700 overflow-hidden ${className}`}>
            <ReactQuill 
                theme="snow"
                value={value || ''}
                onChange={onChange}
                modules={modules}
                formats={formats}
                placeholder={placeholder}
                className="dark:text-gray-200"
            />
        </div>
    );
}
