import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';

export default function AuthenticatedLayout({ header, children }) {
    return (
        <div className="min-h-screen flex flex-col bg-[#030712] text-gray-100 font-sans selection:bg-indigo-500 selection:text-white transition-colors duration-300">
            {/* Background Ambient Glows */}
            <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 blur-[150px] rounded-full pointer-events-none z-0" />
            
            <Navbar />

            {header && (
                <header className="bg-white/5 border-b border-white/10 relative z-10">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main className="flex-1 relative z-10">{children}</main>
            
            <Footer />
        </div>
    );
}
