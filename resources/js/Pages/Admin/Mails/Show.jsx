import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import RichTextEditor from '@/Components/RichTextEditor';

export default function MailShow({ email }) {
    const [isReplying, setIsReplying] = useState(false);
    const [isForwarding, setIsForwarding] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        recipient: '',
        subject: '',
        message: '',
        from_address: 'support@nexopay.com.bd',
        parent_id: email.id,
    });

    const startReply = () => {
        setIsReplying(true);
        setIsForwarding(false);
        setData({
            ...data,
            recipient: email.recipient,
            subject: email.subject.startsWith('Re:') ? email.subject : `Re: ${email.subject}`,
            message: `<br><br><br><blockquote><p><b>On ${new Date(email.created_at).toLocaleString()}, you wrote to ${email.recipient}:</b></p><br>${email.body || ''}</blockquote>`,
        });
    };

    const startForward = () => {
        setIsForwarding(true);
        setIsReplying(false);
        setData({
            ...data,
            recipient: '',
            subject: email.subject.startsWith('Fwd:') ? email.subject : `Fwd: ${email.subject}`,
            message: `<br><br><br><blockquote><p><b>---------- Forwarded message ---------</b><br><b>Date:</b> ${new Date(email.created_at).toLocaleString()}<br><b>Subject:</b> ${email.subject}<br><b>To:</b> ${email.recipient}</p><br>${email.body || ''}</blockquote>`,
        });
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.mails.send'), {
            onSuccess: () => {
                reset();
                setIsReplying(false);
                setIsForwarding(false);
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4">
                    <Link href={route('admin.mails.index')} className="text-gray-400 hover:text-white transition">
                        ← Back to Inbox
                    </Link>
                    <h2 className="font-bold text-2xl leading-tight text-white truncate max-w-2xl">
                        {email.subject || '(No Subject)'}
                    </h2>
                </div>
            }
        >
            <Head title={email.subject || 'View Mail'} />

            <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-6">
                
                {/* Email Display Container */}
                <div className="bg-[#0f172a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                    {/* Email Header */}
                    <div className="p-6 border-b border-white/10 bg-white/5 flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-indigo-600/30 text-indigo-400 flex items-center justify-center font-bold text-xl border border-indigo-500/20 shrink-0">
                                {email.recipient.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-lg">{email.recipient}</h3>
                                <p className="text-gray-400 text-sm">To: {email.recipient}</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <span className="text-gray-400 text-sm">{new Date(email.created_at).toLocaleString()}</span>
                            <div className="flex gap-2">
                                <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${email.type === 'custom' ? 'bg-purple-900/50 text-purple-400' : 'bg-blue-900/50 text-blue-400'}`}>
                                    {email.type}
                                </span>
                                <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${email.status === 'sent' ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'}`}>
                                    {email.status}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Email Body */}
                    <div className="p-8 text-gray-200 prose prose-invert max-w-none bg-black/20 rounded-b-2xl">
                        {email.body ? (
                            <div dangerouslySetInnerHTML={{ __html: email.body }} />
                        ) : (
                            <p className="text-gray-500 italic">No message body was recorded for this email. (Emails sent before the Inbox feature update will not have a saved body).</p>
                        )}
                    </div>
                </div>

                {/* Reply / Forward Actions */}
                {!isReplying && !isForwarding ? (
                    <div className="flex gap-4">
                        <button 
                            onClick={startReply}
                            className="bg-white/10 hover:bg-white/20 border border-white/10 text-white px-6 py-3 rounded-xl font-bold transition flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
                            Reply
                        </button>
                        <button 
                            onClick={startForward}
                            className="bg-white/10 hover:bg-white/20 border border-white/10 text-white px-6 py-3 rounded-xl font-bold transition flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" /></svg>
                            Forward
                        </button>
                    </div>
                ) : (
                    <div className="bg-[#0f172a] border border-white/10 rounded-2xl shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div className="p-4 border-b border-white/10 bg-white/5 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                {isReplying ? (
                                    <><svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg> Replying</>
                                ) : (
                                    <><svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" /></svg> Forwarding</>
                                )}
                            </h3>
                            <button 
                                onClick={() => { setIsReplying(false); setIsForwarding(false); }}
                                className="text-gray-400 hover:text-white transition px-3 py-1 rounded hover:bg-white/10"
                            >
                                Cancel
                            </button>
                        </div>
                        <form onSubmit={submit} className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">To</label>
                                    <input
                                        type="email"
                                        value={data.recipient}
                                        onChange={e => setData('recipient', e.target.value)}
                                        className="w-full bg-[#030712] border border-white/10 rounded-lg text-white p-2.5 focus:border-indigo-500 outline-none"
                                        placeholder="recipient@example.com"
                                        required
                                    />
                                    {errors.recipient && <p className="text-red-400 text-xs mt-1">{errors.recipient}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">From</label>
                                    <select
                                        value={data.from_address}
                                        onChange={e => setData('from_address', e.target.value)}
                                        className="w-full bg-[#030712] border border-white/10 rounded-lg text-white p-2.5 focus:border-indigo-500 outline-none"
                                    >
                                        <option value="support@nexopay.com.bd">support@nexopay.com.bd</option>
                                        <option value="hello@nexopay.com.bd">hello@nexopay.com.bd</option>
                                        <option value="nsc@nexopay.com.bd">nsc@nexopay.com.bd</option>
                                        <option value="no-reply@nexopay.com.bd">no-reply@nexopay.com.bd</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Subject</label>
                                <input
                                    type="text"
                                    value={data.subject}
                                    onChange={e => setData('subject', e.target.value)}
                                    className="w-full bg-[#030712] border border-white/10 rounded-lg text-white p-2.5 focus:border-indigo-500 outline-none"
                                    required
                                />
                                {errors.subject && <p className="text-red-400 text-xs mt-1">{errors.subject}</p>}
                            </div>

                            <div className="text-gray-900">
                                <label className="block text-sm font-medium text-gray-300 mb-1">Message</label>
                                <RichTextEditor
                                    value={data.message}
                                    onChange={val => setData('message', val)}
                                    placeholder="Write your email here..."
                                    className="bg-white rounded-lg"
                                />
                                {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message}</p>}
                            </div>

                            <div className="pt-4 flex justify-end">
                                <button 
                                    type="submit" 
                                    disabled={processing}
                                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-bold shadow-[0_0_15px_rgba(79,70,229,0.4)] disabled:opacity-50 transition"
                                >
                                    {processing ? 'Sending...' : 'Send Mail 🚀'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
