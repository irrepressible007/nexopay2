import { Head, Link, usePage } from '@inertiajs/react';

export default function IDCard({ registration }) {
    const { siteSettings = {} } = usePage().props;
    return (
        <>
            <Head title={`ID Card - ${registration.event.title}`} />
            
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-6 print:p-0 print:bg-white">
                <div className="max-w-md w-full">
                    {/* Back button (hidden on print) */}
                    <div className="mb-6 text-center print:hidden">
                        <Link href={route('dashboard')} className="text-indigo-600 hover:text-indigo-800 font-semibold dark:text-indigo-400">
                            &larr; Back to Dashboard
                        </Link>
                    </div>

                    {/* ID Card Wrapper */}
                    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden print:shadow-none print:border print:border-gray-300">
                        {/* Header Banner */}
                        <div className="bg-indigo-600 text-white p-6 text-center">
                            <h2 className="text-2xl font-black uppercase tracking-widest opacity-80">{siteSettings?.app_name || 'Nexopay'} Pass</h2>
                            <h1 className="text-3xl font-bold mt-2 truncate">{registration.event.title}</h1>
                        </div>

                        {/* Body */}
                        <div className="p-8 text-center flex flex-col items-center">
                            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center text-4xl font-bold text-gray-400 mb-6 border-4 border-white shadow-lg -mt-16 overflow-hidden">
                                {registration.user.name.charAt(0).toUpperCase()}
                            </div>
                            
                            <h3 className="text-2xl font-bold text-gray-900">{registration.user.name}</h3>
                            <p className="text-indigo-600 font-bold uppercase tracking-wider mt-1">{registration.role.name}</p>

                            <div className="my-8 p-4 bg-gray-50 rounded-2xl border border-gray-100 inline-block">
                                <img 
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${registration.qr_uuid}`} 
                                    alt="QR Code Ticket" 
                                    className="w-48 h-48 mx-auto"
                                />
                                <div className="mt-3 text-xs text-gray-400 font-mono break-all max-w-[200px]">
                                    {registration.qr_uuid}
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
                            <p className="text-sm text-gray-500 font-medium">Please present this QR code at the entrance.</p>
                        </div>
                    </div>

                    {/* Print button */}
                    <div className="mt-8 text-center print:hidden">
                        <button 
                            onClick={() => window.print()}
                            className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-indigo-700 transition"
                        >
                            Print ID Card
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
