import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useForm, Link } from '@inertiajs/react';
import { Globe, ShieldAlert, Users } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        user_id_no: '',
        last_name: '',
        birthdate: '',
        email: '',
        password: '',
    });

    const [showPassword, setShowPassword] = useState(false);

    const [errorAttempts, setErrorAttempts] = useState(0);

    function submit(e) {
        e.preventDefault();

        post('/register', {
            onStart: () => {
                toast.loading('Registering...', { id: 'register' });
            },
            onSuccess: () => {
                toast.success('Registration successful!', { id: 'register' });
                reset('password');
                setErrorAttempts(0); // reset counter
            },
            onError: () => {
                toast.error('Registration failed. Please check your inputs.', { id: 'register' });

                setErrorAttempts(prev => prev + 1);
            },
            onFinish: () => {
                toast.dismiss('register');
            }
        });
    }

    return (
        <div className="h-screen w-full bg-[#f4f6fb] overflow-hidden">

            <div className="grid grid-cols-1 md:grid-cols-2 h-full w-full">


                {/* LEFT SIDE */}
                <div className="hidden md:flex flex-col justify-between bg-gradient-to-br from-blue-600 to-blue-700 text-white p-16">

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
                <div className="relative bg-[#f8f9fc] p-8 md:p-16 overflow-y-auto">

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

                    <div className="min-h-full flex items-center justify-center">
                        <div className="w-full max-w-md relative z-10">
                            <div className="mb-10 text-center border-b pb-3">
                                <h2 className="text-4xl font-bold tracking-tight text-blue-600">
                                    myOCC
                                </h2>
                                <p className="text-gray-500 mt-2">
                                    Sign up for a student account to get started
                                </p>
                            </div>

                            {errorAttempts >= 2 && (
                                <div className="mb-6 p-4 rounded-xl border border-amber-300 bg-amber-50 text-amber-800 text-sm">
                                    <p className="font-semibold mb-1">
                                        Still can’t find your record?
                                    </p>
                                    <p>
                                        Please verify your details at{" "}
                                        <a
                                            href="https://www.sis.occph.com"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="underline font-medium"
                                        >
                                            www.sis.occph.com
                                        </a>{" "}
                                        or visit the school IT Administrator for assistance.
                                    </p>
                                </div>
                            )}

                            <form onSubmit={submit} className="space-y-5">

                                {/* ID Number */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-2">
                                        ID Number
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={data.user_id_no}
                                        onChange={e => setData('user_id_no', e.target.value)}
                                        placeholder="Enter your ID Number"
                                        className="w-full px-4 py-3 rounded-xl bg-gray-100 border border-transparent focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none transition uppercase placeholder:normal-case"
                                    />
                                    {errors.user_id_no && (
                                        <p className="mt-1 text-sm text-red-600">{errors.user_id_no}</p>
                                    )}
                                </div>

                                {/* Two Column Row */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                    {/* Last Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-2">
                                            Last Name
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={data.last_name}
                                            onChange={e => setData('last_name', e.target.value)}
                                            placeholder="Enter your Last Name"
                                            className="w-full px-4 py-3 rounded-xl bg-gray-100 border border-transparent 
                       focus:border-blue-500 focus:bg-white focus:ring-2 
                       focus:ring-blue-100 outline-none transition uppercase placeholder:normal-case"
                                        />
                                        {errors.last_name && (
                                            <p className="mt-1 text-sm text-red-600">{errors.last_name}</p>
                                        )}
                                    </div>

                                    {/* Birthdate */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-2">
                                            Birthdate
                                        </label>
                                        <input
                                            type="date"
                                            required
                                            max={new Date().toISOString().split("T")[0]}
                                            value={data.birthdate}
                                            onChange={e => setData('birthdate', e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-100 border border-transparent 
                       focus:border-blue-500 focus:bg-white focus:ring-2 
                       focus:ring-blue-100 outline-none transition"
                                        />
                                        {errors.birthdate && (
                                            <p className="mt-1 text-sm text-red-600">{errors.birthdate}</p>
                                        )}
                                    </div>

                                </div>


                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                        placeholder="Enter your Email"
                                        className="w-full px-4 py-3 rounded-xl bg-gray-100 border border-transparent focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none transition"
                                    />
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                    )}
                                </div>

                                {/* Password */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-2">
                                        Create Password
                                    </label>

                                    <div className="relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            required
                                            value={data.password}
                                            onChange={e => setData('password', e.target.value)}
                                            placeholder="Create a secure password"
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
                                        <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                                    )}
                                </div>

                                {/* Submit */}
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

                                    {processing ? 'Registering...' : 'Register'}
                                </button>

                            </form>

                            {/* Login Link */}
                            <div className="text-sm text-center mt-4">
                                <Link
                                    href="/login"
                                    className="text-blue-600 font-medium hover:underline"
                                >
                                    Already have an account? Log in
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

}
