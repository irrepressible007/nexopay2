import React, { useState } from 'react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';

export default function FormBuilder({ title, schema, setSchema }) {
    const [fieldLabel, setFieldLabel] = useState('');
    const [fieldType, setFieldType] = useState('text');
    const [fieldRequired, setFieldRequired] = useState(false);
    const [fieldOptions, setFieldOptions] = useState('');

    const addField = () => {
        if (!fieldLabel) return;
        const newField = {
            name: fieldLabel.toLowerCase().replace(/[^a-z0-9]+/g, '_'),
            label: fieldLabel,
            type: fieldType,
            required: fieldRequired,
            ...(fieldType === 'select' && { options: fieldOptions.split(',').map(o => o.trim()).filter(Boolean) })
        };
        setSchema([...schema, newField]);
        setFieldLabel('');
        setFieldOptions('');
    };

    const removeField = (index) => {
        const newSchema = [...schema];
        newSchema.splice(index, 1);
        setSchema(newSchema);
    };

    return (
        <div className="mb-8 border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-800 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{title}</h3>
            
            <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg mb-4 flex flex-wrap gap-4 items-end">
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
                <button
                    type="button"
                    onClick={addField}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-indigo-700 transition"
                >
                    Add Field
                </button>
            </div>

            {schema.length > 0 ? (
                <ul className="divide-y divide-gray-200 dark:divide-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
                    {schema.map((field, index) => (
                        <li key={index} className="p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
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
                            <button
                                type="button"
                                onClick={() => removeField(index)}
                                className="text-red-600 hover:text-red-800 dark:text-red-500 dark:hover:text-red-400 font-bold text-sm px-3 py-1 border border-red-200 dark:border-red-900/50 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            >
                                Remove
                            </button>
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
