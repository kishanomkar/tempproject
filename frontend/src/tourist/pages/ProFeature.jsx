import React, { useState } from 'react';
import { CheckCircle, User, Award } from 'lucide-react';

/**
 * MaiProFeature component rendered as the Pro Features subscription page.
 * This component is self-contained and uses Tailwind CSS for styling.
 */
export default function ProFeature() {
    // State to manage the selected billing plan ('monthly' or 'annual')
    const [plan, setPlan] = useState('annual');

    // List of pro features
    const proFeatures = [
        'Unlimited AI Chat Queries',
        'Track your Family Members in Real-Time',
        'Access to Community chatrooms with people from your regions',
        '24/7 priority support',
        'Access to Blog Features and chance to earn Vouchers',
    ];

    // Pricing details
    const monthlyPrice = 600;
    const annualPrice = 4500; // $10/month
    const savingsPercent = Math.round(((monthlyPrice * 12 - annualPrice) / (monthlyPrice * 12)) * 100);

    return (
        <div className="font-inter antialiased min-h-screen bg-gray-100 flex items-center justify-center p-4">
            {/* Main container card */}
            <div className="max-w-5xl w-full bg-white rounded-2xl shadow-xl overflow-hidden md:flex">
                
                {/* Left Side: Feature Promotion */}
                <div className="w-full md:w-1/2 bg-gradient-to-br from-purple-600 to-blue-500 text-white p-8 md:p-12">
                    <h1 className="text-4xl font-bold mb-4">Go Pro.</h1>
                    <p className="text-lg opacity-90 mb-8">
                        Unlock all features and supercharge your workflow.
                    </p>
                    
                    {/* Feature list */}
                    <ul className="space-y-4">
                        {proFeatures.map((feature, index) => (
                            <li key={index} className="flex items-center text-white/90">
                                <CheckCircle className="w-5 h-5 mr-3 text-green-300 flex-shrink-0" />
                                <span>{feature}</span>
                            </li>
                        ))}
                    </ul>

                    {/* Testimonial */}
                    <div className="mt-12 p-6 bg-purple-700/50 rounded-lg">
                        <div className="flex items-center">
                            {/* Using a simple div as a placeholder for a user image */}
                            <div className="w-12 h-12 rounded-full bg-purple-300/50 flex items-center justify-center border-2 border-white/70">
                                <User className="w-6 h-6 text-white" />
                            </div>
                            <div className="ml-4">
                                <p className="font-semibold">Purvansh Natani</p>
                                <p className="text-sm opacity-80">Chief Excecutive Officer, Go-Electric</p>
                            </div>
                        </div>
                        <p className="mt-4 italic text-white/90">
                           "The Pro version pays for itself — the smart automation and real-time insights have boosted our efficiency more than we expected."
                        </p>
                    </div>
                </div>

                {/* Right Side: Pricing & CTA */}
                <div className="w-full md:w-1/2 p-8 md:p-12 bg-white">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                        Choose your plan
                    </h2>

                    {/* Plan Toggle */}
                    <div className="flex w-full bg-gray-100 rounded-lg p-1.5 mb-8">
                        <button
                            onClick={() => setPlan('monthly')}
                            className={`w-1/2 py-2.5 rounded-md font-semibold text-sm transition-all ${
                                plan === 'monthly' 
                                    ? 'bg-white shadow text-purple-700' 
                                    : 'text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setPlan('annual')}
                            className={`w-1/2 py-2.5 rounded-md font-semibold text-sm transition-all relative ${
                                plan === 'annual' 
                                    ? 'bg-white shadow text-purple-700' 
                                    : 'text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            Annual
                            <span className="absolute -top-2.5 -right-2.5 bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow">
                                SAVE {savingsPercent}%
                            </span>
                        </button>
                    </div>

                    {/* Price Display */}
                    <div className="text-center mb-8">
                        {plan === 'monthly' ? (
                            <>
                                <div className="flex items-baseline justify-center">
                                    <span className="text-5xl font-extrabold text-gray-900">₹{monthlyPrice}</span>
                                    <span className="text-xl font-medium text-gray-500 ml-1.5">/month</span>
                                </div>
                                <p className="text-gray-500 mt-2">Billed monthly.</p>
                            </>
                        ) : (
                            <>
                                <div className="flex items-baseline justify-center">
                                    <span className="text-5xl font-extrabold text-gray-900">₹{annualPrice / 12}</span>
                                    <span className="text-xl font-medium text-gray-500 ml-1.5">/month</span>
                                </div>
                                <p className="text-gray-500 mt-2">Billed ₹{annualPrice} annually.</p>
                            </>
                        )}
                    </div>

                    {/* CTA Button */}
                    <a href='/home/upgrade'><button className="w-full bg-purple-600 text-white font-bold py-4 rounded-lg shadow-lg hover:bg-purple-700 transition-all text-lg flex items-center justify-center">
                        <Award className="w-5 h-5 mr-2" />
                        Upgrade Now
                    </button></a>

                    <p className="text-center text-gray-500 text-sm mt-6">
                        14-day money-back guarantee. Cancel anytime.
                    </p>

                    {/* Footer Links */}
                    <div className="text-center text-gray-400 text-xs mt-12 space-x-4">
                        <a href="#" className="hover:underline">Terms of Service</a>
                        <span aria-hidden="true">&bull;</span>
                        <a href="#" className="hover:underline">Privacy Policy</a>
                    </div>
                </div>
            </div>
        </div>
    );
}