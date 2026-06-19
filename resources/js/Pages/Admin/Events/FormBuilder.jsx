import React, { useState, useRef } from 'react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';

export default function FormBuilder({ title, schema, setSchema }) {
    const [fieldLabel, setFieldLabel] = useState('');
    const [fieldType, setFieldType] = useState('text');
    const [fieldRequired, setFieldRequired] = useState(false);
    const [fieldOptions, setFieldOptions] = useState('');
    const [editingIndex, setEditingIndex] = useState(null);
    const formBuilderRef = useRef(null);

    const saveField = () => {
        if (!fieldLabel) return;
        const updatedField = {
            name: fieldLabel.toLowerCase().replace(/[^a-z0-9]+/g, '_'),
            label: fieldLabel,
            type: fieldType,
            required: fieldRequired,
            ...(fieldType === 'select' && { options: fieldOptions.split(',').map(o => o.trim()).filter(Boolean) })
        };

        if (editingIndex !== null) {
            const newSchema = [...schema];
            newSchema[editingIndex] = updatedField;
            setSchema(newSchema);
            setEditingIndex(null);
        } else {
            setSchema([...schema, updatedField]);
        }
        
        setFieldLabel('');
        setFieldOptions('');
        setFieldType('text');
        setFieldRequired(false);
    };

    const editField = (index) => {
        const field = schema[index];
        setFieldLabel(field.label);
        setFieldType(field.type);
        setFieldRequired(field.required || false);
        setFieldOptions(field.options ? field.options.join(', ') : '');
        setEditingIndex(index);
        
        // Scroll to the form builder section specifically
        if (formBuilderRef.current) {
            formBuilderRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    const cancelEdit = () => {
        setEditingIndex(null);
        setFieldLabel('');
        setFieldOptions('');
        setFieldType('text');
        setFieldRequired(false);
    };

    const removeField = (index) => {
        const newSchema = [...schema];
        newSchema.splice(index, 1);
        setSchema(newSchema);
        if (editingIndex === index) {
            cancelEdit();
        } else if (editingIndex !== null && editingIndex > index) {
            setEditingIndex(editingIndex - 1);
        }
    };

    return (
        <div ref={formBuilderRef} className="mb-8 border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-800 shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
                {editingIndex !== null && (
                    <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded-md dark:bg-amber-900/50 dark:text-amber-400">
                        Editing Mode Active
                    </span>
                )}
            </div>
            
            <div className={`p-4 rounded-lg mb-4 flex flex-wrap gap-4 items-end transition-all ${editingIndex !== null ? 'bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800' : 'bg-gray-50 dark:bg-gray-900/50 border border-transparent'}`}>
                <div className="flex-1 min-w-[200px]">
                    <InputLabel value="Field Label" />
                    <TextInput
                        type="text"
                        value={fieldLabel}
                        onChange={(e) => setFieldLabel(e.target.value)}
                        placeholder="e.g. T-Shirt Size, University Name"
                        className="mt-1 block w-full"
                    />
                </div>
                <div className="w-full sm:w-48">
                    <InputLabel value="Field Type" />
                    <select
                        value={fieldType}
                        onChange={(e) => setFieldType(e.target.value)}
                        className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 rounded-md shadow-sm"
                    >
                        <option value="text">Text (Short)</option>
                        <option value="textarea">Textarea (Long)</option>
                        <option value="number">Number</option>
                        <option value="date">Date Picker (Calendar)</option>
                        <option value="file">File Upload</option>
                        <option value="select">Dropdown (Select)</option>
                    </select>
                </div>
                {fieldType === 'select' && (
                    <div className="flex-1 min-w-[200px]">
                        <InputLabel value="Dropdown Options" />
                        <TextInput
                            type="text"
                            value={fieldOptions}
                            onChange={(e) => setFieldOptions(e.target.value)}
                            placeholder="Comma separated: Small, Medium, Large"
                            className="mt-1 block w-full"
                        />
                    </div>
                )}
                <div className="w-32 flex items-center mb-2">
                    <input
                        type="checkbox"
                        checked={fieldRequired}
                        onChange={(e) => setFieldRequired(e.target.checked)}
                        className="rounded dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-indigo-600 shadow-sm focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:focus:ring-offset-gray-800 mr-2"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Required</span>
                </div>
                <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                    <button
                        type="button"
                        onClick={saveField}
                        className={`${editingIndex !== null ? 'bg-amber-500 hover:bg-amber-600 shadow-[0_0_10px_rgba(245,158,11,0.3)]' : 'bg-indigo-600 hover:bg-indigo-700'} text-white px-4 py-2 rounded-lg shadow-sm transition w-full sm:w-auto font-bold`}
                    >
                        {editingIndex !== null ? 'Update Field' : 'Add Field'}
                    </button>
                    {editingIndex !== null && (
                        <button
                            type="button"
                            onClick={cancelEdit}
                            className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition font-bold"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </div>

            {schema.length > 0 ? (
                <ul className="divide-y divide-gray-200 dark:divide-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
                    {schema.map((field, index) => (
                        <li key={index} className={`p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 transition-colors ${editingIndex === index ? 'bg-amber-50/50 dark:bg-amber-900/10' : ''}`}>
                            <div>
                                <span className="font-bold text-gray-800 dark:text-gray-200">{field.label}</span>
                                <span className="ml-2 text-sm text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                                    {field.type}
                                </span>
                                {field.required && (
                                    <span className="ml-2 text-xs text-red-600 dark:text-red-400 font-bold bg-red-100 dark:bg-red-900/30 px-2 py-0.5 rounded">
                                        Required
                                    </span>
                                )}
                                {field.type === 'select' && field.options && (
                                    <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                        Options: {field.options.join(', ')}
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => editField(index)}
                                    className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-bold text-sm px-3 py-1 border border-indigo-200 dark:border-indigo-900/50 rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                                >
                                    Edit
                                </button>
                                <button
                                    type="button"
                                    onClick={() => removeField(index)}
                                    className="text-red-600 hover:text-red-800 dark:text-red-500 dark:hover:text-red-400 font-bold text-sm px-3 py-1 border border-red-200 dark:border-red-900/50 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                >
                                    Remove
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400 italic">
                    No custom fields added yet. Default fields (Name, Email, etc.) are always included.
                </div>
            )}
        </div>
    );
}
