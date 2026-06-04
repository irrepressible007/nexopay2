import { Link, usePage } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    const { siteSettings = {} } = usePage().props;

    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-[#030712] relative overflow-hidden text-gray-100">
            {/* Ambient Background */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none" />

            <div className="z-10 text-center mb-8">
                <Link href="/">
                    {siteSettings.navbar_logo ? (
                        <img src={siteSettings.navbar_logo} alt="Logo" className="h-16 object-contain mx-auto" />
                    ) : (
                        <div className="text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 uppercase">
                            {siteSettings.app_name || 'NEXOPAY'}
                        </div>
                    )}
                </Link>
            </div>

            <div className="w-full sm:max-w-md mt-6 px-8 py-10 bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden sm:rounded-3xl z-10 relative">
                {children}
            </div>
        </div>
    );
}
