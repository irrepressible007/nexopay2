import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ auth, events }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Manage Events</h2>}
        >
            <Head title="Manage Events" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex justify-end mb-4">
                        <Link
                            href={route('admin.events.create')}
                            className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 transition"
                        >
                            + Create Event
                        </Link>
                    </div>

                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-900">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {events.data.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-4 text-center text-gray-500">No events found.</td>
                                    </tr>
                                ) : (
                                    events.data.map((event) => (
                                        <tr key={event.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{event.title}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 capitalize">{event.status}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{event.start_date ? new Date(event.start_date).toLocaleDateString() : 'N/A'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex items-center gap-4">
                                                <Link href={route('admin.analytics.index', { event_id: event.id })} className="text-green-600 hover:text-green-900 dark:text-green-400 font-bold">Analytics</Link>
                                                <Link href={route('admin.events.edit', event.id)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400">Edit</Link>
                                                <Link href={route('admin.events.destroy', event.id)} method="delete" as="button" className="text-red-600 hover:text-red-900 dark:text-red-400">Delete</Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
