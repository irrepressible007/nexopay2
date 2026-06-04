import { Head, Link, usePage } from '@inertiajs/react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';

export default function Welcome({ auth, events, partners = [] }) {
    const { siteSettings = {} } = usePage().props;
    const { scrollYProgress } = useScroll();
    
    // Parallax effect for the hero text
    const yHero = useTransform(scrollYProgress, [0, 1], [0, 300]);
    const opacityHero = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
        }
    };

    const itemVariants = {
        hidden: { y: 40, opacity: 0, scale: 0.95 },
        visible: {
            y: 0,
            opacity: 1,
            scale: 1,
            transition: { type: 'spring', stiffness: 100, damping: 20 }
        }
    };

    return (
        <>
            <Head title={siteSettings.hero_title || `${siteSettings.app_name || 'Nexopay'} - The Future of Event Management`} />
            <style>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee 30s linear infinite;
                }
                .marquee-container:hover .animate-marquee {
                    animation-play-state: paused;
                }
            `}</style>
            <div className="min-h-screen bg-[#030712] text-gray-100 font-sans selection:bg-indigo-500 selection:text-white relative flex flex-col overflow-x-hidden">
                
                {/* Background Ambient Glows */}
                {!siteSettings.hero_image && (
                    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/30 blur-[150px] rounded-full" />
                        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/30 blur-[150px] rounded-full" />
                    </div>
                )}

                <Navbar />

                <main className="flex-1">
                    {/* Cinematic Hero Section */}
                    <section className="relative min-h-[90vh] flex items-center justify-center px-6 overflow-hidden">
                        
                        {siteSettings.hero_image && (
                            <div className="absolute inset-0 z-0 pointer-events-none">
                                <motion.img 
                                    initial={{ scale: 1.1 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 1.5, ease: 'easeOut' }}
                                    src={siteSettings.hero_image} 
                                    alt="Hero Background" 
                                    className="w-full h-full object-cover object-center" 
                                />
                                <div className="absolute inset-0 bg-gradient-to-b from-[#030712]/60 via-[#030712]/80 to-[#030712] backdrop-blur-[2px]" />
                                <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')]" />
                            </div>
                        )}

                        <motion.div 
                            style={{ y: yHero, opacity: opacityHero }}
                            className="text-center max-w-5xl z-10"
                        >
                            <motion.h1 
                                initial={{ y: 30, opacity: 0, filter: 'blur(10px)' }}
                                animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                                transition={{ duration: 1, delay: 0.1, ease: 'easeOut' }}
                                className="text-5xl md:text-8xl font-black tracking-tighter mb-8 leading-tight drop-shadow-2xl"
                                dangerouslySetInnerHTML={{ __html: siteSettings.hero_title || 'Seamless events, <br/> <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">powerful experiences.</span>' }}
                            />
                            <motion.p 
                                initial={{ y: 30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
                                className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed"
                            >
                                {siteSettings.hero_subtitle || `${siteSettings.app_name || 'Nexopay'} simplifies registration, automates your ticket delivery, and gives your attendees a premium checkout experience.`}
                            </motion.p>
                            <motion.div
                                initial={{ y: 30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
                            >
                                <Link href={route('events.index')} className="inline-block bg-white text-black px-10 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.2)]">
                                    Explore Events
                                </Link>
                            </motion.div>
                        </motion.div>
                    </section>

                    {/* Partners Marquee */}
                    {partners.length > 0 && (
                        <section className="relative z-20 py-16 border-y border-white/5 bg-black/40 backdrop-blur-md overflow-hidden marquee-container">
                            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#030712] to-transparent z-10 pointer-events-none" />
                            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#030712] to-transparent z-10 pointer-events-none" />
                            
                            <div className="flex w-max animate-marquee space-x-8 px-4">
                                {/* Double the array for infinite loop effect */}
                                {[...partners, ...partners].map((partner, idx) => (
                                    <a
                                        key={idx}
                                        href={partner.destination_url || '#'}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="w-[300px] md:w-[400px] h-[160px] bg-white/5 rounded-2xl flex items-center justify-center p-8 border border-white/5 hover:border-indigo-500/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(99,102,241,0.2)] group"
                                    >
                                        {partner.logo_image ? (
                                            <img 
                                                src={partner.logo_image} 
                                                alt={partner.name} 
                                                className="max-h-full max-w-full object-contain filter grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                                            />
                                        ) : (
                                            <span className="text-2xl font-bold tracking-widest text-gray-500 group-hover:text-indigo-400 transition-colors uppercase">
                                                {partner.name}
                                            </span>
                                        )}
                                    </a>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Events Showcase */}
                    <section id="events" className="relative z-20 py-32 px-6">
                        <div className="max-w-7xl mx-auto">
                            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                                <div>
                                    <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">
                                        Latest Events
                                    </h2>
                                    <p className="text-xl text-gray-400">Discover and register for premium upcoming events.</p>
                                </div>
                                <Link href={route('events.index')} className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-2 group">
                                    Show All Events 
                                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                                </Link>
                            </div>

                            <motion.div 
                                variants={containerVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: "-100px" }}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
                            >
                                {events.length === 0 ? (
                                    <div className="col-span-full text-center text-gray-500 py-24 bg-[rgba(255,255,255,0.02)] backdrop-blur-xl rounded-3xl border border-white/10 font-medium text-lg">
                                        No upcoming events found. Check back later!
                                    </div>
                                ) : (
                                    events.map(event => (
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
                            
                            {events.length > 0 && (
                                <div className="mt-16 text-center md:hidden">
                                    <Link href={route('events.index')} className="inline-block bg-white/5 border border-white/10 text-white px-8 py-3 rounded-full font-bold hover:bg-white/10 transition-colors">
                                        Show All Events
                                    </Link>
                                </div>
                            )}
                        </div>
                    </section>
                </main>

                <Footer />
            </div>
        </>
    );
}
