import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import { useForm } from '@inertiajs/react';

export default function PublicPage({ auth, page }) {
    const { navPages, flash, siteSettings = {} } = usePage().props;
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const submitContact = (e) => {
        e.preventDefault();
        post(route('contact.store'), {
            onSuccess: () => reset()
        });
    };

    return (
        <>
            <Head title={`${page.title} - ${siteSettings.app_name || 'Nexopay'}`} />
            <div className="min-h-screen bg-[#030712] text-gray-100 font-sans selection:bg-indigo-500 selection:text-white flex flex-col">
                
                <Navbar />

                <main className="flex-1 pt-24 pb-24 px-6 relative z-10">
                    {page.slug === 'contact-us' ? (
                        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-start mt-12">
                            {/* Left Column: Info */}
                            <motion.div 
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-2 uppercase text-white">
                                    Establish
                                </h1>
                                <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-8 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400 uppercase">
                                    Contact
                                </h1>
                                <div 
                                    className="prose prose-invert prose-sm max-w-sm text-gray-400 font-medium tracking-wide leading-relaxed mb-12"
                                    dangerouslySetInnerHTML={{ __html: (page.content && page.content !== '<p><br></p>') ? page.content : (siteSettings.contact_subtitle || 'Secure line to Nexopay Command. Send us your brief, inquiry, or partnership request.') }}
                                />

                                <div className="space-y-8">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                            <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold text-gray-500 tracking-wider uppercase mb-1">Headquarters</div>
                                            <div className="text-sm font-semibold text-gray-200 uppercase">{siteSettings.contact_address || '123 Vice City Blvd, Neon District'}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                            <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold text-gray-500 tracking-wider uppercase mb-1">Direct Line</div>
                                            <div className="text-sm font-semibold text-gray-200 uppercase">{siteSettings.contact_phone || '+1 (555) 123-4567'}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                            <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold text-gray-500 tracking-wider uppercase mb-1">Secure Email</div>
                                            <div className="text-sm font-semibold text-gray-200 uppercase">{siteSettings.contact_email || 'contact@nexopay.com'}</div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Right Column: Form */}
                            <motion.div 
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                className="bg-white/5 backdrop-blur-2xl border border-white/10 p-8 rounded-2xl shadow-2xl relative overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-blue-500"></div>
                                
                                {flash?.success && (
                                    <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-xl text-green-400 text-sm font-medium tracking-wide">
                                        {flash.success}
                                    </div>
                                )}

                                <form onSubmit={submitContact} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-500 tracking-widest uppercase mb-2">Agent Name</label>
                                            <input 
                                                type="text" 
                                                value={data.name}
                                                onChange={e => setData('name', e.target.value)}
                                                className="w-full bg-transparent border-0 border-b border-white/20 text-white focus:ring-0 focus:border-indigo-500 transition px-0 py-2 text-sm" 
                                                required
                                            />
                                            {errors.name && <div className="text-red-400 text-xs mt-1">{errors.name}</div>}
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-500 tracking-widest uppercase mb-2">Secure Email</label>
                                            <input 
                                                type="email" 
                                                value={data.email}
                                                onChange={e => setData('email', e.target.value)}
                                                className="w-full bg-transparent border-0 border-b border-white/20 text-white focus:ring-0 focus:border-indigo-500 transition px-0 py-2 text-sm" 
                                                required
                                            />
                                            {errors.email && <div className="text-red-400 text-xs mt-1">{errors.email}</div>}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 tracking-widest uppercase mb-2">Subject / Mission Brief</label>
                                        <input 
                                            type="text" 
                                            value={data.subject}
                                            onChange={e => setData('subject', e.target.value)}
                                            className="w-full bg-transparent border-0 border-b border-white/20 text-white focus:ring-0 focus:border-indigo-500 transition px-0 py-2 text-sm" 
                                            required
                                        />
                                        {errors.subject && <div className="text-red-400 text-xs mt-1">{errors.subject}</div>}
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 tracking-widest uppercase mb-2">Full Message</label>
                                        <textarea 
                                            rows="4" 
                                            value={data.message}
                                            onChange={e => setData('message', e.target.value)}
                                            className="w-full bg-transparent border-0 border-b border-white/20 text-white focus:ring-0 focus:border-indigo-500 transition px-0 py-2 text-sm resize-none"
                                            required
                                        ></textarea>
                                        {errors.message && <div className="text-red-400 text-xs mt-1">{errors.message}</div>}
                                    </div>
                                    
                                    <button 
                                        disabled={processing}
                                        type="submit" 
                                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold tracking-widest uppercase text-xs py-4 rounded-xl transition mt-4 shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] disabled:opacity-50"
                                    >
                                        Send Transmission &rarr;
                                    </button>
                                </form>
                            </motion.div>
                        </div>
                    ) : (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="max-w-4xl mx-auto"
                        >
                            <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-12 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                                {page.title}
                            </h1>

                            <div className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-a:text-indigo-400 hover:prose-a:text-indigo-300 prose-img:rounded-xl">
                                <div className="whitespace-pre-wrap font-medium text-gray-300 leading-relaxed">
                                    <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: page.content || '' }} />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </main>

                <Footer />
            </div>
        </>
    );
}
