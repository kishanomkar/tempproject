import React, { useState, useEffect } from "react";

// --- Icon Components for the UI ---
const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
    </svg>
);

const SuccessIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
);

const ErrorIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
    </svg>
);


const SendAlert = () => {
    const [type, setType] = useState("");
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState({ message: "", type: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Effect to clear the status message after 3 seconds
    useEffect(() => {
        if (status.message) {
            const timer = setTimeout(() => {
                setStatus({ message: "", type: "" });
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [status]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!type) {
            setStatus({ message: "Please select an alert type.", type: "error" });
            return;
        }
        setIsSubmitting(true);
        setStatus({ message: "", type: "" });

        try {
            const res = await fetch("http://localhost:3000/api/alerts/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type, message })
            });
            const data = await res.json();

            if (data.success) {
                setStatus({ message: "Alert sent successfully!", type: "success" });
                setType("");
                setMessage("");
            } else {
                throw new Error(data.message || "Failed to send alert");
            }
        } catch (err) {
            setStatus({ message: err.message || "An unexpected error occurred.", type: "error" });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <form onSubmit={handleSend} className="w-full max-w-lg bg-white p-8 rounded-xl shadow-lg space-y-6">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-800">Dispatch Alert</h1>
                    <p className="text-gray-500 mt-2">Send a real-time notification to the system.</p>
                </div>

                <div>
                    <label htmlFor="alert-type" className="block text-sm font-medium text-gray-700 mb-1">
                        Alert Type
                    </label>
                    <select
                        id="alert-type"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 block w-full p-2.5 rounded-md shadow-sm"
                        required
                    >
                        <option value="" disabled>Select a type...</option>
                        <option value="SOS">SOS</option>
                        <option value="Location Anomaly">Location Anomaly</option>
                        <option value="General Info">General Info</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="alert-message" className="block text-sm font-medium text-gray-700 mb-1">
                        Message
                    </label>
                    <textarea
                        id="alert-message"
                        placeholder="Enter the alert details here..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 block w-full p-2.5 rounded-md shadow-sm"
                        rows="4"
                        required
                    />
                </div>
                
                {status.message && (
                    <div className={`flex items-center gap-3 p-3 rounded-md text-sm ${
                        status.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                        {status.type === 'success' ? <SuccessIcon /> : <ErrorIcon />}
                        <span>{status.message}</span>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex justify-center items-center gap-2 bg-blue-600 text-white font-bold px-4 py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-all duration-200"
                >
                    {isSubmitting ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Sending...</span>
                        </>
                    ) : (
                        <>
                            <SendIcon />
                            <span>Send Alert</span>
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

export default SendAlert;