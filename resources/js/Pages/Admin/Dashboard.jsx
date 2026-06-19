import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Dashboard({ auth, metrics, siteSettings }) {
    const [primaryColor, setPrimaryColor] = useState(siteSettings?.primary_color || '#4f46e5');

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Admin Dashboard</h2>}
        >
            <Head title="Admin Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">


                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6 mt-6">
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="text-gray-900 dark:text-gray-100 font-bold text-2xl">{metrics.total_events}</div>
                            <div className="text-gray-500 dark:text-gray-400 text-sm">Total Events</div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="text-yellow-600 dark:text-yellow-400 font-bold text-2xl">{metrics.pending_registrations}</div>
                            <div className="text-gray-500 dark:text-gray-400 text-sm">Pending Registrations</div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="text-green-600 dark:text-green-400 font-bold text-2xl">{metrics.approved_registrations}</div>
                            <div className="text-gray-500 dark:text-gray-400 text-sm">Approved Registrations</div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="text-gray-900 dark:text-gray-100 font-bold text-2xl">{metrics.total_users}</div>
                            <div className="text-gray-500 dark:text-gray-400 text-sm">Total Users</div>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6 flex flex-col justify-center">
                            <div className="text-gray-900 dark:text-gray-100 mb-4">
                                Welcome to the Admin Hub! Manage your events and registrations here.
                            </div>
                            {auth.user.global_role === 'Admin' ? (
                                <Link
                                    href={route('admin.events.index')}
                                    className="bg-indigo-600 text-center text-white px-4 py-2 rounded shadow hover:bg-indigo-700 transition"
                                >
                                    Manage Events
                                </Link>
                            ) : (
                                <Link
                                    href={route('admin.finance.index')}
                                    className="bg-indigo-600 text-center text-white px-4 py-2 rounded shadow hover:bg-indigo-700 transition"
                                >
                                    Manage Registrations
                                </Link>
                            )}
                        </div>

                        {/* Theme Customizer - Only visible to Admins */}
                        {auth.user.global_role === 'Admin' && (
                            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Theme Customization</h3>
                                <p className="text-sm text-gray-500 mb-4">Set the primary color for the platform. You can pick a color visually or enter a hex code.</p>
                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    router.post(route('admin.settings.update'), {
                                        primary_color: primaryColor
                                    });
                                }} className="flex gap-4 items-end">
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Primary Color</label>
                                        <div className="flex items-center gap-3">
                                            <input 
                                                type="color" 
                                                value={primaryColor}
                                                onChange={(e) => setPrimaryColor(e.target.value)}
                                                className="h-10 w-14 cursor-pointer rounded border border-gray-300 bg-white p-1"
                                            />
                                            <input 
                                                type="text" 
                                                value={primaryColor}
                                                onChange={(e) => setPrimaryColor(e.target.value)}
                                                placeholder="e.g. #4f46e5"
                                                className="border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm flex-1"
                                            />
                                        </div>
                                    </div>
                                    <button type="submit" className="bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900 px-4 py-2 rounded shadow hover:bg-gray-700 transition">Save</button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
