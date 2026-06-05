import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';

export default function Show({ auth, event }) {
    const { siteSettings = {} } = usePage().props;
    
    // Countdown logic
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const isFuture = event.start_date && new Date(event.start_date) > new Date();

    useEffect(() => {
        if (!isFuture) return;
        const targetDate = new Date(event.start_date).getTime();
        const interval = setInterval(() => {
            const distance = targetDate - new Date().getTime();
            if (distance < 0) {
                clearInterval(interval);
                return;
            }
            setTimeLeft({
                days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((distance % (1000 * 60)) / 1000)
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [event.start_date, isFuture]);

    // Registration State
    const [step, setStep] = useState(1);
    const [selectedRole, setSelectedRole] = useState('Participant');
    const [prices] = useState({
        Participant: event.participant_price,
        'Campus Ambassador': event.ca_price,
        Volunteer: event.volunteer_price
    });
    
    const schema = event.form_schema || [];
    const segments = event.segments || [];
    
    const initialFormData = {};
    schema.forEach(field => {
        initialFormData[field.name] = auth?.user?.profile_data?.[field.name] || '';
    });
    
    const initialSegments = {};
    segments.forEach(seg => {
        initialSegments[seg.id] = seg.is_mandatory ? (seg.pricing_mode === 'global' ? true : (seg.allow_multiple ? [] : '')) : (seg.pricing_mode === 'global' ? false : (seg.allow_multiple ? [] : ''));
    });

    const [selectedSegments, setSelectedSegments] = useState(initialSegments);
    const [totalPrice, setTotalPrice] = useState(0);

    const { data, setData, post, processing, errors } = useForm({
        event_id: event.id,
        role: selectedRole,
        bkash_txid: '',
        form_data: initialFormData,
        selected_segments: selectedSegments,
        payable_amount: 0,
        guest_name: auth?.user ? auth.user.name : '',
        guest_email: auth?.user ? auth.user.email : '',
    });

    useEffect(() => {
        let total = 0;
        if (event.has_base_price) total += Number(prices[selectedRole] || 0);
        
        segments.forEach(seg => {
            const selection = selectedSegments[seg.id];
            if (!selection) return;
            if (seg.pricing_mode === 'global' && selection === true) {
                total += Number(seg.global_price || 0);
            } else if (seg.pricing_mode !== 'global') {
                const subIds = Array.isArray(selection) ? selection : [selection];
                subIds.forEach(subId => {
                    const sub = seg.sub_segments.find(s => s.id === subId);
                    if (sub) total += Number(sub.price || 0);
                });
            }
        });
        setTotalPrice(total);
        setData(d => ({ ...d, payable_amount: total, selected_segments: selectedSegments, role: selectedRole }));
    }, [selectedRole, selectedSegments, event.has_base_price, prices, segments]);

    const handleSegmentToggle = (segId, value, isMultiple) => {
        if (isMultiple) {
            const current = selectedSegments[segId] || [];
            setSelectedSegments({
                ...selectedSegments,
                [segId]: current.includes(value) ? current.filter(v => v !== value) : [...current, value]
            });
        } else {
            setSelectedSegments({ ...selectedSegments, [segId]: value });
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('event.register', event.slug));
    };

    const isGuest = !auth?.user;
    const canRegister = !event.require_login || auth?.user;

    return (
        <>
            <Head title={`${event.title} - ${siteSettings.app_name || 'Nexopay'} Events`} />
            <style>{`
                @keyframes slowPan {
                    0% { transform: scale(1) translate(0, 0); }
                    100% { transform: scale(1.05) translate(-1%, -1%); }
                }
                .hero-pan { animation: slowPan 25s ease-in-out infinite alternate; }
            `}</style>

            <div className="min-h-screen bg-[#0a0a0a] text-gray-100 font-sans selection:bg-indigo-500 selection:text-white pb-32">
                
                {/* Navbar */}
                <nav className="absolute top-0 w-full z-50 p-6 flex justify-between items-center bg-gradient-to-b from-black/90 to-transparent">
                    <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
                        <Link href={route('home')} className="text-white hover:text-indigo-300 font-bold flex items-center gap-2 transition bg-white/10 px-5 py-2.5 rounded-full backdrop-blur-md border border-white/5 shadow-lg">
                            ← Back to Events
                        </Link>
                        {!auth?.user && (
                            <Link href={route('login')} className="text-sm font-bold text-white bg-indigo-600 px-5 py-2.5 rounded-full hover:bg-indigo-500 transition shadow-[0_0_15px_rgba(79,70,229,0.4)]">
                                Sign In
                            </Link>
                        )}
                    </div>
                </nav>

                {/* Hero Section */}
                <section className="relative h-[65vh] w-full overflow-hidden flex flex-col justify-end">
                    <div className="absolute inset-0 z-0">
                        {event.cover_image ? (
                            <img src={event.cover_image} alt={event.title} className="w-full h-full object-cover hero-pan" />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-indigo-950 to-purple-900 hero-pan" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />
                    </div>

                    <div className="relative z-10 max-w-7xl mx-auto w-full px-6 pb-12">
                        <div className="flex flex-col md:flex-row justify-between items-end gap-8">
                            <div className="max-w-3xl">
                                <motion.div 
                                    initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }}
                                    className="flex items-center gap-3 mb-4"
                                >
                                    <span className="bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full">
                                        {event.status}
                                    </span>
                                    {event.start_date && (
                                        <span className="text-gray-400 font-medium text-sm">
                                            {new Date(event.start_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                        </span>
                                    )}
                                </motion.div>
                                <motion.h1 
                                    initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.1 }}
                                    className="text-4xl md:text-6xl font-black tracking-tight text-white leading-tight"
                                >
                                    {event.title}
                                </motion.h1>
                            </div>
                            
                            {isFuture && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }}
                                    className="flex gap-4 backdrop-blur-xl bg-white/5 border border-white/10 p-4 rounded-3xl shadow-2xl"
                                >
                                    {Object.entries(timeLeft).map(([unit, value]) => (
                                        <div key={unit} className="flex flex-col items-center justify-center min-w-[65px]">
                                            <span className="text-2xl font-black text-white">{value.toString().padStart(2, '0')}</span>
                                            <span className="text-[9px] uppercase tracking-widest text-gray-400 mt-1">{unit}</span>
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </div>
                    </div>
                </section>

                <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-12">
                    {/* Left Column - Content & Form */}
                    <div className="lg:w-2/3 space-y-16">
                        
                        {/* Description */}
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                <span className="w-8 h-1 bg-indigo-500 rounded-full inline-block"></span>
                                About The Event
                            </h2>
                            <div className="prose prose-invert prose-lg max-w-none text-gray-300 leading-relaxed space-y-4" dangerouslySetInnerHTML={{ __html: event.description || '' }} />
                        </section>

                        {/* Registration Flow */}
                        <section id="register" className="bg-[#111111] border border-gray-800 p-8 md:p-10 rounded-[2rem] shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
                            
                            <h2 className="text-3xl font-black text-white mb-2">Secure Your Spot</h2>
                            <p className="text-gray-400 mb-8">Complete the steps below to register for {event.title}.</p>

                            {!canRegister ? (
                                <div className="text-center py-12 bg-white/5 rounded-3xl border border-white/10">
                                    <div className="w-16 h-16 bg-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-indigo-500/30">
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">Login Required</h3>
                                    <p className="text-gray-400 mb-8 max-w-md mx-auto">This exclusive event requires a verified Nexopay account to register. Please sign in or create an account to continue.</p>
                                    <Link href={route('login')} className="inline-block bg-indigo-600 text-white px-8 py-3.5 rounded-full font-bold shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:bg-indigo-500 transition-all hover:scale-105">
                                        Sign In to Register
                                    </Link>
                                </div>
                            ) : (
                                <form onSubmit={submit}>
                                    
                                    {isGuest && step === 1 && (
                                        <div className="mb-8 p-5 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
                                            <div className="flex gap-3">
                                                <svg className="w-6 h-6 text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                <div>
                                                    <h4 className="text-amber-500 font-bold mb-1">Guest Checkout Active</h4>
                                                    <p className="text-amber-400/80 text-sm">You are checking out as a guest. You will not have a dashboard to view your registration later. A confirmation email with your ticket will be sent directly to your inbox upon approval.</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <AnimatePresence mode="wait">
                                        {/* STEP 1: Details */}
                                        {step === 1 && (
                                            <motion.div key="step1" initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-20}}>
                                                
                                                {isGuest && (
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                                        <div>
                                                            <InputLabel value="Full Name *" className="text-gray-300" />
                                                            <TextInput
                                                                type="text"
                                                                value={data.guest_name}
                                                                onChange={e => setData('guest_name', e.target.value)}
                                                                required
                                                                className="mt-2 block w-full bg-black/50 border-gray-700 text-white rounded-xl focus:border-indigo-500"
                                                                placeholder="John Doe"
                                                            />
                                                            <InputError message={errors.guest_name} className="mt-2" />
                                                        </div>
                                                        <div>
                                                            <InputLabel value="Email Address *" className="text-gray-300" />
                                                            <TextInput
                                                                type="email"
                                                                value={data.guest_email}
                                                                onChange={e => setData('guest_email', e.target.value)}
                                                                required
                                                                className="mt-2 block w-full bg-black/50 border-gray-700 text-white rounded-xl focus:border-indigo-500"
                                                                placeholder="john@example.com"
                                                            />
                                                            <InputError message={errors.guest_email} className="mt-2" />
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="mb-8">
                                                    <InputLabel value="Select your Role *" className="text-gray-300 mb-3" />
                                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                        {Object.keys(prices).map(role => (
                                                            <button
                                                                type="button"
                                                                key={role}
                                                                onClick={() => setSelectedRole(role)}
                                                                className={`p-5 rounded-2xl border-2 transition-all text-left bg-black/40 ${
                                                                    selectedRole === role 
                                                                    ? 'border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.2)] bg-indigo-500/10' 
                                                                    : 'border-gray-800 hover:border-gray-600 text-gray-400 hover:text-gray-200'
                                                                }`}
                                                            >
                                                                <div className="font-bold text-lg">{role}</div>
                                                                {event.has_base_price && (
                                                                    <div className={`font-black mt-2 text-xl ${selectedRole === role ? 'text-indigo-400' : 'text-gray-500'}`}>৳{prices[role]}</div>
                                                                )}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                {schema.length > 0 && (
                                                    <div className="grid grid-cols-1 gap-6 mb-8">
                                                        {schema.map(field => (
                                                            <div key={field.name}>
                                                                <InputLabel value={field.label + (field.required ? ' *' : '')} className="text-gray-300" />
                                                                {field.type === 'textarea' ? (
                                                                    <textarea
                                                                        value={data.form_data[field.name] || ''}
                                                                        onChange={e => setData('form_data', { ...data.form_data, [field.name]: e.target.value })}
                                                                        required={field.required}
                                                                        className="mt-2 block w-full bg-black/50 border-gray-700 text-white focus:border-indigo-500 rounded-xl shadow-sm transition"
                                                                        rows="3"
                                                                    />
                                                                ) : (
                                                                    <TextInput
                                                                        type={field.type}
                                                                        value={data.form_data[field.name] || ''}
                                                                        onChange={e => setData('form_data', { ...data.form_data, [field.name]: e.target.value })}
                                                                        required={field.required}
                                                                        className="mt-2 block w-full bg-black/50 border-gray-700 text-white rounded-xl transition"
                                                                    />
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                <div className="flex justify-end pt-6 border-t border-gray-800">
                                                    <button type="button" onClick={() => setStep(2)} className="bg-indigo-600 text-white px-8 py-3.5 rounded-full font-bold hover:bg-indigo-500 transition shadow-[0_0_15px_rgba(99,102,241,0.4)] flex items-center gap-2">
                                                        Continue to Segments
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}

                                        {/* STEP 2: Segments */}
                                        {step === 2 && (
                                            <motion.div key="step2" initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-20}}>
                                                {segments.length === 0 ? (
                                                    <div className="text-center py-12 text-gray-400">No additional segments for this event. You can proceed to payment.</div>
                                                ) : (
                                                    <div className="space-y-6 mb-8">
                                                        {segments.map(seg => (
                                                            <div key={seg.id} className="bg-black/40 p-6 rounded-2xl border border-gray-800 relative overflow-hidden">
                                                                {seg.is_mandatory && <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-black uppercase px-3 py-1 rounded-bl-lg">Required</div>}
                                                                
                                                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-5">
                                                                    <h3 className="text-xl font-bold text-white">{seg.title}</h3>
                                                                    {seg.pricing_mode === 'global' && <div className="font-black text-indigo-400 text-xl bg-indigo-500/10 px-4 py-1.5 rounded-lg border border-indigo-500/20">৳{seg.global_price}</div>}
                                                                </div>

                                                                {seg.pricing_mode === 'global' ? (
                                                                    <label className="flex items-center space-x-4 cursor-pointer p-5 border border-gray-700 rounded-xl hover:bg-gray-800/50 transition">
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={selectedSegments[seg.id] === true}
                                                                            disabled={seg.is_mandatory}
                                                                            onChange={(e) => handleSegmentToggle(seg.id, e.target.checked, false)}
                                                                            className="rounded bg-black border-gray-600 text-indigo-500 focus:ring-indigo-500 w-6 h-6"
                                                                        />
                                                                        <span className="font-medium text-gray-200">Yes, I want to participate in {seg.title}</span>
                                                                    </label>
                                                                ) : (
                                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                                        {seg.sub_segments.map(sub => {
                                                                            const isChecked = seg.allow_multiple 
                                                                                ? (selectedSegments[seg.id] || []).includes(sub.id)
                                                                                : selectedSegments[seg.id] === sub.id;

                                                                            return (
                                                                                <label key={sub.id} className={`flex items-center justify-between p-5 border rounded-xl cursor-pointer transition ${isChecked ? 'border-indigo-500 bg-indigo-500/10 shadow-[0_0_15px_rgba(99,102,241,0.15)]' : 'border-gray-700 bg-black/50 hover:border-gray-500'}`}>
                                                                                    <div className="flex items-center space-x-3">
                                                                                        <input
                                                                                            type={seg.allow_multiple ? "checkbox" : "radio"}
                                                                                            name={`seg_${seg.id}`}
                                                                                            checked={isChecked}
                                                                                            onChange={() => handleSegmentToggle(seg.id, sub.id, seg.allow_multiple)}
                                                                                            className={`${seg.allow_multiple ? 'rounded' : 'rounded-full'} border-gray-600 bg-black text-indigo-500 focus:ring-indigo-500 w-5 h-5`}
                                                                                        />
                                                                                        <span className="font-semibold text-gray-200">{sub.title}</span>
                                                                                    </div>
                                                                                    <span className="font-black text-indigo-400">৳{sub.price}</span>
                                                                                </label>
                                                                            )
                                                                        })}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                <div className="flex justify-between pt-6 border-t border-gray-800">
                                                    <button type="button" onClick={() => setStep(1)} className="text-gray-400 hover:text-white font-bold px-4 py-2">
                                                        ← Back
                                                    </button>
                                                    <button type="button" onClick={() => setStep(3)} className="bg-indigo-600 text-white px-8 py-3.5 rounded-full font-bold hover:bg-indigo-500 transition shadow-[0_0_15px_rgba(99,102,241,0.4)]">
                                                        Proceed to Payment →
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}

                                        {/* STEP 3: Payment */}
                                        {step === 3 && (
                                            <motion.div key="step3" initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-20}}>
                                                
                                                <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 p-8 rounded-3xl border border-indigo-500/30 mb-8 shadow-2xl relative overflow-hidden">
                                                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-3xl rounded-full" />
                                                    <h3 className="text-2xl font-black text-white mb-6 relative z-10">Payment Instructions</h3>
                                                    
                                                    <div className="space-y-4 relative z-10">
                                                        <div className="flex gap-4">
                                                            <div className="w-8 h-8 rounded-full bg-indigo-500 text-white font-bold flex items-center justify-center flex-shrink-0">1</div>
                                                            <p className="text-indigo-100 text-lg pt-0.5">Send exactly <strong className="text-white text-xl bg-black/30 px-2 py-0.5 rounded">৳{totalPrice}</strong> to our bKash Merchant Number: <strong className="text-white bg-black/30 px-2 py-0.5 rounded tracking-widest">017XX-XXXXXX</strong></p>
                                                        </div>
                                                        <div className="flex gap-4">
                                                            <div className="w-8 h-8 rounded-full bg-indigo-500 text-white font-bold flex items-center justify-center flex-shrink-0">2</div>
                                                            <p className="text-indigo-100 text-lg pt-0.5">Enter the exact bKash Transaction ID (TrxID) below to verify your payment.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div className="mb-10">
                                                    <InputLabel value="bKash Transaction ID *" className="text-gray-300 mb-2" />
                                                    <TextInput
                                                        name="bkash_txid"
                                                        value={data.bkash_txid}
                                                        onChange={e => setData('bkash_txid', e.target.value)}
                                                        required
                                                        className="mt-1 block w-full text-xl p-4 uppercase font-mono tracking-widest bg-black/50 border-gray-700 text-white rounded-xl text-center focus:border-indigo-500 placeholder-gray-700"
                                                        placeholder="8JDX92L"
                                                    />
                                                    <InputError message={errors.bkash_txid} className="mt-2 text-center" />
                                                </div>

                                                <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-6 pt-8 border-t border-gray-800">
                                                    <button type="button" onClick={() => setStep(segments.length ? 2 : 1)} className="text-gray-400 hover:text-white font-bold">
                                                        ← Back to Segments
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        disabled={processing}
                                                        className="w-full sm:w-auto bg-white text-black px-10 py-4 rounded-full font-black text-xl hover:bg-gray-200 hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,255,255,0.3)] disabled:opacity-50 disabled:hover:scale-100"
                                                    >
                                                        {processing ? 'Processing...' : `Confirm Payment of ৳${totalPrice}`}
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </form>
                            )}
                        </section>
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="lg:w-1/3">
                        <div className="sticky top-24 bg-[#111111] border border-gray-800 rounded-3xl p-8 shadow-2xl">
                            <h3 className="text-2xl font-black text-white mb-6">Event Summary</h3>
                            
                            <div className="space-y-6">
                                <div className="flex gap-4 items-start">
                                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 text-gray-400">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium">Date & Time</p>
                                        <p className="text-white font-bold">{event.start_date ? new Date(event.start_date).toLocaleString() : 'TBA'}</p>
                                    </div>
                                </div>
                                
                                <div className="flex gap-4 items-start">
                                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 text-gray-400">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium">Capacity</p>
                                        <p className="text-white font-bold">{event.capacity ? `${event.capacity} Attendees` : 'Unlimited'}</p>
                                    </div>
                                </div>
                                
                                <div className="flex gap-4 items-start">
                                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 text-gray-400">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path></svg>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium">Pricing Status</p>
                                        <p className="text-white font-bold">{event.has_base_price ? 'Paid Tickets' : 'Free Registration'}</p>
                                    </div>
                                </div>
                            </div>

                            <a href="#register" className="mt-10 flex justify-center items-center w-full bg-white/10 text-white border border-white/20 px-6 py-4 rounded-xl font-bold hover:bg-white/20 transition-colors">
                                Jump to Checkout
                            </a>
                        </div>
                    </div>
                </div>

                {/* Event Gallery */}
                {event.gallery_images && event.gallery_images.length > 0 && (
                    <section className="max-w-7xl mx-auto px-6 py-16 border-t border-white/5 mt-8">
                        <h2 className="text-3xl font-black text-white mb-10 text-center">Moments From The Past</h2>
                        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                            {event.gallery_images.map((img, idx) => (
                                <motion.div 
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }}
                                    className="break-inside-avoid rounded-3xl overflow-hidden relative group cursor-pointer"
                                >
                                    <img src={img} alt="Gallery" className="w-full h-auto filter grayscale opacity-70 transition-all duration-700 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105" />
                                    <div className="absolute inset-0 border border-white/10 rounded-3xl pointer-events-none group-hover:border-indigo-500/50 transition-colors duration-500" />
                                </motion.div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </>
    );
}
