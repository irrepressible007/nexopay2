import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';

export default function AdminLogin({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });
    const { siteSettings = {} } = usePage().props;

    const submit = (e) => {
        e.preventDefault();

        post(route('admin.login.store'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-[#0a0a0a] text-gray-100">
            <Head title="Admin Secure Portal" />

            {/* Left Side - Brand / Info (Hidden on very small screens) */}
            <div className="hidden md:flex md:w-1/2 lg:w-3/5 bg-gradient-to-br from-gray-900 to-black p-12 flex-col justify-between border-r border-gray-800 relative overflow-hidden">
                {/* Ambient Red/Indigo glow for Admin theme */}
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-red-600/10 blur-[150px] rounded-full pointer-events-none" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-900/10 blur-[120px] rounded-full pointer-events-none" />

                <div className="z-10">
                    <Link href="/">
                        {siteSettings.navbar_logo ? (
                            <img src={siteSettings.navbar_logo} onError={(e) => { e.target.onerror = null; e.target.src = '/logo/nexopay-new-logo.png'; }} alt="Logo" className="h-12 object-contain" />
                        ) : (
                            <div className="text-3xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500 uppercase">
                                {siteSettings.app_name || 'NEXOPAY'}
                            </div>
                        )}
                    </Link>
                </div>

                <div className="z-10 max-w-xl">
                    <ShieldCheckIcon className="h-16 w-16 text-red-500 mb-6" />
                    <h1 className="text-5xl font-black text-white tracking-tight mb-4">Secure Administration Portal</h1>
                    <p className="text-xl text-gray-400">
                        Authorized personnel only. Access to this system is strictly monitored and logged.
                    </p>
                </div>

                <div className="z-10 text-sm text-gray-600 font-medium">
                    &copy; {new Date().getFullYear()} {siteSettings.app_name || 'Nexopay'}. All rights reserved.
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full md:w-1/2 lg:w-2/5 flex items-center justify-center p-8 sm:p-12 relative overflow-hidden">
                {/* Subtle red glow behind the form for mobile */}
                <div className="md:hidden absolute top-0 right-0 w-full h-full bg-red-900/10 blur-[100px] rounded-full pointer-events-none" />

                <div className="w-full max-w-md z-10">
                    <div className="mb-10">
                        <h2 className="text-3xl font-bold text-white mb-2">System Login</h2>
                        <p className="text-gray-400">Enter your credentials to access the console.</p>
                    </div>

                    {status && (
                        <div className="mb-4 p-4 rounded-lg bg-green-900/30 border border-green-500/30 text-sm font-medium text-green-400">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <InputLabel htmlFor="email" value="Administrator Email" className="text-gray-300" />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-2 block w-full bg-gray-900 border-gray-700 text-white focus:border-red-500 focus:ring-red-500"
                                autoComplete="username"
                                isFocused={true}
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            <InputError message={errors.email} className="mt-2 text-red-400" />
                        </div>

                        <div>
                            <InputLabel htmlFor="password" value="Password" className="text-gray-300" />
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="mt-2 block w-full bg-gray-900 border-gray-700 text-white focus:border-red-500 focus:ring-red-500"
                                autoComplete="current-password"
                                onChange={(e) => setData('password', e.target.value)}
                            />
                            <InputError message={errors.password} className="mt-2 text-red-400" />
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <Checkbox
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="bg-gray-900 border-gray-700 text-red-600 focus:ring-red-600"
                                />
                                <span className="ms-2 text-sm text-gray-400">
                                    Remember session
                                </span>
                            </label>

                            {canResetPassword ? (
                                <Link
                                    href={route('password.request')}
                                    className="text-sm font-medium text-red-400 hover:text-red-300 transition-colors"
                                >
                                    Forgot password?
                                </Link>
                            ) : <div />}
                        </div>

                        <PrimaryButton 
                            className="w-full justify-center py-3 bg-red-600 hover:bg-red-500 focus:bg-red-500 active:bg-red-700 shadow-[0_0_20px_rgba(220,38,38,0.3)] transition-all text-white font-bold tracking-wide rounded-xl" 
                            disabled={processing}
                        >
                            {processing ? 'Authenticating...' : 'Secure Login'}
                        </PrimaryButton>
                    </form>
                </div>
            </div>
        </div>
    );
}
