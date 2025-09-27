import React, { useState } from 'react';

// --- Reusable SVG Icons ---
const UploadIcon = () => (
    <svg className="mx-auto h-12 w-12 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const LoadingSpinner = () => (
    <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-700"></div>
    </div>
);

// --- Main Landmark Identifier Component ---
export default function LandmarkIdentifier() {
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [result, setResult] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setResult('');
            setError('');
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const identifyLandmark = async () => {
        if (!imageFile) {
            setError('Please upload an image first.');
            return;
        }

        setIsLoading(true);
        setError('');
        setResult('');

        // Convert the image to a base64 string
        const reader = new FileReader();
        reader.readAsDataURL(imageFile);
        reader.onloadend = async () => {
            const base64data = reader.result.split(',')[1];

            const prompt = `You are an expert tour guide for Jaipur, India. Identify the landmark in this image. Provide its name in a heading, a concise one-paragraph description, and one interesting historical fact in a separate paragraph. If the image is not a landmark in Jaipur, politely state that you can only identify landmarks within Jaipur.`;

            // Prepare the payload for the Gemini API
            const payload = {
                contents: [{
                    parts: [
                        { text: prompt },
                        {
                            inlineData: {
                                mimeType: imageFile.type,
                                data: base64data
                            }
                        }
                    ]
                }]
            };

            try {
                // Call the Gemini API
                const apiKey = process.env.GEMINI_API_KEY; // Leave as-is, will be handled by the environment
                const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    throw new Error(`API request failed with status ${response.status}`);
                }
                
                const data = await response.json();
                const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
                
                if (text) {
                    setResult(text.replace(/\n/g, '<br/>')); // Format newlines for HTML
                } else {
                    throw new Error("No content received from the API.");
                }

            } catch (err) {
                console.error("API Error:", err);
                setError("Sorry, we couldn't identify the landmark. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };
        reader.onerror = () => {
            setError('Failed to read the image file.');
            setIsLoading(false);
        };
    };

    return (
        <div className="p-8 bg-slate-100 min-h-full font-sans">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-slate-800">Landmark Identifier</h1>
                <p className="mt-2 text-slate-600">
                    Have a photo of a place in Jaipur? Upload it here and let our AI guide tell you all about it.
                </p>

                <div className="mt-8 p-6 bg-white rounded-2xl shadow-lg">
                    {/* --- Image Upload Area --- */}
                    <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center">
                        {!previewUrl && (
                            <>
                                <UploadIcon />
                                <label htmlFor="file-upload" className="relative cursor-pointer mt-4 font-medium text-blue-600 hover:text-blue-500">
                                    <span>Upload a file</span>
                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/png, image/jpeg" />
                                </label>
                                <p className="text-xs text-slate-500 mt-1">PNG, JPG up to 10MB</p>
                            </>
                        )}
                        {previewUrl && (
                            <div className="relative group">
                                <img src={previewUrl} alt="Landmark preview" className="mx-auto max-h-72 rounded-lg" />
                                <label htmlFor="file-upload" className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                    Change Image
                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/png, image/jpeg" />
                                </label>
                            </div>
                        )}
                    </div>

                    {/* --- Action Button --- */}
                    <div className="mt-6">
                        <button
                            onClick={identifyLandmark}
                            disabled={!imageFile || isLoading}
                            className="w-full py-3 px-4 rounded-lg font-bold text-white bg-slate-800 hover:bg-slate-900 disabled:bg-slate-400 transition-colors"
                        >
                            {isLoading ? <LoadingSpinner /> : 'Identify Landmark'}
                        </button>
                    </div>
                </div>

                {/* --- Results Display --- */}
                {(result || error) && (
                    <div className="mt-8 p-6 bg-white rounded-2xl shadow-lg">
                        <h2 className="text-2xl font-bold text-slate-800">Analysis Result</h2>
                        {error && (
                             <p className="mt-4 text-red-600 bg-red-50 p-4 rounded-lg">{error}</p>
                        )}
                        {result && (
                            <div className="prose mt-4" dangerouslySetInnerHTML={{ __html: result }} />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
