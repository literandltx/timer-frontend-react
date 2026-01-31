import React, {useState} from 'react';
import axios from 'axios';
import {NavLink} from "react-router";

interface FormData {
    email: string;
    password: string;
    repeatPassword: string;
}

const BASE_URL = 'http://localhost:8080/api/v1/auth/register';

const MailIcon = ({className}: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
         stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round"
              d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/>
    </svg>
);

const LockIcon = ({className}: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
         stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round"
              d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/>
    </svg>
);

const Spinner = () => (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg"
         fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

function RegisterPage() {
    const [formData, setFormData] = useState<FormData>({
        email: '',
        password: '',
        repeatPassword: ''
    });

    const [showPassword] = useState(false);
    const [showRepeatPassword] = useState(false);
    const [status, setStatus] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
        if (status.includes('Error')) {
            setStatus('');
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (formData.password !== formData.repeatPassword) {
            setStatus('Error: Passwords do not match');
            return;
        }

        setIsLoading(true);
        setStatus('Sending...');

        try {
            const response = await axios.post(BASE_URL, formData);
            console.log('Success:', response.data);
            setStatus('Registration Successful!');
        } catch (error) {
            console.error('Error:', error);
            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data?.message || 'Registration failed';
                setStatus(`Error: ${errorMessage}`);
            } else {
                setStatus('Error: An unexpected error occurred');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusColor = () => {
        if (status.includes('Error')) {
            return 'text-red-400 bg-red-500/10 border-red-500/20';
        }
        if (status.includes('Successful')) {
            return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
        }
        return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
    };

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-100 to-cyan-300">
                    Create Account
                </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 block ml-1">
                        Email
                    </label>
                    <div className="relative group">
                        <div
                            className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MailIcon
                                className="h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors"/>
                        </div>
                        <input
                            type="email"
                            name="email"
                            className="w-full bg-slate-800/10 border border-slate-700 text-white text-sm rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 block pl-10 p-3 placeholder-slate-500 transition-all outline-none"
                            placeholder="name@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 block ml-1">
                        Password
                    </label>
                    <div className="relative group">
                        <div
                            className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <LockIcon
                                className="h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors"/>
                        </div>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            className="w-full bg-slate-800/10 border border-slate-700 text-white text-sm rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 block pl-10 pr-10 p-3 placeholder-slate-500 transition-all outline-none"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 block ml-1">
                        Confirm Password
                    </label>
                    <div className="relative group">
                        <div
                            className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <LockIcon
                                className="h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors"/>
                        </div>
                        <input
                            type={showRepeatPassword ? "text" : "password"}
                            name="repeatPassword"
                            className="w-full bg-slate-800/10 border border-slate-700 text-white text-sm rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 block pl-10 pr-10 p-3 placeholder-slate-500 transition-all outline-none"
                            placeholder="••••••••"
                            value={formData.repeatPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center items-center bg-gradient-to-r from-[#242424]/70 to-[#242424]/70 font-semibold py-3 px-4 rounded-xl shadow-lg transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                    {isLoading ? (
                        <>
                            <Spinner/>
                            Registering...
                        </>
                    ) : (
                        'Create Account'
                    )}
                </button>
            </form>

            {status && (
                <div
                    className={`mt-6 p-3 rounded-xl border text-sm text-center animate-pulse ${getStatusColor()}`}>
                    {status}
                </div>
            )}

            <p className="mt-8 text-center text-sm text-slate-500">
                Already have an account?{' '}
                <NavLink
                    to="/auth/login"
                    className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                    Log in
                </NavLink>
            </p>
        </div>
    );
}

export default RegisterPage;
