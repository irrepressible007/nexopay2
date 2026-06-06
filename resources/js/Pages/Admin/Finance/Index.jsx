import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function Index({ auth, registrations }) {
    const { post, delete: destroy, processing } = useForm();

    const handleApprove = (id) => {
        if (confirm('Are you sure you want to approve this registration? It will send a Premium Ticket email.')) {
            post(route('admin.finance.approve', id));
        }
    };

    const handleReject = (id) => {
        if (confirm('Are you sure you want to reject this registration? It will send a rejection email.')) {
            post(route('admin.finance.reject', id));
        }
    };

    const handleResend = (id) => {
        if (confirm('Are you sure you want to resend the email for this registration?')) {
            post(route('admin.finance.resend', id));
        }
    };

    const handleDelete = (id) => {
        if (confirm('Are you absolutely sure you want to permanently delete this registration? This action cannot be undone and will update revenue.')) {
            destroy(route('admin.finance.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Finance Hub</h2>
                    <Link
                        href={route('admin.dashboard')}
                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400"
                    >
                        &larr; Back to Dashboard
                    </Link>
                </div>
            }
        >
            <Head title="Finance Hub" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-bold mb-2">Pending Manual Verification Queue</h3>
                            <p className="text-sm text-gray-500 mb-4">
                                Review the submitted bKash Transaction IDs against your merchant app and approve/reject registrations.
                            </p>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-900">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event & Role</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TxID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {registrations.data.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                                No registrations in the queue.
                                            </td>
                                        </tr>
                                    ) : (
                                        registrations.data.map((reg) => (
                                            <tr key={reg.id} className={reg.status === 'pending' ? 'bg-yellow-50 dark:bg-yellow-900/10' : ''}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-bold text-gray-900 dark:text-white">{reg.user?.name || reg.guest_name || 'Unknown User'}</div>
                                                    <div className="text-sm text-gray-500">{reg.user?.email || reg.guest_email || 'No email provided'}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-bold text-gray-900 dark:text-white">{reg.event?.title || 'Unknown Event'}</div>
                                                    <div className="text-sm text-gray-500">{reg.role?.name || 'Participant'}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap font-mono text-sm uppercase">
                                                    {reg.bkash_txid}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                                        reg.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                                                        reg.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                                                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                    }`}>
                                                        {reg.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    {reg.status === 'pending' && (
                                                        <div className="flex gap-2">
                                                            <button 
                                                                onClick={() => handleApprove(reg.id)}
                                                                disabled={processing}
                                                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded transition"
                                                            >
                                                                Approve
                                                            </button>
                                                            <button 
                                                                onClick={() => handleReject(reg.id)}
                                                                disabled={processing}
                                                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition"
                                                            >
                                                                Reject
                                                            </button>
                                                            <button 
                                                                onClick={() => handleDelete(reg.id)}
                                                                disabled={processing}
                                                                className="bg-gray-800 hover:bg-black text-white px-3 py-1 rounded transition ml-2"
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    )}
                                                    {reg.status === 'approved' && (
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-green-600 font-bold">Ticket Sent ✓</span>
                                                            <button 
                                                                onClick={() => handleResend(reg.id)}
                                                                disabled={processing}
                                                                className="text-xs bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 px-2 py-1 rounded transition"
                                                            >
                                                                Resend Email
                                                            </button>
                                                            <button 
                                                                onClick={() => handleDelete(reg.id)}
                                                                disabled={processing}
                                                                className="text-xs bg-red-100 hover:bg-red-200 text-red-800 dark:bg-red-900 dark:hover:bg-red-800 dark:text-red-200 px-2 py-1 rounded transition"
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    )}
                                                    {reg.status === 'rejected' && (
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-red-600 font-bold">Rejected ✕</span>
                                                            <button 
                                                                onClick={() => handleResend(reg.id)}
                                                                disabled={processing}
                                                                className="text-xs bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 px-2 py-1 rounded transition"
                                                            >
                                                                Resend Email
                                                            </button>
                                                            <button 
                                                                onClick={() => handleDelete(reg.id)}
                                                                disabled={processing}
                                                                className="text-xs bg-red-100 hover:bg-red-200 text-red-800 dark:bg-red-900 dark:hover:bg-red-800 dark:text-red-200 px-2 py-1 rounded transition"
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                        
                        {/* Pagination placeholder (simple text for now) */}
                        <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-gray-500 text-sm">
                            Showing {registrations.data.length} items
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
