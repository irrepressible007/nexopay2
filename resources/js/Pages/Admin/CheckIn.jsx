import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

export default function CheckIn({ auth }) {
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        qr_uuid: ''
    });

    const flash = usePage().props.flash || {};
    const inputRef = useRef(null);

    useEffect(() => {
        // Keep focus on the input field for continuous barcode/QR scanning
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [flash, processing]);

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.checkin.process'), {
            onSuccess: () => {
                reset('qr_uuid');
                clearErrors();
            }
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Ticket Scanner / Check-in</h2>}
        >
            <Head title="Check-in Scanner" />

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl sm:rounded-3xl p-8 text-center">
                        <div className="w-24 h-24 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                            </svg>
                        </div>

                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Scan Ticket QR Code</h3>
                        <p className="text-gray-500 mb-8">Ensure your barcode scanner is plugged in, or type the Ticket ID manually.</p>

                        {flash.success && (
                            <div className="mb-6 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 p-4 rounded-xl font-bold">
                                ✅ {flash.success}
                            </div>
                        )}

                        {flash.error && (
                            <div className="mb-6 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 p-4 rounded-xl font-bold">
                                ❌ {flash.error}
                            </div>
                        )}

                        <form onSubmit={submit} className="flex flex-col items-center">
                            <TextInput
                                id="qr_uuid"
                                type="text"
                                name="qr_uuid"
                                ref={inputRef}
                                value={data.qr_uuid}
                                className="block w-full text-center text-xl tracking-widest font-mono"
                                isFocused={true}
                                onChange={(e) => setData('qr_uuid', e.target.value)}
                                placeholder="Scan or Enter Ticket ID"
                                required
                            />
                            <InputError message={errors.qr_uuid} className="mt-2" />

                            <PrimaryButton className="mt-6 w-full justify-center py-4 text-lg" disabled={processing}>
                                {processing ? 'Checking...' : 'Check In Participant'}
                            </PrimaryButton>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
