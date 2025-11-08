import React, { useState } from 'react';
// Import new icons
import { Loader2, PartyPopper, ArrowLeft, ShieldCheck, Lock } from 'lucide-react';

/**
 * A standalone payment processing page.
 * * Assumes it receives a `plan` prop with { name, price }
 * * Assumes it receives an `onBack` prop for navigation
 * If no plan is provided, it uses a default fallback.
 */
export default function Upgrade({ plan: planFromProps, onBack }) { 
    
    // Default plan for fallback
    const defaultPlan = { name: 'Pro Plan', price: 600, currency: 'INR' };
    // Use planFromProps first, then defaultPlan. Check for price to ensure object is valid.
    const plan = (planFromProps && planFromProps.price) ? planFromProps : defaultPlan;

    const [paymentState, setPaymentState] = useState('idle'); // 'idle', 'processing', 'success', 'error'
    const [generatedCode, setGeneratedCode] = useState('');
    const [error, setError] = useState('');

    /**
     * Generates a random alphanumeric + special character code.
     */
    const generateProCode = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
        let code = '';
        for (let i = 0; i < 16; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return `PRO-${code}`;
    };

    /**
     * Simulates the payment process.
     */
    const handlePayment = async () => {
        setPaymentState('processing');
        setError('');

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        try {
            // 1. Generate the code
            const code = generateProCode();
            setGeneratedCode(code);
            
            // 2. Save to localStorage as requested
            localStorage.setItem('proVersion', code);
            console.log("Pro code saved to localStorage:", code);
            
            // 3. Set success state
            setPaymentState('success');

            // 4. Navigate to /home/track after a short delay (1 second)
            setTimeout(() => {
                window.location.href = '/home/trackyourlocation';
            }, 1000); 

        } catch (e) {
            console.error("Error during payment simulation or saving:", e);
            setPaymentState('error');
            setError(e.message || "An unknown error occurred.");
        }
    };

    // Helper for formatting currency
    const formatCurrency = (amount, currency) => {
        if (currency === 'INR') {
            return `₹${amount.toLocaleString('en-IN')}`;
        }
        // Fallback for other currencies
        return `$${amount.toLocaleString('en-US')}`;
    };

    return (
        <div className="font-inter antialiased min-h-screen bg-gray-100 flex items-center justify-center p-4">
            {/* Added animation and relative positioning for effects */}
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 relative animate-fade-in-up overflow-hidden">

                {/* Add a back button, assuming `onBack` is passed by the router/parent */}
                {/* This button is only shown before payment is successful */}
                {onBack && paymentState !== 'success' && (
                    <button
                        onClick={onBack}
                        className="absolute top-6 left-6 flex items-center text-sm text-gray-500 hover:text-purple-700 font-semibold transition-colors z-10"
                    >
                        <ArrowLeft className="w-4 h-4 mr-1.5" />
                        Back
                    </button>
                )}

                {paymentState === 'success' ? (
                    // --- Success State ---
                    <div className="text-center">
                        {/* Added animation to the icon */}
                        <PartyPopper className="w-20 h-20 text-green-500 mx-auto mb-5 animate-bounce-slow" />
                        <h2 className="text-3xl font-bold text-gray-900 mb-3">Payment Successful!</h2>
                        <p className="text-gray-600 mb-6 text-lg">Your Pro subscription is active!</p>
                        {/* <p className="text-gray-600 mb-4">Your activation code is:</p> */}
                        {/* Enhanced code block */}
                        <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-dashed border-gray-300 rounded-lg font-mono text-lg text-purple-700 break-all mb-6 shadow-inner">
                            {/* {generatedCode} */}
                        </div>
                        <p className="text-sm text-gray-500">
                            Congratulations! You are now a Pro user. Enjoy all the premium features!
                        </p>
                    </div>
                ) : (
                    // --- Idle/Processing/Error State ---
                    <>
                        {/* Added icon to title */}
                        <div className="flex items-center justify-center mb-2 pt-8 md:pt-0">
                            <ShieldCheck className="w-7 h-7 text-purple-600 mr-2" />
                            <h2 className="text-2xl font-semibold text-gray-800 text-center">
                                Confirm Purchase
                            </h2>
                        </div>
                        <p className="text-center text-gray-600 mb-6">
                            You are about to purchase the <strong>{plan.name}</strong> plan.
                        </p>
                        
                        {/* Enhanced price box */}
                        <div className="bg-gray-50 rounded-lg p-6 mb-6 text-center border border-gray-200">
                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Amount</p>
                            <p className="text-5xl font-extrabold text-gray-900 my-2">
                                {formatCurrency(plan.price, plan.currency)}
                            </p>
                            <p className="text-gray-600">
                                {plan.name.toLowerCase().includes('annual') ? 'Billed once annually' : 'Billed once monthly'}
                            </p>
                        </div>
                        
                        {/* Enhanced button with gradient and hover effect */}
                        <button
                            onClick={handlePayment}
                            disabled={paymentState === 'processing'}
                            className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white font-bold py-4 rounded-lg shadow-lg hover:from-purple-700 hover:to-blue-600 transition-all text-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                        >
                            {paymentState === 'processing' ? (
                                <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                                "Pay with connected account"
                            )}
                        </button>
                        
                        {/* Secure payment text */}
                        <div className="flex items-center justify-center mt-4 text-sm text-gray-500">
                            <Lock className="w-4 h-4 mr-1.5" />
                            Secure 128-bit SSL Payment
                        </div>
                        
                        {paymentState === 'error' && (
                            <p className="text-red-600 text-sm font-medium text-center mt-4">{error}</p>
                        )}
                    </>
                )}
            </div>

            {/* CSS for animations */}
            <style jsx global>{`
                @keyframes fadeInUp {
                    from { 
                        opacity: 0; 
                        transform: translate3d(0, 30px, 0) scale(0.98); 
                    }
                    to { 
                        opacity: 1; 
                        transform: translate3d(0, 0, 0) scale(1); 
                    }
                }
                .animate-fade-in-up {
                    animation: fadeInUp 0.5s ease-out forwards;
                }
                
                @keyframes bounceSlow {
                    0%, 100% {
                        transform: translateY(-10%);
                        animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
                    }
                    50% {
                        transform: translateY(0);
                        animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
                    }
                }
                .animate-bounce-slow {
                    animation: bounceSlow 1.5s infinite;
                }
            `}</style>
        </div>
    );
}

// Set default props for the component
Upgrade.defaultProps = {
    plan: { name: 'Pro Plan', price: 600, currency: 'INR' },
    onBack: null // Set default onBack to null (making it optional)
};