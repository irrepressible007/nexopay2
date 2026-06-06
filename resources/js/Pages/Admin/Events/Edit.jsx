import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import RichTextEditor from '@/Components/RichTextEditor';
import SegmentBuilder from './SegmentBuilder';
import FormBuilder from './FormBuilder';

export default function Edit({ auth, event }) {
    const { data, setData, put, post, processing, errors } = useForm({
        _method: 'put',
        title: event.title || '',
        short_description: event.short_description || '',
        cover_image: null,
        description: event.description || '',
        start_date: event.start_date ? event.start_date.slice(0, 16) : '',
        end_date: event.end_date ? event.end_date.slice(0, 16) : '',
        status: event.status || 'draft',
        participant_price: event.participant_price || 0,
        ca_price: event.ca_price || 0,
        volunteer_price: event.volunteer_price || 0,
        capacity: event.capacity || '',
        form_schema: event.form_schema || [],
        ca_form_schema: event.ca_form_schema || [],
        volunteer_form_schema: event.volunteer_form_schema || [],
        segments: event.segments || [],
        has_base_price: event.has_base_price ?? false,
        require_login: event.require_login !== undefined ? event.require_login : true,
    });

    const [activeFormTab, setActiveFormTab] = useState('participant');

    const submit = (e) => {
        e.preventDefault();
        
        post(route('admin.events.update', event.id), {
            preserveScroll: true,
            forceFormData: true,
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Edit Event: {event.title}</h2>}
        >
            <Head title={`Edit Event - ${event.title}`} />

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
                                    <InputLabel htmlFor="cover_image" value="Cover Image" />
                                    {event.cover_image && (
                                        <div className="mb-3">
                                            <img src={event.cover_image} alt="Current Cover" className="w-48 h-auto rounded-lg shadow-sm border border-gray-700" />
                                        </div>
                                    )}
                                    <input
                                        id="cover_image"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setData('cover_image', e.target.files[0])}
                                        className="mt-1 block w-full text-sm text-gray-500 dark:text-gray-400
                                            file:mr-4 file:py-2 file:px-4
                                            file:rounded-md file:border-0
                                            file:text-sm file:font-semibold
                                            file:bg-indigo-50 file:text-indigo-700
                                            dark:file:bg-indigo-900/20 dark:file:text-indigo-400
                                            hover:file:bg-indigo-100 dark:hover:file:bg-indigo-900/30"
                                    />
                                    <InputError message={errors.cover_image} className="mt-2" />
                                </div>

                                <div className="col-span-1 md:col-span-2">
                                    <InputLabel htmlFor="short_description" value="Short Description (Appears before 'Read More')" />
                                    <RichTextEditor
                                        value={data.short_description}
                                        onChange={(content) => setData('short_description', content)}
                                        className="mt-1"
                                        placeholder="Brief details about the event..."
                                    />
                                    <InputError message={errors.short_description} className="mt-2" />
                                </div>

                                <div className="col-span-1 md:col-span-2 mt-4">
                                    <InputLabel htmlFor="description" value="Full Description (Appears after 'Read More')" />
                                    <RichTextEditor
                                        value={data.description}
                                        onChange={(content) => setData('description', content)}
                                        className="mt-1"
                                        placeholder="Full detailed event description..."
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
                                
                                <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
                                    <button
                                        type="button"
                                        onClick={() => setActiveFormTab('participant')}
                                        className={`py-2 px-4 border-b-2 font-medium text-sm ${
                                            activeFormTab === 'participant'
                                                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                                        }`}
                                    >
                                        Participant Form
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setActiveFormTab('ca')}
                                        className={`py-2 px-4 border-b-2 font-medium text-sm ${
                                            activeFormTab === 'ca'
                                                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                                        }`}
                                    >
                                        CA Form
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setActiveFormTab('volunteer')}
                                        className={`py-2 px-4 border-b-2 font-medium text-sm ${
                                            activeFormTab === 'volunteer'
                                                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                                        }`}
                                    >
                                        Volunteer Form
                                    </button>
                                </div>

                                {activeFormTab === 'participant' && (
                                    <FormBuilder 
                                        title="Participant Form Fields"
                                        schema={data.form_schema} 
                                        setSchema={(schema) => setData('form_schema', schema)} 
                                    />
                                )}
                                
                                {activeFormTab === 'ca' && (
                                    <FormBuilder 
                                        title="Campus Ambassador Form Fields"
                                        schema={data.ca_form_schema} 
                                        setSchema={(schema) => setData('ca_form_schema', schema)} 
                                    />
                                )}
                                
                                {activeFormTab === 'volunteer' && (
                                    <FormBuilder 
                                        title="Volunteer Form Fields"
                                        schema={data.volunteer_form_schema} 
                                        setSchema={(schema) => setData('volunteer_form_schema', schema)} 
                                    />
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
                                    Update Event
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
