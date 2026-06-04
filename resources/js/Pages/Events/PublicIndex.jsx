import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';

export default function PublicIndex({ events }) {
    const { siteSettings = {} } = usePage().props;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0, scale: 0.95 },
        visible: {
            y: 0,
            opacity: 1,
            scale: 1,
            transition: { type: 'spring', stiffness: 100, damping: 20 }
        }
    };

    return (
        <>
            <Head title={`All Events - ${siteSettings.app_name || 'Nexopay'}`} />
            
            <div className="min-h-screen bg-[#030712] text-gray-100 font-sans selection:bg-indigo-500 selection:text-white relative flex flex-col overflow-x-hidden">
                
                {/* Background Ambient Glows */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 blur-[150px] rounded-full" />
                    <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 blur-[150px] rounded-full" />
                </div>

                <Navbar />

                <main className="flex-1 relative z-10 pt-32 pb-24 px-6">
                    <div className="max-w-7xl mx-auto">
                        
                        <div className="mb-16 text-center max-w-3xl mx-auto">
                            <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-6 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400 uppercase">
                                Explore Events
                            </h1>
                            <p className="text-xl text-gray-400 leading-relaxed">
                                Discover premium upcoming events on {siteSettings.app_name || 'Nexopay'}. Secure your spot and experience the future of event management.
                            </p>
                        </div>

                        <motion.div 
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
                        >
                            {events.data.length === 0 ? (
                                <div className="col-span-full text-center text-gray-500 py-24 bg-[rgba(255,255,255,0.02)] backdrop-blur-xl rounded-3xl border border-white/10 font-medium text-lg">
                                    No upcoming events found. Check back later!
                                </div>
                            ) : (
                                events.data.map(event => (
                                    <motion.div 
                                        key={event.id}
                                        variants={itemVariants}
                                        whileHover={{ scale: 1.03 }}
                                        className="group relative bg-[rgba(255,255,255,0.03)] backdrop-blur-xl rounded-3xl overflow-hidden border border-[rgba(255,255,255,0.1)] hover:border-indigo-500 transition-all duration-500 hover:shadow-[0_0_40px_rgba(99,102,241,0.2)] flex flex-col h-[500px]"
                                    >
                                        <Link href={route('event.show', event.slug)} className="absolute inset-0 z-10" aria-label={`View ${event.title}`} />
                                        
                                        {/* Cover Image */}
                                        <div className="h-1/2 relative overflow-hidden bg-gray-900">
                                            {event.cover_image ? (
                                                <img 
                                                    src={event.cover_image} 
                                                    alt={event.title}
                                                    className="w-full h-full object-cover filter grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-110"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-indigo-900/50 to-purple-900/50" />
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#030712] to-transparent opacity-80" />
                                            
                                            {/* Floating Badges */}
                                            <div className="absolute top-4 left-4 z-20 flex gap-2">
                                                <div className="bg-black/60 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-full flex items-center gap-2">
                                                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                                    <span className="text-xs font-bold text-white uppercase tracking-wider">{event.status}</span>
                                                </div>
                                            </div>
                                            {event.start_date && (
                                                <div className="absolute bottom-4 right-4 z-20 bg-white text-black px-4 py-1.5 rounded-full shadow-lg font-bold text-sm">
                                                    {new Date(event.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="p-8 flex-1 flex flex-col relative z-20 pointer-events-none">
                                            <h3 className="text-3xl font-black mb-3 text-white leading-tight">{event.title}</h3>
                                            <p className="text-gray-400 mb-6 line-clamp-2 flex-1 text-sm leading-relaxed">
                                                {event.description || 'Join us for this amazing experience.'}
                                            </p>
                                            
                                            <div className="flex justify-between items-center mt-auto pt-6 border-t border-white/10">
                                                <div className="text-sm font-semibold text-gray-400">
                                                    Tickets from <span className="text-white text-lg font-bold ml-1">৳{event.participant_price}</span>
                                                </div>
                                                <span className="bg-indigo-600 text-white px-5 py-2.5 rounded-full text-sm font-bold opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0 shadow-[0_0_15px_rgba(99,102,241,0.5)] pointer-events-auto">
                                                    Get Tickets
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </motion.div>

                        {/* Pagination Links (Basic Implementation) */}
                        {events.links && events.links.length > 3 && (
                            <div className="mt-16 flex justify-center items-center gap-2">
                                {events.links.map((link, i) => (
                                    <Link 
                                        key={i} 
                                        href={link.url || '#'}
                                        className={`px-4 py-2 rounded-lg font-bold transition-all ${
                                            link.active 
                                                ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]' 
                                                : link.url 
                                                    ? 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5' 
                                                    : 'text-gray-600 cursor-not-allowed hidden'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        )}
                        
                    </div>
                </main>

                <Footer />
            </div>
        </>
    );
}
