import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function Dashboard({ auth, registrations }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">My Events & Progress</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
                    {/* Welcome Banner */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-indigo-600 rounded-3xl p-8 md:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between"
                    >
                        <div>
                            <h3 className="text-3xl font-black mb-2">Welcome back, {auth.user.name}!</h3>
                            <p className="text-indigo-200 text-lg">
                                {auth.user.global_role === 'Admin' || auth.user.global_role === 'Finance' 
                                    ? "You have administrative access. Switch to the Admin Dashboard to manage the platform."
                                    : "Track your registrations, positions, and prizes below."}
                            </p>
                        </div>
                        {(auth.user.global_role === 'Admin' || auth.user.global_role === 'Finance') && (
                            <Link href={route('admin.dashboard')} className="mt-6 md:mt-0 bg-white text-indigo-600 px-6 py-3 rounded-full font-bold shadow-lg hover:bg-gray-100 transition">
                                Go to Admin Hub
                            </Link>
                        )}
                    </motion.div>

                    {/* Registrations List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                        {registrations.length === 0 ? (
                            <div className="col-span-full text-center py-12 text-gray-400 bg-white/5 backdrop-blur-md rounded-2xl shadow-xl border border-white/10">
                                You haven't registered for any events yet. <Link href={route('home')} className="text-indigo-400 font-bold underline">Discover Events</Link>
                            </div>
                        ) : (
                            registrations.map((reg, index) => (
                                <motion.div 
                                    key={reg.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-[#0f172a]/60 backdrop-blur-md rounded-3xl shadow-2xl border border-white/10 overflow-hidden flex flex-col hover:border-indigo-500/30 transition-colors"
                                >
                                    <div className="p-6 border-b border-white/10">
                                        <div className="flex justify-between items-start mb-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                                reg.status === 'approved' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                                                reg.status === 'rejected' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                                                'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                            }`}>
                                                {reg.status}
                                            </span>
                                            <span className="text-sm font-semibold text-indigo-400">{reg.role.name}</span>
                                        </div>
                                        <h4 className="text-xl font-bold mb-2 text-white line-clamp-2">{reg.event.title}</h4>
                                        <p className="text-sm text-gray-400 mb-2">
                                            TxID: <span className="font-mono uppercase text-indigo-300 mr-4">{reg.bkash_txid}</span>
                                            {reg.sender_number && (
                                                <span>Sent From: <span className="font-mono text-indigo-300">{reg.sender_number}</span></span>
                                            )}
                                        </p>
                                    </div>
                                    
                                    <div className="p-6 bg-white/5 backdrop-blur-sm flex-1 flex flex-col gap-4">
                                        <div>
                                            <div className="text-xs text-gray-500 uppercase font-semibold mb-1">Progress Status</div>
                                            <div className="font-medium text-gray-200">{reg.progress_status || 'Pending Updates...'}</div>
                                        </div>
                                        {reg.position && (
                                            <div>
                                                <div className="text-xs text-gray-500 uppercase font-semibold mb-1">Position</div>
                                                <div className="font-bold text-indigo-400">{reg.position}</div>
                                            </div>
                                        )}
                                        {reg.prize_won && (
                                            <div className="mt-auto pt-4 border-t border-white/10">
                                                <div className="text-xs text-gray-500 uppercase font-semibold mb-1">🏆 Prize Won</div>
                                                <div className="font-bold text-yellow-400">{reg.prize_won}</div>
                                            </div>
                                        )}
                                        {reg.status === 'approved' && (
                                            <div className="mt-4 pt-4 border-t border-white/10">
                                                <Link
                                                    href={route('registration.id-card', reg.id)}
                                                    className="block w-full text-center bg-indigo-600/80 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl font-bold shadow-[0_0_15px_rgba(79,70,229,0.3)] transition"
                                                >
                                                    🎟️ View ID Card
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
