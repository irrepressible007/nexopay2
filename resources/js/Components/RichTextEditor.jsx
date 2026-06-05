import React, { useMemo } from 'react';
import ReactQuill from 'react-quill';
import Quill from 'quill';
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
        toolbar: {
            container: [
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'color': [] }, { 'background': [] }],
                [{ 'align': [] }],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                [{ 'lineHeight': ['1.0', '1.5', '2.0', '2.5', '3.0'] }],
                ['link', 'image'],
                ['clean']
            ],
            handlers: {
                image: imageHandler
            }
        },
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
        'link', 'image'
    ];

    function imageHandler() {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
            const file = input.files[0];
            if (!file) return;

            const formData = new FormData();
            formData.append('image', file);

            try {
                // Determine the quill instance
                const quill = this.quill; 
                const range = quill.getSelection();

                // Show a loading indicator (optional but good UX)
                quill.insertText(range.index, 'Uploading image...', 'italic', true);

                const response = await fetch('/api/upload-image', {
                    method: 'POST',
                    headers: {
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                    },
                    body: formData
                });

                const data = await response.json();
                
                quill.deleteText(range.index, 18); // remove 'Uploading image...'

                if (response.ok && data.url) {
                    quill.insertEmbed(range.index, 'image', data.url);
                } else {
                    alert(data.error || 'Upload failed');
                }
            } catch (error) {
                console.error('Image upload failed:', error);
                alert('An error occurred during upload.');
            }
        };
    }

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
