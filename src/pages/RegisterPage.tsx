import React, { useState } from 'react';
import axios from 'axios';

interface FormData {
    email: string;
    password: string;
    repeatPassword: string;
}

const BASE_URL = 'http://localhost:8080/api/v1/auth/register';

const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const EyeSlashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
    </svg>
);

function RegisterPage() {
    const [formData, setFormData] = useState<FormData>({
        email: '',
        password: '',
        repeatPassword: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);
    const [status, setStatus] = useState<string>('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (formData.password !== formData.repeatPassword) {
            setStatus('Error: Passwords do not match');
            return;
        }

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
        }
    };

    const getStatusColor = () => {
        if (status.includes('Error')) return 'text-red-400 bg-red-400/10 border-red-400/20';
        if (status.includes('Successful')) return 'text-green-400 bg-green-400/10 border-green-400/20';
        return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-charcoal p-4">
            <div className="w-full max-w-md bg-charcoal/80 border border-gray-800 rounded-xl shadow-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6 text-center">Create Account</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 block">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            className="w-full border border-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 placeholder-gray-500 transition-all outline-none"
                            placeholder="name@company.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 block">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                className="w-full border border-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 pr-10 placeholder-gray-500 transition-all outline-none"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white focus:outline-none"
                            >
                                {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 block">
                            Repeat Password
                        </label>
                        <div className="relative">
                            <input
                                type={showRepeatPassword ? "text" : "password"}
                                name="repeatPassword"
                                className="w-full border border-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 pr-10 placeholder-gray-500 transition-all outline-none"
                                placeholder="••••••••"
                                value={formData.repeatPassword}
                                onChange={handleChange}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white focus:outline-none"
                            >
                                {showRepeatPassword ? <EyeSlashIcon /> : <EyeIcon />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full"
                    >
                        Register
                    </button>
                </form>

                {status && (
                    <div className={`mt-4 p-3 rounded-lg border text-sm text-center ${getStatusColor()}`}>
                        {status}
                    </div>
                )}
            </div>
        </div>
    );
}

export default RegisterPage;