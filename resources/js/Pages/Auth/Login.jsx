import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useForm } from '@inertiajs/react';
import { Globe, ShieldAlert, Users } from 'lucide-react';
import { useState } from 'react';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        user_id_no: '',
        password: ''
    });

    const [showPassword, setShowPassword] = useState(false);

    function submit(e) {
        e.preventDefault();
        post('/login');
    }

    return (
        <div className="min-h-screen bg-[#f4f6fb] flex items-center justify-center px-4">
            <div className="w-full max-w-6xl rounded-2xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-2 bg-white">

                {/* LEFT SIDE */}
                <div className="hidden md:flex flex-col justify-between bg-gradient-to-br from-blue-600 to-blue-700 text-white p-12 relative">

                    {/* Top */}
                    <div>
                        <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mb-6 shadow">
                            <img src="/assets/images/school-logo.png" alt="Logo" className="h-8 w-8" />
                        </div>

                        <h2 className="text-3xl font-bold tracking-tight">
                            Opol Community College
                        </h2>

                        <p className="mt-3 text-blue-100 text-lg">
                            Center for Student Developlment and Leadership
                        </p>

                        <div className="mt-12 space-y-6 text-blue-100 text-sm">

                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">
                                    <Users className="w-5 h-5" />
                                </div>
                                <span>Manage clubs and organizations</span>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">
                                    <ShieldAlert className="w-5 h-5" />
                                </div>
                                <span>Access violation records</span>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">
                                    <Globe className="w-5 h-5" />
                                </div>
                                <span>Stay connected with education</span>
                            </div>

                        </div>
                    </div>

                    {/* Bottom */}
                    <div className="text-blue-200 text-xs tracking-widest border-t border-blue-500 pt-4">
                        EMPOWERING EXCELLENCE
                    </div>
                </div>


                {/* RIGHT SIDE */}
                <div className="relative flex items-center justify-center bg-[#f8f9fc] p-8 md:p-16 overflow-hidden">

                    {/* Watermark */}
                    <img
                        src="/favicon.png"
                        alt="Watermark"
                        className="
            absolute
            -top-5
            -left-5
            w-[200px]
            opacity-[0.1]
            rotate-[-25deg]
            pointer-events-none
            select-none
        "
                    />

                    <div className="w-full max-w-md">

                        <div className="mb-10 text-center border-b pb-3">
                            <h2 className="text-4xl font-bold tracking-tight text-blue-600">
                                myOCC
                            </h2>
                            <p className="text-gray-500 mt-2">
                                Sign in to your account to continue
                            </p>
                        </div>

                        <form onSubmit={submit} className="space-y-6">

                            {errors.error && (
                                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                                    {errors.error}
                                </div>
                            )}

                            {/* ID */}
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">
                                    ID Number
                                </label>
                                <input
                                    type="text"
                                    required
                                    autoComplete="username"
                                    value={data.user_id_no}
                                    onChange={e => setData('user_id_no', e.target.value)}
                                    placeholder="Enter your ID Number"
                                    className="w-full px-4 py-3 rounded-xl bg-gray-100 border border-transparent focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none transition uppercase placeholder:normal-case"
                                />

                                {errors.user_id_no && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.user_id_no}
                                    </p>
                                )}
                            </div>

                            {/* PASSWORD */}
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        autoComplete="current-password"
                                        value={data.password}
                                        onChange={e => setData('password', e.target.value)}
                                        placeholder="Enter your password"
                                        className="w-full px-4 py-3 rounded-xl bg-gray-100 border border-transparent focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none transition"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-4 flex items-center text-gray-500 hover:text-gray-700"
                                    >
                                        {showPassword ? (
                                            <EyeSlashIcon className="h-5 w-5" />
                                        ) : (
                                            <EyeIcon className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            {/* OPTIONS */}
                            <div className="flex items-center justify-between text-sm">
                                <a href="#" className="text-blue-600 font-medium hover:underline">
                                    Forgot Password?
                                </a>
                            </div>

                            {/* BUTTON */}
                             <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full py-3 rounded-xl text-white font-semibold bg-blue-600 hover:bg-blue-700 
               transition shadow-lg shadow-blue-200 disabled:opacity-70 
               disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {processing && (
                                        <svg
                                            className="w-5 h-5 animate-spin"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            />
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8v8H4z"
                                            />
                                        </svg>
                                    )}

                                    {processing ? 'Signing in...' : 'Sign In'}
                                </button>
                        </form>
                    </div>
                </div>

            </div>
        </div>
    );
}
