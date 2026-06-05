import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import RichTextEditor from '@/Components/RichTextEditor';
import SegmentBuilder from './SegmentBuilder';

export default function Create({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        start_date: '',
        end_date: '',
        status: 'draft',
        participant_price: 0,
        ca_price: 0,
        volunteer_price: 0,
        capacity: '',
        form_schema: [],
        segments: [],
        has_base_price: false,
        require_login: true,
    });

    const [fieldLabel, setFieldLabel] = useState('');
    const [fieldType, setFieldType] = useState('text');
    const [fieldRequired, setFieldRequired] = useState(false);

    const addField = () => {
        if (!fieldLabel) return;
        const newField = {
            name: fieldLabel.toLowerCase().replace(/[^a-z0-9]+/g, '_'),
            label: fieldLabel,
            type: fieldType,
            required: fieldRequired
        };
        setData('form_schema', [...data.form_schema, newField]);
        setFieldLabel('');
    };

    const removeField = (index) => {
        const newSchema = [...data.form_schema];
        newSchema.splice(index, 1);
        setData('form_schema', newSchema);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.events.store'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Create Event</h2>}
        >
            <Head title="Create Event" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <form onSubmit={submit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <InputLabel htmlFor="title" value="Event Title" />
                                    <TextInput
                                        id="title"
                                        name="title"
                                        value={data.title}
                                        className="mt-1 block w-full"
                                        isFocused={true}
                                        onChange={(e) => setData('title', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.title} className="mt-2" />
                                </div>
                                
                                <div>
                                    <InputLabel htmlFor="status" value="Status" />
                                    <select
                                        id="status"
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                    >
                                        <option value="draft">Draft</option>
                                        <option value="upcoming">Upcoming</option>
                                        <option value="ongoing">Ongoing</option>
                                        <option value="past">Past</option>
                                    </select>
                                    <InputError message={errors.status} className="mt-2" />
                                </div>

                                <div className="col-span-1 md:col-span-2">
                                    <InputLabel htmlFor="description" value="Event Description & Details" />
                                    <RichTextEditor
                                        value={data.description}
                                        onChange={(content) => setData('description', content)}
                                        className="mt-1"
                                        placeholder="Describe your event..."
                                    />
                                    <InputError message={errors.description} className="mt-2" />
                                </div>

                                <div className="col-span-1 md:col-span-2 mt-2 p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl flex items-center justify-between">
                                    <div>
                                        <h4 className="text-base font-bold text-gray-900 dark:text-white">Require Account Login</h4>
                                        <p className="text-sm text-gray-500">If disabled, users can register as guests without logging in.</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={data.require_login}
                                            onChange={(e) => setData('require_login', e.target.checked)}
                                        />
                                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                                    </label>
                                </div>

                                <div>
                                    <InputLabel htmlFor="start_date" value="Start Date" />
                                    <TextInput
                                        id="start_date"
                                        type="datetime-local"
                                        name="start_date"
                                        value={data.start_date}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('start_date', e.target.value)}
                                    />
                                    <InputError message={errors.start_date} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="end_date" value="End Date" />
                                    <TextInput
                                        id="end_date"
                                        type="datetime-local"
                                        name="end_date"
                                        value={data.end_date}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('end_date', e.target.value)}
                                    />
                                    <InputError message={errors.end_date} className="mt-2" />
                                </div>
                                
                                {data.has_base_price && (
                                    <>
                                        <div>
                                            <InputLabel htmlFor="participant_price" value="Participant Price (৳)" />
                                            <TextInput
                                                id="participant_price"
                                                type="number"
                                                name="participant_price"
                                                value={data.participant_price}
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData('participant_price', e.target.value)}
                                            />
                                            <InputError message={errors.participant_price} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="ca_price" value="Campus Ambassador Price (৳)" />
                                            <TextInput
                                                id="ca_price"
                                                type="number"
                                                name="ca_price"
                                                value={data.ca_price}
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData('ca_price', e.target.value)}
                                            />
                                            <InputError message={errors.ca_price} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="volunteer_price" value="Volunteer Price (৳)" />
                                            <TextInput
                                                id="volunteer_price"
                                                type="number"
                                                name="volunteer_price"
                                                value={data.volunteer_price}
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData('volunteer_price', e.target.value)}
                                            />
                                            <InputError message={errors.volunteer_price} className="mt-2" />
                                        </div>
                                    </>
                                )}
                                
                                <div>
                                    <InputLabel htmlFor="capacity" value="Capacity (Optional)" />
                                    <TextInput
                                        id="capacity"
                                        type="number"
                                        name="capacity"
                                        value={data.capacity}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('capacity', e.target.value)}
                                    />
                                    <InputError message={errors.capacity} className="mt-2" />
                                </div>
                            </div>

                            <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Dynamic Registration Form Builder</h3>
                                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg mb-4 flex gap-4 items-end">
                                    <div className="flex-1">
                                        <InputLabel value="Field Label" />
                                        <TextInput
                                            type="text"
                                            value={fieldLabel}
                                            onChange={(e) => setFieldLabel(e.target.value)}
                                            placeholder="e.g. T-Shirt Size, University Name"
                                            className="mt-1 block w-full"
                                        />
                                    </div>
                                    <div className="w-48">
                                        <InputLabel value="Field Type" />
                                        <select
                                            value={fieldType}
                                            onChange={(e) => setFieldType(e.target.value)}
                                            className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 rounded-md shadow-sm"
                                        >
                                            <option value="text">Text (Short)</option>
                                            <option value="textarea">Textarea (Long)</option>
                                            <option value="number">Number</option>
                                            <option value="file">File Upload</option>
                                        </select>
                                    </div>
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
                                        className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 transition"
                                    >
                                        Add Field
                                    </button>
                                </div>

                                {data.form_schema.length > 0 && (
                                    <ul className="divide-y divide-gray-200 dark:divide-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                                        {data.form_schema.map((field, index) => (
                                            <li key={index} className="p-4 flex justify-between items-center bg-white dark:bg-gray-800">
                                                <div>
                                                    <span className="font-bold text-gray-800 dark:text-gray-200">{field.label}</span>
                                                    <span className="ml-2 text-sm text-gray-500">({field.type})</span>
                                                    {field.required && <span className="ml-2 text-xs text-red-500 font-bold">*Required</span>}
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeField(index)}
                                                    className="text-red-500 hover:text-red-700 font-bold"
                                                >
                                                    Remove
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            <SegmentBuilder
                                segments={data.segments}
                                setSegments={(segs) => setData('segments', segs)}
                                hasBasePrice={data.has_base_price}
                                setHasBasePrice={(val) => setData('has_base_price', val)}
                            />

                            <div className="flex items-center justify-end mt-8">
                                <PrimaryButton className="ml-4" disabled={processing}>
                                    Save Event
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
