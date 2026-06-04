import { Link, usePage } from '@inertiajs/react';

export default function Footer() {
    const { siteSettings = {}, navPages = [] } = usePage().props;

    // Parse dynamic footer links
    const footerLinks = siteSettings.footer_links ? 
        (typeof siteSettings.footer_links === 'string' ? JSON.parse(siteSettings.footer_links) : siteSettings.footer_links) 
        : [];

    return (
        <footer className="bg-[#030712] border-t border-white/10 pt-16 pb-8 text-gray-400 relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                    
                    {/* Brand Section */}
                    <div>
                        <Link href="/">
                            {siteSettings.navbar_logo ? (
                                <img src={siteSettings.navbar_logo} alt="Logo" className="h-10 object-contain mb-6" />
                            ) : (
                                <div className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-6 uppercase">
                                    {siteSettings.app_name || 'NEXOPAY'}
                                </div>
                            )}
                        </Link>
                        <p className="text-sm leading-relaxed max-w-sm">
                            {siteSettings.footer_text || "The premium platform for managing events, registrations, and checking in attendees securely."}
                        </p>
                    </div>

                    {/* Dynamic Links Section */}
                    <div>
                        <h4 className="text-white font-bold mb-6 tracking-wider uppercase text-sm">Connect With Us</h4>
                        <ul className="space-y-3">
                            {footerLinks.length > 0 ? (
                                footerLinks.map((link, index) => (
                                    link.title && link.url && (
                                        <li key={index}>
                                            <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-indigo-400 transition">
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

                    {/* CMS Pages Section */}
                    <div>
                        <h4 className="text-white font-bold mb-6 tracking-wider uppercase text-sm">Resources</h4>
                        <ul className="space-y-3">
                            {navPages && navPages.length > 0 ? (
                                navPages.map((page, index) => (
                                    <li key={index}>
                                        <Link href={route('page.show', page.slug)} className="text-gray-400 hover:text-indigo-400 transition">
                                            {page.title}
                                        </Link>
                                    </li>
                                ))
                            ) : (
                                <li><span className="text-gray-600 italic">No pages available.</span></li>
                            )}
                        </ul>
                    </div>

                </div>

                <div className="border-t border-white/5 pt-8 text-center text-sm">
                    <p>&copy; {new Date().getFullYear()} {siteSettings.app_name || 'Nexopay'}. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
