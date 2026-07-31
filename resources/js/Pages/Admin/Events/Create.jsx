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

export default function Create({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        short_description: '',
        cover_image: null,
        description: '',
        start_date: '',
        end_date: '',
        status: 'draft',
        participant_price: 0,
        ca_price: 0,
        volunteer_price: 0,
        capacity: '',
        form_schema: [],
        ca_form_schema: [],
        volunteer_form_schema: [],
        segments: [],
        has_base_price: false,
        require_login: true,
        payment_instructions: '',
        allow_participant_registration: true,
        allow_ca_registration: true,
        allow_volunteer_registration: true,
    });

    const [activeFormTab, setActiveFormTab] = useState('participant');

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
                                    <InputLabel htmlFor="cover_image" value="Cover Image" />
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
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Payment Instructions</h3>
                                <p className="text-sm text-gray-500 mb-4">Add your custom payment instructions, bKash numbers, or QR code images here. These will be shown to users at Step 3.</p>
                                <RichTextEditor
                                    value={data.payment_instructions}
                                    onChange={(content) => setData('payment_instructions', content)}
                                    placeholder="e.g. Send money to 01XXX-XXXXXX (bKash Personal) and enter the Transaction ID below..."
                                />
                                <InputError message={errors.payment_instructions} className="mt-2" />
                            </div>

                            <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Form Availability / Response Toggles</h3>
                                <p className="text-sm text-gray-500 mb-4">Turn registration responses ON or OFF independently for each role/form without affecting each other.</p>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <label className={`flex items-center justify-between p-4 rounded-xl border transition cursor-pointer ${data.allow_participant_registration ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20' : 'border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'}`}>
                                        <div>
                                            <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm block">Participant Form</span>
                                            <span className={`text-xs font-bold ${data.allow_participant_registration ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
                                                {data.allow_participant_registration ? '● Accepting Responses' : '○ Closed (Off)'}
                                            </span>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={data.allow_participant_registration}
                                            onChange={(e) => setData('allow_participant_registration', e.target.checked)}
                                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 h-5 w-5"
                                        />
                                    </label>

                                    <label className={`flex items-center justify-between p-4 rounded-xl border transition cursor-pointer ${data.allow_ca_registration ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20' : 'border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'}`}>
                                        <div>
                                            <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm block">CA Form</span>
                                            <span className={`text-xs font-bold ${data.allow_ca_registration ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
                                                {data.allow_ca_registration ? '● Accepting Responses' : '○ Closed (Off)'}
                                            </span>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={data.allow_ca_registration}
                                            onChange={(e) => setData('allow_ca_registration', e.target.checked)}
                                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 h-5 w-5"
                                        />
                                    </label>

                                    <label className={`flex items-center justify-between p-4 rounded-xl border transition cursor-pointer ${data.allow_volunteer_registration ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20' : 'border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'}`}>
                                        <div>
                                            <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm block">Volunteer Form</span>
                                            <span className={`text-xs font-bold ${data.allow_volunteer_registration ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
                                                {data.allow_volunteer_registration ? '● Accepting Responses' : '○ Closed (Off)'}
                                            </span>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={data.allow_volunteer_registration}
                                            onChange={(e) => setData('allow_volunteer_registration', e.target.checked)}
                                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 h-5 w-5"
                                        />
                                    </label>
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
