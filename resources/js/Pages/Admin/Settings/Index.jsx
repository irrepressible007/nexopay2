import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import RichTextEditor from '@/Components/RichTextEditor';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SettingsIndex({ auth, siteSettings = {} }) {
    // Parse footer links safely
    const initialFooterLinks = siteSettings.footer_links ? 
        (typeof siteSettings.footer_links === 'string' ? JSON.parse(siteSettings.footer_links) : siteSettings.footer_links) 
        : [{ title: '', url: '' }];

    const { data, setData, post, processing, errors } = useForm({
        app_name: siteSettings.app_name || 'Nexopay',
        hero_title: siteSettings.hero_title || '',
        hero_subtitle: siteSettings.hero_subtitle || '',
        hero_image: null,
        navbar_logo: null,
        footer_text: siteSettings.footer_text || '',
        footer_links: initialFooterLinks,
        contact_subtitle: siteSettings.contact_subtitle || 'Secure line to Nexopay Command. Send us your brief, inquiry, or partnership request.',
        contact_address: siteSettings.contact_address || '123 Vice City Blvd, Neon District',
        contact_phone: siteSettings.contact_phone || '+1 (555) 123-4567',
        contact_email: siteSettings.contact_email || 'contact@nexopay.com',
        meta_pixel_id: siteSettings.meta_pixel_id || '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.settings.update'), {
            preserveScroll: true,
            forceFormData: true,
        });
    };

    const addFooterLink = () => {
        setData('footer_links', [...data.footer_links, { title: '', url: '' }]);
    };

    const removeFooterLink = (index) => {
        const newLinks = [...data.footer_links];
        newLinks.splice(index, 1);
        setData('footer_links', newLinks);
    };

    const updateFooterLink = (index, field, value) => {
        const newLinks = [...data.footer_links];
        newLinks[index][field] = value;
        setData('footer_links', newLinks);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-100 leading-tight">Global Site Settings</h2>}
        >
            <Head title="Site Settings" />

            <div className="py-12 relative z-10">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <form onSubmit={submit} className="space-y-8">
                        
                        {/* Hero Section Configuration */}
                        <div className="bg-[#0f172a]/60 backdrop-blur-md overflow-hidden shadow-2xl sm:rounded-3xl border border-white/10 p-8">
                            <h3 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">Hero Section (Landing Page)</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <InputLabel htmlFor="hero_title" value="Hero Title" className="text-gray-300" />
                                    <TextInput
                                        id="hero_title"
                                        type="text"
                                        className="mt-1 block w-full"
                                        value={data.hero_title}
                                        onChange={(e) => setData('hero_title', e.target.value)}
                                    />
                                    <InputError message={errors.hero_title} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="hero_subtitle" value="Hero Subtitle" className="text-gray-300" />
                                    <TextInput
                                        id="hero_subtitle"
                                        type="text"
                                        className="mt-1 block w-full"
                                        value={data.hero_subtitle}
                                        onChange={(e) => setData('hero_subtitle', e.target.value)}
                                    />
                                    <InputError message={errors.hero_subtitle} className="mt-2" />
                                </div>
                                
                                <div className="col-span-full">
                                    <InputLabel htmlFor="hero_image" value="Hero Background Image (Mobile & Desktop friendly)" className="text-gray-300" />
                                    {siteSettings.hero_image && (
                                        <div className="mt-2 mb-4 relative h-40 w-full rounded-xl overflow-hidden border border-white/10">
                                            <img src={siteSettings.hero_image} alt="Hero" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                <span className="text-white font-bold bg-black/50 px-3 py-1 rounded-full">Current Image</span>
                                            </div>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        id="hero_image"
                                        onChange={(e) => setData('hero_image', e.target.files[0])}
                                        className="mt-1 block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500"
                                    />
                                    <p className="text-xs text-gray-500 mt-2">Upload a high-quality background image. It will be darkened automatically so text remains readable.</p>
                                    <InputError message={errors.hero_image} className="mt-2" />
                                </div>
                            </div>
                        </div>

                        {/* Marketing & Tracking Configuration */}
                        <div className="bg-[#0f172a]/60 backdrop-blur-md overflow-hidden shadow-2xl sm:rounded-3xl border border-white/10 p-8">
                            <h3 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">Marketing & Pixel Tracking</h3>
                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <InputLabel htmlFor="meta_pixel_id" value="Meta (Facebook) Pixel ID" className="text-gray-300" />
                                    <TextInput
                                        id="meta_pixel_id"
                                        type="text"
                                        placeholder="e.g. 1234567890123456"
                                        className="mt-1 block w-full font-mono text-sm"
                                        value={data.meta_pixel_id}
                                        onChange={(e) => setData('meta_pixel_id', e.target.value)}
                                    />
                                    <p className="text-xs text-gray-400 mt-2">
                                        Enter your 15-16 digit Meta Pixel ID from Events Manager. Standard <code className="text-indigo-400">PageView</code>, <code className="text-indigo-400">InitiateCheckout</code>, <code className="text-indigo-400">Lead</code>, and <code className="text-indigo-400">CompleteRegistration</code> events will automatically be tracked.
                                    </p>
                                    <InputError message={errors.meta_pixel_id} className="mt-2" />
                                </div>
                            </div>
                        </div>

                        {/* Branding & Navbar */}
                        <div className="bg-[#0f172a]/60 backdrop-blur-md overflow-hidden shadow-2xl sm:rounded-3xl border border-white/10 p-8">
                            <h3 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">Branding & Navbar</h3>
                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <InputLabel htmlFor="app_name" value="Platform Name (e.g. Nexopay)" className="text-gray-300" />
                                    <TextInput
                                        id="app_name"
                                        type="text"
                                        className="mt-1 block w-full"
                                        value={data.app_name}
                                        onChange={(e) => setData('app_name', e.target.value)}
                                    />
                                    <p className="text-xs text-gray-500 mt-2">This replaces the brand name globally (e.g., in the tab title, text logo fallback).</p>
                                </div>
                                <div>
                                    <InputLabel htmlFor="navbar_logo" value="Navbar Logo Image (Optional)" className="text-gray-300" />
                                    {siteSettings.navbar_logo && (
                                        <div className="mt-2 mb-4 bg-white/5 p-4 rounded-xl border border-white/10 inline-block">
                                            <img src={siteSettings.navbar_logo} alt="Logo" className="h-12 object-contain" />
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        id="navbar_logo"
                                        onChange={(e) => setData('navbar_logo', e.target.files[0])}
                                        className="mt-1 block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500"
                                    />
                                    <p className="text-xs text-gray-500 mt-2">If uploaded, this will replace the text-based 'NEXOPAY' logo.</p>
                                    <InputError message={errors.navbar_logo} className="mt-2" />
                                </div>
                            </div>
                        </div>

                        {/* Contact Page Configuration */}
                        <div className="bg-[#0f172a]/60 backdrop-blur-md overflow-hidden shadow-2xl sm:rounded-3xl border border-white/10 p-8">
                            <h3 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">Contact Page Info</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="col-span-full">
                                    <InputLabel htmlFor="contact_subtitle" value="Contact Subtitle / Description" className="text-gray-300" />
                                    <RichTextEditor
                                        value={data.contact_subtitle}
                                        onChange={(content) => setData('contact_subtitle', content)}
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <InputLabel htmlFor="contact_address" value="Headquarters Address" className="text-gray-300" />
                                    <TextInput
                                        id="contact_address"
                                        type="text"
                                        className="mt-1 block w-full"
                                        value={data.contact_address}
                                        onChange={(e) => setData('contact_address', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <InputLabel htmlFor="contact_phone" value="Contact Phone Number" className="text-gray-300" />
                                    <TextInput
                                        id="contact_phone"
                                        type="text"
                                        className="mt-1 block w-full"
                                        value={data.contact_phone}
                                        onChange={(e) => setData('contact_phone', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <InputLabel htmlFor="contact_email" value="Contact Email Address" className="text-gray-300" />
                                    <TextInput
                                        id="contact_email"
                                        type="text"
                                        className="mt-1 block w-full"
                                        value={data.contact_email}
                                        onChange={(e) => setData('contact_email', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Footer Configuration */}
                        <div className="bg-[#0f172a]/60 backdrop-blur-md overflow-hidden shadow-2xl sm:rounded-3xl border border-white/10 p-8">
                            <h3 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">Footer (Multi-Column)</h3>
                            
                            <div className="space-y-6">
                                <div>
                                    <InputLabel htmlFor="footer_text" value="Footer Description / Copyright Text" className="text-gray-300" />
                                    <RichTextEditor
                                        value={data.footer_text}
                                        onChange={(content) => setData('footer_text', content)}
                                        className="mt-1"
                                        placeholder="© 2026 Nexopay. All rights reserved."
                                    />
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <InputLabel value="Dynamic Footer Links (Socials & Nav)" className="text-gray-300" />
                                        <button 
                                            type="button" 
                                            onClick={addFooterLink}
                                            className="text-xs bg-indigo-600/50 hover:bg-indigo-500 text-white px-3 py-1 rounded-full"
                                        >
                                            + Add Link
                                        </button>
                                    </div>
                                    
                                    <div className="space-y-3">
                                        <AnimatePresence>
                                            {data.footer_links.map((link, index) => (
                                                <motion.div 
                                                    key={index}
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10"
                                                >
                                                    <div className="flex-1">
                                                        <TextInput
                                                            type="text"
                                                            placeholder="Link Title (e.g. Facebook)"
                                                            value={link.title}
                                                            onChange={(e) => updateFooterLink(index, 'title', e.target.value)}
                                                            className="w-full text-sm"
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <TextInput
                                                            type="text"
                                                            placeholder="URL (e.g. https://...)"
                                                            value={link.url}
                                                            onChange={(e) => updateFooterLink(index, 'url', e.target.value)}
                                                            className="w-full text-sm"
                                                        />
                                                    </div>
                                                    <button 
                                                        type="button" 
                                                        onClick={() => removeFooterLink(index)}
                                                        className="text-red-400 hover:text-red-300 font-bold px-3 py-2 bg-red-500/10 rounded-xl"
                                                    >
                                                        ✕
                                                    </button>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end">
                            <PrimaryButton className="w-full sm:w-auto" disabled={processing}>
                                Save Global Settings
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
