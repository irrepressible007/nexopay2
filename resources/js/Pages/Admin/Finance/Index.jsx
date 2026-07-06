import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';

export default function Index({ auth, registrations }) {
    const [selectedParticipant, setSelectedParticipant] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const { post, delete: destroy, processing } = useForm();

    const filteredRegistrations = registrations.filter(reg => {
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        const userName = (reg.user ? reg.user.name : reg.guest_name) || '';
        const userEmail = (reg.user ? reg.user.email : reg.guest_email) || '';
        const txid = reg.bkash_txid || '';
        const sender = reg.sender_number || '';
        const amount = String(reg.payable_amount || '');
        const eventTitle = reg.event ? reg.event.title : '';
        const roleName = reg.role ? reg.role.name : '';
        
        return userName.toLowerCase().includes(term) ||
               userEmail.toLowerCase().includes(term) ||
               txid.toLowerCase().includes(term) ||
               sender.toLowerCase().includes(term) ||
               amount.toLowerCase().includes(term) ||
               eventTitle.toLowerCase().includes(term) ||
               roleName.toLowerCase().includes(term) ||
               reg.status.toLowerCase().includes(term);
    });

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
                        <div className="p-6 text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h3 className="text-lg font-bold mb-2">Pending Manual Verification Queue</h3>
                                <p className="text-sm text-gray-500">
                                    Review the submitted bKash Transaction IDs against your merchant app and approve/reject registrations.
                                </p>
                            </div>
                            <div className="w-full md:w-auto">
                                <input
                                    type="text"
                                    placeholder="Search registrations..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm w-full md:w-64"
                                />
                            </div>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-900">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event & Role</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TxID / Sender</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {filteredRegistrations.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                                No registrations in the queue.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredRegistrations.map((reg) => (
                                            <tr 
                                                key={reg.id} 
                                                onClick={() => setSelectedParticipant(reg)}
                                                className={`cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition ${reg.status === 'pending' ? 'bg-yellow-50 dark:bg-yellow-900/10' : ''}`}
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-bold text-gray-900 dark:text-white">{reg.user?.name || reg.guest_name || 'Unknown User'}</div>
                                                    <div className="text-sm text-gray-500">{reg.user?.email || reg.guest_email || 'No email provided'}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-bold text-gray-900 dark:text-white">{reg.event?.title || 'Unknown Event'}</div>
                                                    <div className="text-sm text-gray-500">{reg.role?.name || 'Participant'}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap font-bold text-sm text-indigo-600 dark:text-indigo-400">
                                                    ৳{reg.payable_amount}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="font-mono text-sm uppercase text-gray-900 dark:text-white">{reg.bkash_txid || '-'}</div>
                                                    <div className="text-xs text-gray-500">{reg.sender_number || ''}</div>
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
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" onClick={(e) => e.stopPropagation()}>
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
                            Showing {filteredRegistrations.length} of {registrations.length} items
                        </div>
                    </div>
                </div>
            </div>

            {/* Participant Details Modal */}
            <Modal show={selectedParticipant !== null} onClose={() => setSelectedParticipant(null)} maxWidth="2xl">
                <div className="p-6 bg-white dark:bg-gray-900 w-full max-h-[85vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                            Participant Details
                        </h2>
                        <button onClick={() => setSelectedParticipant(null)} className="text-gray-400 hover:text-gray-500">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {selectedParticipant && (
                        <div className="space-y-6">
                            {/* Core Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</div>
                                    <div className="text-base text-gray-900 dark:text-gray-100 font-semibold">
                                        {selectedParticipant.user ? selectedParticipant.user.name : selectedParticipant.guest_name}
                                        {!selectedParticipant.user && <span className="ml-2 text-xs text-indigo-500 font-normal border border-indigo-200 dark:border-indigo-800 px-2 py-0.5 rounded-full">Guest</span>}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</div>
                                    <div className="text-base text-gray-900 dark:text-gray-100">
                                        {selectedParticipant.user ? selectedParticipant.user.email : selectedParticipant.guest_email}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Role</div>
                                    <div className="text-base text-gray-900 dark:text-gray-100 capitalize">
                                        {selectedParticipant.role?.name || 'N/A'}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</div>
                                    <div className="text-base">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            selectedParticipant.status === 'approved' ? 'bg-green-100 text-green-800' : 
                                            selectedParticipant.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {selectedParticipant.status}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Transaction ID</div>
                                    <div className="text-base text-gray-900 dark:text-gray-100 font-mono">
                                        {selectedParticipant.bkash_txid || 'N/A'}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Sender Number</div>
                                    <div className="text-base text-gray-900 dark:text-gray-100 font-mono">
                                        {selectedParticipant.sender_number || 'N/A'}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Amount Paid</div>
                                    <div className="text-base text-indigo-600 dark:text-indigo-400 font-bold">
                                        ৳{selectedParticipant.payable_amount}
                                    </div>
                                </div>
                            </div>

                            {/* Dynamic Form Data */}
                            {selectedParticipant.form_data && Object.keys(selectedParticipant.form_data).length > 0 && (
                                <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Form Responses</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {Object.entries(selectedParticipant.form_data).map(([key, value]) => (
                                            <div key={key} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 h-full">
                                                <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                                                    {key.replace(/_/g, ' ')}
                                                </div>
                                                <div className="text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap break-words">
                                                    {Array.isArray(value) ? value.join(', ') : (value || '-')}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="mt-6 flex justify-end">
                                <SecondaryButton onClick={() => setSelectedParticipant(null)}>Close</SecondaryButton>
                            </div>
                        </div>
                    )}
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
