import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Mail, Phone, MapPin, Globe } from "lucide-react";
import { FooterBackgroundGradient, TextHoverEffect } from "@/Components/ui/hover-footer";

export default function Footer() {
    const { siteSettings = {}, navPages = [] } = usePage().props;

    // Parse dynamic footer links
    const footerLinks = siteSettings.footer_links ? 
        (typeof siteSettings.footer_links === 'string' ? JSON.parse(siteSettings.footer_links) : siteSettings.footer_links) 
        : [];

    const appName = siteSettings.app_name || 'Nexopay';

    // Contact info data
    const contactInfo = [
        {
            icon: <Mail size={18} className="text-[#3ca2fa]" />,
            text: siteSettings.contact_email || "support@nexopay.com.bd",
            href: siteSettings.contact_email ? `mailto:${siteSettings.contact_email}` : "mailto:support@nexopay.com.bd",
        },
        {
            icon: <Phone size={18} className="text-[#3ca2fa]" />,
            text: siteSettings.contact_phone || "+880 1700 000000",
            href: siteSettings.contact_phone ? `tel:${siteSettings.contact_phone}` : "tel:+8801700000000",
        },
        {
            icon: <MapPin size={18} className="text-[#3ca2fa]" />,
            text: siteSettings.contact_address || "Dhaka, Bangladesh",
        },
    ];

    return (
        <footer className="bg-[#0F0F11]/10 relative h-fit rounded-3xl overflow-hidden m-8 z-0">
            <div className="max-w-7xl mx-auto p-14 z-10 relative">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8 lg:gap-16 pb-12">
                    {/* Brand section */}
                    <div className="flex flex-col space-y-4">
                        <Link href="/" className="flex items-center space-x-2">
                            {siteSettings.navbar_logo ? (
                                <img src={siteSettings.navbar_logo} onError={(e) => { e.target.onerror = null; e.target.src = '/logo/nexopay-new-logo.png'; }} alt="Logo" className="h-10 object-contain" />
                            ) : (
                                <>
                                    <span className="text-[#3ca2fa] text-3xl font-extrabold">&hearts;</span>
                                    <span className="text-white text-3xl font-bold">{appName}</span>
                                </>
                            )}
                        </Link>
                        <div 
                            className="text-sm leading-relaxed text-gray-400"
                            dangerouslySetInnerHTML={{ __html: siteSettings.footer_text || "The premium platform for managing events, registrations, and checking in attendees securely." }}
                        />
                    </div>

                    {/* Resources (CMS Pages) */}
                    <div>
                        <h4 className="text-white text-lg font-semibold mb-6">Resources</h4>
                        <ul className="space-y-3">
                            {navPages && navPages.length > 0 ? (
                                navPages.map((page, index) => (
                                    <li key={index} className="relative">
                                        <Link href={route('page.show', page.slug)} className="text-gray-400 hover:text-[#3ca2fa] transition-colors">
                                            {page.title}
                                        </Link>
                                    </li>
                                ))
                            ) : (
                                <li><span className="text-gray-600 italic">No pages available.</span></li>
                            )}
                        </ul>
                    </div>

                    {/* Connect With Us (Dynamic Links) */}
                    <div>
                        <h4 className="text-white text-lg font-semibold mb-6">Connect With Us</h4>
                        <ul className="space-y-3">
                            {footerLinks.length > 0 ? (
                                footerLinks.map((link, index) => (
                                    link.title && link.url && (
                                        <li key={index} className="relative">
                                            <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#3ca2fa] transition-colors">
                                                {link.title}
                                            </a>
                                        </li>
                                    )
                                ))
                            ) : (
                                <li><span className="text-gray-600 italic">No social links configured.</span></li>
                            )}
                        </ul>
                    </div>

                    {/* Contact section */}
                    <div>
                        <h4 className="text-white text-lg font-semibold mb-6">Contact Us</h4>
                        <ul className="space-y-4">
                            {contactInfo.map((item, i) => (
                                <li key={i} className="flex items-center space-x-3 text-gray-400">
                                    {item.icon}
                                    {item.href ? (
                                        <a href={item.href} className="hover:text-[#3ca2fa] transition-colors">
                                            {item.text}
                                        </a>
                                    ) : (
                                        <span className="hover:text-[#3ca2fa] transition-colors">
                                            {item.text}
                                        </span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <hr className="border-t border-gray-700 my-8" />

                {/* Footer bottom */}
                <div className="flex flex-col md:flex-row justify-between items-center text-sm space-y-4 md:space-y-0 text-gray-400">
                    <p className="text-center md:text-left">
                        &copy; {new Date().getFullYear()} {appName}. All rights reserved.
                    </p>
                    
                    <div className="flex space-x-6">
                        <a href="#" className="hover:text-[#3ca2fa] transition-colors"><Globe size={20} /></a>
                    </div>
                </div>
            </div>

            {/* Text hover effect */}
            <div className="lg:flex hidden h-[30rem] -mt-52 -mb-36 relative z-20">
                <TextHoverEffect text={appName.toUpperCase()} />
            </div>

            <FooterBackgroundGradient />
        </footer>
    );
}
