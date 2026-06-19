import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';

export default function MailHub({ stats, logs }) {
    const { auth } = usePage().props;
    const [isComposeOpen, setIsComposeOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        recipient: '',
        subject: '',
        message: '',
        from_address: 'support@nexopay.com.bd',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.mails.send'), {
            onSuccess: () => {
                reset();
                setIsComposeOpen(false);
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-bold text-2xl leading-tight text-white flex items-center gap-3"><span className="text-3xl">📧</span> Admin Mail Hub</h2>}
        >
            <Head title="Mail Hub & Analytics" />

            <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
                
                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <h3 className="text-gray-400 text-sm font-medium mb-1">Mails Sent Today</h3>
                        <p className="text-4xl font-black text-white">{stats.today}</p>
                    </div>
                    
                    <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <h3 className="text-gray-400 text-sm font-medium mb-1">Mails Sent This Month</h3>
                        <p className="text-4xl font-black text-white">{stats.month}</p>
                    </div>
                    
                    <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <h3 className="text-gray-400 text-sm font-medium mb-1">Lifetime Mails Sent</h3>
                        <p className="text-4xl font-black text-green-400">{stats.lifetime}</p>
                    </div>
                </div>

                <div className="flex justify-between items-end">
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-2">Email Logs</h3>
                        <p className="text-gray-400 text-sm">A complete history of all emails sent by the platform.</p>
                    </div>
                    <button 
                        onClick={() => setIsComposeOpen(true)}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl font-bold shadow-[0_0_15px_rgba(79,70,229,0.3)] transition"
                    >
                        + Compose Mail
                    </button>
                </div>

                {/* Compose Modal */}
                {isComposeOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <div className="bg-[#0f172a] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-200">
                            <div className="flex justify-between items-center p-4 border-b border-white/10 bg-white/5 sticky top-0 z-10">
                                <h3 className="text-lg font-bold text-white">Compose Custom Mail</h3>
                                <button onClick={() => setIsComposeOpen(false)} className="text-gray-400 hover:text-white">&times;</button>
                            </div>
                            
                            <form onSubmit={submit} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">From Address</label>
                                    <select
                                        value={data.from_address}
                                        onChange={e => setData('from_address', e.target.value)}
                                        className="w-full bg-[#030712] border border-white/10 rounded-lg text-white p-2.5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                                    >
                                        <option value="support@nexopay.com.bd">support@nexopay.com.bd</option>
                                        <option value="hello@nexopay.com.bd">hello@nexopay.com.bd</option>
                                        <option value="nsc@nexopay.com.bd">nsc@nexopay.com.bd</option>
                                        <option value="no-reply@nexopay.com.bd">no-reply@nexopay.com.bd</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">To (Recipient Email)</label>
                                    <input
                                        type="email"
                                        value={data.recipient}
                                        onChange={e => setData('recipient', e.target.value)}
                                        className="w-full bg-[#030712] border border-white/10 rounded-lg text-white p-2.5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                                        placeholder="user@example.com"
                                        required
                                    />
                                    {errors.recipient && <p className="text-red-400 text-xs mt-1">{errors.recipient}</p>}
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Subject</label>
                                    <input
                                        type="text"
                                        value={data.subject}
                                        onChange={e => setData('subject', e.target.value)}
                                        className="w-full bg-[#030712] border border-white/10 rounded-lg text-white p-2.5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                                        placeholder="Hello from Nexopay!"
                                        required
                                    />
                                    {errors.subject && <p className="text-red-400 text-xs mt-1">{errors.subject}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Message (HTML Supported)</label>
                                    <textarea
                                        value={data.message}
                                        onChange={e => setData('message', e.target.value)}
                                        className="w-full bg-[#030712] border border-white/10 rounded-lg text-white p-2.5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none min-h-[150px]"
                                        placeholder="Write your email body here. You can use HTML tags like <b>bold</b> or <br> for new lines."
                                        required
                                    />
                                    {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message}</p>}
                                </div>

                                <div className="pt-4 flex justify-end gap-3 border-t border-white/10">
                                    <button 
                                        type="button" 
                                        onClick={() => setIsComposeOpen(false)}
                                        className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        disabled={processing}
                                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-lg font-bold shadow-lg flex items-center gap-2 disabled:opacity-50"
                                    >
                                        {processing ? 'Sending...' : 'Send Mail 🚀'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Logs Table */}
                <div className="bg-[#0f172a] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-white/5 text-gray-300 font-semibold border-b border-white/10">
                                <tr>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Recipient</th>
                                    <th className="px-6 py-4">Subject</th>
                                    <th className="px-6 py-4">Type</th>
                                    <th className="px-6 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {logs.data.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                            No emails sent yet.
                                        </td>
                                    </tr>
                                ) : (
                                    logs.data.map(log => (
                                        <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                                            <td className="px-6 py-4 text-gray-400 whitespace-nowrap">
                                                {new Date(log.created_at).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-white">
                                                {log.recipient}
                                            </td>
                                            <td className="px-6 py-4 text-gray-300 truncate max-w-xs">
                                                {log.subject}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                                                    log.type === 'custom' 
                                                        ? 'bg-purple-900/30 text-purple-400 border border-purple-500/20' 
                                                        : 'bg-blue-900/30 text-blue-400 border border-blue-500/20'
                                                }`}>
                                                    {log.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                                                    log.status === 'sent' 
                                                        ? 'bg-green-900/30 text-green-400 border border-green-500/20' 
                                                        : 'bg-red-900/30 text-red-400 border border-red-500/20'
                                                }`}>
                                                    {log.status}
                                                </span>
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
