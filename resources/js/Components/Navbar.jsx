import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
export default function Navbar() {
    const { auth, siteSettings = {}, navPages = [] } = usePage().props;
    const user = auth?.user;
    
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    return (
        <nav className="border-b border-white/10 bg-[#030712]/70 backdrop-blur-xl sticky top-0 z-50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 justify-between items-center">
                    <div className="flex items-center">
                        <div className="flex shrink-0 items-center">
                            <Link href="/">
                                {siteSettings.navbar_logo ? (
                                    <img src={siteSettings.navbar_logo} alt="Logo" className="h-16 object-contain py-2" />
                                ) : (
                                    <div className="text-xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 uppercase">
                                        {siteSettings.app_name || 'NEXOPAY'}
                                    </div>
                                )}
                            </Link>
                        </div>

                        {user && (
                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                <NavLink
                                    href={route('dashboard')}
                                    active={route().current('dashboard')}
                                    className="text-gray-300 hover:text-white"
                                >
                                    Dashboard
                                </NavLink>
                            </div>
                        )}
                    </div>

                    {/* Central Navigation Links (Global) */}
                    <div className="hidden md:flex space-x-8 items-center">
                        <Link href="/#events" className="text-sm font-medium text-gray-300 hover:text-white transition">
                            Events
                        </Link>
                        {navPages && navPages.map((page, index) => (
                            <Link key={index} href={route('page.show', page.slug)} className="text-sm font-medium text-gray-300 hover:text-white transition">
                                {page.title}
                            </Link>
                        ))}
                    </div>

                    <div className="hidden sm:ms-6 sm:flex sm:items-center">
                        {user ? (
                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-md border border-transparent bg-transparent px-3 py-2 text-sm font-medium leading-4 text-gray-500 hover:text-gray-300 focus:outline-none transition"
                                            >
                                                {user.name}
                                                <svg
                                                    className="-me-0.5 ms-2 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        {user.global_role === 'Admin' && (
                                            <>
                                                <Dropdown.Link href={route('admin.dashboard')}>Events Dashboard</Dropdown.Link>
                                                <Dropdown.Link href={route('admin.partners.index')}>Partners</Dropdown.Link>
                                                <Dropdown.Link href={route('admin.pages.index')}>CMS Pages</Dropdown.Link>
                                                <Dropdown.Link href={route('admin.checkin.index')}>QR Check-in</Dropdown.Link>
                                                <Dropdown.Link href={route('admin.settings.index')}>Site Settings</Dropdown.Link>
                                            </>
                                        )}
                                        <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                                        <Dropdown.Link href={route('logout')} method="post" as="button">Log Out</Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        ) : (
                            <div className="space-x-4">
                                <Link href={route('login')} className="text-sm font-medium text-gray-300 hover:text-white transition">Log in</Link>
                                <Link href={route('register')} className="text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl transition shadow-[0_0_15px_rgba(79,70,229,0.3)]">Register</Link>
                            </div>
                        )}
                    </div>

                    <div className="-me-2 flex items-center sm:hidden">
                        <button
                            onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)}
                            className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-white/5 hover:text-white focus:bg-white/5 focus:text-white transition"
                        >
                            <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                <path className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                <path className={showingNavigationDropdown ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {showingNavigationDropdown && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="sm:hidden bg-[#030712]/90 backdrop-blur-3xl border-b border-white/10 overflow-hidden absolute w-full"
                    >
                        {user ? (
                            <>
                                <div className="space-y-1 pb-3 pt-2">
                                    <ResponsiveNavLink href={route('dashboard')} active={route().current('dashboard')}>Dashboard</ResponsiveNavLink>
                                </div>
                                <div className="border-t border-white/10 pb-1 pt-4 bg-white/5">
                                    <div className="px-4">
                                        <div className="text-base font-bold text-white">{user.name}</div>
                                        <div className="text-sm font-medium text-indigo-400">{user.email}</div>
                                    </div>
                                    <div className="mt-3 space-y-1">
                                        {user.global_role === 'Admin' && (
                                            <>
                                                <ResponsiveNavLink href={route('admin.dashboard')}>Events Dashboard</ResponsiveNavLink>
                                                <ResponsiveNavLink href={route('admin.partners.index')}>Partners</ResponsiveNavLink>
                                                <ResponsiveNavLink href={route('admin.pages.index')}>CMS Pages</ResponsiveNavLink>
                                                <ResponsiveNavLink href={route('admin.checkin.index')}>QR Check-in</ResponsiveNavLink>
                                                <ResponsiveNavLink href={route('admin.settings.index')}>Site Settings</ResponsiveNavLink>
                                            </>
                                        )}
                                        <ResponsiveNavLink href={route('profile.edit')}>Profile</ResponsiveNavLink>
                                        <ResponsiveNavLink method="post" href={route('logout')} as="button">Log Out</ResponsiveNavLink>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="space-y-1 pb-3 pt-2">
                                <ResponsiveNavLink href={route('login')}>Log in</ResponsiveNavLink>
                                <ResponsiveNavLink href={route('register')}>Register</ResponsiveNavLink>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
