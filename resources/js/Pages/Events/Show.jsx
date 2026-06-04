import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';

export default function Show({ auth, event }) {
    // Basic countdown logic
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const isFuture = event.start_date && new Date(event.start_date) > new Date();

    useEffect(() => {
        if (!isFuture) return;
        
        const targetDate = new Date(event.start_date).getTime();
        
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = targetDate - now;
            
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


    // Checkout state (Legacy)
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
        if (seg.is_mandatory) {
            initialSegments[seg.id] = seg.pricing_mode === 'global' ? true : (seg.allow_multiple ? [] : '');
        } else {
            initialSegments[seg.id] = seg.pricing_mode === 'global' ? false : (seg.allow_multiple ? [] : '');
        }
    });

    const [selectedSegments, setSelectedSegments] = useState(initialSegments);
    const [totalPrice, setTotalPrice] = useState(0);

    const { data, setData, post, processing, errors } = useForm({
        event_id: event.id,
        role: selectedRole,
        bkash_txid: '',
        form_data: initialFormData,
        selected_segments: selectedSegments,
        payable_amount: 0
    });

    useEffect(() => {
        let total = 0;
        if (event.has_base_price) total += Number(prices[selectedRole] || 0);
        
        segments.forEach(seg => {
            const selection = selectedSegments[seg.id];
            if (!selection) return;
            if (seg.pricing_mode === 'global') {
                if (selection === true) total += Number(seg.global_price || 0);
            } else {
                if (Array.isArray(selection)) {
                    selection.forEach(subId => {
                        const sub = seg.sub_segments.find(s => s.id === subId);
                        if (sub) total += Number(sub.price || 0);
                    });
                } else {
                    const sub = seg.sub_segments.find(s => s.id === selection);
                    if (sub) total += Number(sub.price || 0);
                }
            }
        });
        setTotalPrice(total);
        setData('payable_amount', total);
        setData('selected_segments', selectedSegments);
    }, [selectedRole, selectedSegments, event.has_base_price]);

    useEffect(() => { setData('role', selectedRole); }, [selectedRole]);

    const handleFieldChange = (name, value) => {
        setData('form_data', { ...data.form_data, [name]: value });
    };

    const handleSegmentToggle = (segId, value, isMultiple) => {
        if (isMultiple) {
            const current = selectedSegments[segId] || [];
            if (current.includes(value)) {
                setSelectedSegments({ ...selectedSegments, [segId]: current.filter(v => v !== value) });
            } else {
                setSelectedSegments({ ...selectedSegments, [segId]: [...current, value] });
            }
        } else {
            setSelectedSegments({ ...selectedSegments, [segId]: value });
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('event.register', event.slug));
    };

    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);

    return (
        <>
            <Head title={`${event.title} - ${siteSettings.app_name || 'Nexopay'} Events`} />
            <style>{`
                @keyframes kenburns {
                    0% { transform: scale(1); }
                    100% { transform: scale(1.1); }
                }
                .animate-kenburns {
                    animation: kenburns 30s ease-in-out infinite alternate;
                }
            `}</style>

            <div className="min-h-screen bg-[#030712] text-gray-100 font-sans selection:bg-indigo-500 selection:text-white pb-32">
                
                {/* Navbar Overlay */}
                <nav className="absolute top-0 w-full z-50 p-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
                    <div className="max-w-7xl mx-auto w-full flex justify-between">
                        <Link href={route('home')} className="text-white hover:text-indigo-300 font-bold flex items-center gap-2 transition bg-white/10 px-4 py-2 rounded-full backdrop-blur-md">
                            ← Back
                        </Link>
                    </div>
                </nav>

                {/* Cinematic Ken Burns Hero */}
                <section className="relative h-[75vh] w-full overflow-hidden flex flex-col justify-end">
                    <div className="absolute inset-0 z-0">
                        {event.cover_image ? (
                            <img src={event.cover_image} alt={event.title} className="w-full h-full object-cover animate-kenburns" />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-indigo-900 to-purple-900 animate-kenburns" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/60 to-transparent" />
                        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')]" />
                    </div>

                    <div className="relative z-10 max-w-7xl mx-auto w-full px-6 pb-16">
                        <div className="flex flex-col md:flex-row justify-between items-end gap-8">
                            <div className="max-w-3xl">
                                <motion.div 
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 0.8 }}
                                    className="flex items-center gap-3 mb-4"
                                >
                                    <span className="bg-indigo-600 px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full text-white">
                                        {event.status}
                                    </span>
                                    {event.start_date && (
                                        <span className="text-gray-300 font-medium">
                                            {new Date(event.start_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                        </span>
                                    )}
                                </motion.div>
                                <motion.h1 
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 0.8, delay: 0.2 }}
                                    className="text-5xl md:text-7xl font-black tracking-tighter text-white leading-tight"
                                >
                                    {event.title}
                                </motion.h1>
                            </div>
                            
                            {/* Countdown Timer */}
                            {isFuture && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.8, delay: 0.4 }}
                                    className="flex gap-4 backdrop-blur-md bg-white/5 border border-white/10 p-4 rounded-3xl"
                                >
                                    {Object.entries(timeLeft).map(([unit, value]) => (
                                        <div key={unit} className="flex flex-col items-center justify-center min-w-[70px]">
                                            <span className="text-3xl font-black text-white">{value.toString().padStart(2, '0')}</span>
                                            <span className="text-[10px] uppercase tracking-widest text-gray-400">{unit}</span>
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </div>
                    </div>
                </section>

                <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-12">
                    
                    {/* Left Column (66%) */}
                    <div className="lg:w-2/3 space-y-12">
                        {/* Description */}
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">About The Event</h2>
                            <div className="text-gray-300 leading-relaxed space-y-4 text-lg" dangerouslySetInnerHTML={{ __html: (event.description || '').replace(/\\n/g, '<br/>') }} />
                            {!event.description && <p className="text-gray-500 italic">No description provided for this event.</p>}
                        </section>

                        {/* Internal Registration Form (Legacy preservation) */}
                        <section className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl mt-12">
                            <h2 className="text-2xl font-bold text-white mb-6">Internal Checkout</h2>
                            {!auth?.user ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-400 mb-6">You must be logged in to register via the internal flow.</p>
                                    <Link href={route('login')} className="bg-white text-black px-8 py-3 rounded-full font-bold shadow-lg hover:bg-gray-200 transition">
                                        Log in to Register
                                    </Link>
                                </div>
                            ) : (
                                <form onSubmit={submit}>
                                    {/* STEP 1: Participant Details */}
                                    {step === 1 && (
                                        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                                            <div className="mb-8">
                                                <InputLabel value="Select your Role" className="text-gray-300" />
                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                                                    {Object.keys(prices).map(role => (
                                                        <button
                                                            type="button"
                                                            key={role}
                                                            onClick={() => setSelectedRole(role)}
                                                            className={`p-4 rounded-xl border-2 transition-all text-left bg-black/20 ${
                                                                selectedRole === role 
                                                                ? 'border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.3)]' 
                                                                : 'border-white/10 hover:border-white/30 text-gray-400 hover:text-white'
                                                            }`}
                                                        >
                                                            <div className="font-bold">{role}</div>
                                                            {event.has_base_price && (
                                                                <div className={`font-black mt-1 ${selectedRole === role ? 'text-indigo-400' : 'text-gray-500'}`}>৳{prices[role]}</div>
                                                            )}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {schema.length > 0 && (
                                                <div className="grid grid-cols-1 gap-6">
                                                    {schema.map(field => (
                                                        <div key={field.name}>
                                                            <InputLabel htmlFor={field.name} value={field.label + (field.required ? ' *' : '')} className="text-gray-300" />
                                                            {field.type === 'textarea' ? (
                                                                <textarea
                                                                    id={field.name}
                                                                    value={data.form_data[field.name] || ''}
                                                                    onChange={e => handleFieldChange(field.name, e.target.value)}
                                                                    required={field.required}
                                                                    className="mt-1 block w-full bg-white/5 border-white/10 text-white focus:border-indigo-500 rounded-xl shadow-sm"
                                                                    rows="3"
                                                                />
                                                            ) : (
                                                                <TextInput
                                                                    id={field.name}
                                                                    type={field.type}
                                                                    value={data.form_data[field.name] || ''}
                                                                    onChange={e => handleFieldChange(field.name, e.target.value)}
                                                                    required={field.required}
                                                                    className="mt-1 block w-full bg-white/5 border-white/10 text-white rounded-xl"
                                                                />
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            <div className="mt-8 flex justify-end">
                                                <button type="button" onClick={nextStep} className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-500 transition shadow-[0_0_15px_rgba(99,102,241,0.4)]">
                                                    Next Step →
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* STEP 2: Event Details (Segments) */}
                                    {step === 2 && segments.length > 0 && (
                                        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                                            <div className="space-y-6">
                                                {segments.map(seg => (
                                                    <div key={seg.id} className="bg-black/30 p-6 rounded-2xl border border-white/10">
                                                        <div className="flex justify-between items-center mb-4">
                                                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                                                {seg.title}
                                                                {seg.is_mandatory && <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-full uppercase">Required</span>}
                                                            </h3>
                                                            {seg.pricing_mode === 'global' && (
                                                                <div className="font-bold text-indigo-400">৳{seg.global_price}</div>
                                                            )}
                                                        </div>

                                                        {seg.pricing_mode === 'global' ? (
                                                            <label className="flex items-center space-x-3 cursor-pointer p-4 border border-white/10 rounded-xl hover:bg-white/5 transition bg-black/20">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={selectedSegments[seg.id] === true}
                                                                    disabled={seg.is_mandatory}
                                                                    onChange={(e) => handleSegmentToggle(seg.id, e.target.checked, false)}
                                                                    className="rounded border-white/20 bg-black/50 text-indigo-500 focus:ring-indigo-500 w-5 h-5"
                                                                />
                                                                <span className="font-medium text-gray-300">Participate in {seg.title}</span>
                                                            </label>
                                                        ) : (
                                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                                {seg.sub_segments.map(sub => {
                                                                    const isChecked = seg.allow_multiple 
                                                                        ? (selectedSegments[seg.id] || []).includes(sub.id)
                                                                        : selectedSegments[seg.id] === sub.id;

                                                                    return (
                                                                        <label key={sub.id} className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition ${isChecked ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/10 bg-black/20 hover:border-white/30'}`}>
                                                                            <div className="flex items-center space-x-3">
                                                                                <input
                                                                                    type={seg.allow_multiple ? "checkbox" : "radio"}
                                                                                    name={`seg_${seg.id}`}
                                                                                    checked={isChecked}
                                                                                    onChange={(e) => handleSegmentToggle(seg.id, sub.id, seg.allow_multiple)}
                                                                                    className={`${seg.allow_multiple ? 'rounded' : ''} border-white/20 bg-black/50 text-indigo-500 focus:ring-indigo-500 w-5 h-5`}
                                                                                />
                                                                                <span className="font-medium text-gray-300">{sub.title}</span>
                                                                            </div>
                                                                            <span className="font-bold text-indigo-400">৳{sub.price}</span>
                                                                        </label>
                                                                    )
                                                                })}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="mt-8 flex justify-between">
                                                <button type="button" onClick={prevStep} className="text-gray-400 hover:text-white font-bold">
                                                    ← Back
                                                </button>
                                                <button type="button" onClick={nextStep} className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-500 transition shadow-[0_0_15px_rgba(99,102,241,0.4)]">
                                                    Proceed to Payment →
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* STEP 3: Checkout */}
                                    {(step === 3 || (step === 2 && segments.length === 0)) && (
                                        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                                            <div className="bg-indigo-500/10 p-6 rounded-2xl border border-indigo-500/30 text-indigo-200 mb-8">
                                                <p className="mb-2">1. Send <strong className="text-white">৳{totalPrice}</strong> to our bKash Merchant Number: <strong className="text-white">017XX-XXXXXX</strong></p>
                                                <p>2. Enter your bKash Transaction ID below to join the verification queue.</p>
                                            </div>
                                            
                                            <div className="mb-8">
                                                <InputLabel htmlFor="bkash_txid" value="bKash Transaction ID *" className="text-gray-300" />
                                                <TextInput
                                                    id="bkash_txid"
                                                    name="bkash_txid"
                                                    value={data.bkash_txid}
                                                    onChange={e => setData('bkash_txid', e.target.value)}
                                                    required
                                                    className="mt-1 block w-full text-lg uppercase font-mono bg-white/5 border-white/10 text-white rounded-xl"
                                                    placeholder="e.g. 8JDX92L"
                                                />
                                                <InputError message={errors.bkash_txid} className="mt-2" />
                                            </div>

                                            <div className="flex justify-between items-center pt-6 border-t border-white/10">
                                                <button type="button" onClick={prevStep} className="text-gray-400 hover:text-white font-bold">
                                                    ← Back
                                                </button>
                                                <button
                                                    type="submit"
                                                    disabled={processing}
                                                    className="bg-white text-black px-8 py-3 rounded-full font-black text-lg hover:bg-gray-200 transition shadow-[0_0_20px_rgba(255,255,255,0.3)] disabled:opacity-50"
                                                >
                                                    {processing ? 'Processing...' : `Confirm ৳${totalPrice}`}
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </form>
                            )}
                        </section>
                    </div>

                    {/* Right Column (33%) - Sticky Sidebar */}
                    <div className="lg:w-1/3">
                        <div className="sticky top-24 bg-[rgba(255,255,255,0.03)] backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                            <h3 className="text-2xl font-black text-white mb-2">Join The Experience</h3>
                            <p className="text-gray-400 text-sm mb-8">Select your preferred way to participate in this event.</p>
                            
                            <div className="space-y-4">
                                {/* Placeholder buttons based on specs */}
                                <a href="#" className="flex justify-center items-center w-full bg-white text-black px-6 py-4 rounded-xl font-bold hover:scale-[1.02] transition-transform shadow-[0_0_20px_rgba(255,255,255,0.15)]">
                                    Register Now
                                </a>
                                <a href="#" className="flex justify-center items-center w-full bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 px-6 py-4 rounded-xl font-bold hover:bg-indigo-600/30 transition-colors">
                                    Become an Ambassador
                                </a>
                                <a href="#" className="flex justify-center items-center w-full bg-white/5 text-gray-300 border border-white/10 px-6 py-4 rounded-xl font-bold hover:bg-white/10 transition-colors">
                                    Volunteer
                                </a>
                            </div>

                            <div className="mt-8 pt-8 border-t border-white/10 flex flex-col gap-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-400">Date</span>
                                    <span className="text-white font-semibold">
                                        {event.start_date ? new Date(event.start_date).toLocaleDateString() : 'TBA'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-400">Capacity</span>
                                    <span className="text-white font-semibold">{event.capacity ? `${event.capacity} People` : 'Unlimited'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Event Gallery (Masonry) */}
                {event.gallery_images && event.gallery_images.length > 0 && (
                    <section className="max-w-7xl mx-auto px-6 py-12">
                        <h2 className="text-3xl font-black text-white mb-10 text-center">Event Gallery</h2>
                        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                            {event.gallery_images.map((img, idx) => (
                                <motion.div 
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="break-inside-avoid rounded-2xl overflow-hidden relative group cursor-pointer"
                                >
                                    <img 
                                        src={img} 
                                        alt="Gallery Item" 
                                        className="w-full h-auto filter grayscale opacity-80 transition-all duration-500 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105" 
                                    />
                                    <div className="absolute inset-0 border border-white/10 rounded-2xl pointer-events-none group-hover:border-indigo-500/50 transition-colors" />
                                </motion.div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </>
    );
}
