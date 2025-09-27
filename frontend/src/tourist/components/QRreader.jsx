import { Html5QrcodeScanner } from "html5-qrcode";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { processKeyword } from "./SecretIdGenerator";
import { getSecretId } from "./SecretIdGenerator";

// Global variable to store scanned data
export let scanned_data = null;

const qrcodeRegionId = "html5qr-code-full-region";

// Creates the configuration object for Html5QrcodeScanner.
const createConfig = ({ fps, qrbox, aspectRatio, disableFlip }) => {
    let config = {};
    if (fps) config.fps = fps;
    if (qrbox) config.qrbox = qrbox;
    if (aspectRatio) config.aspectRatio = aspectRatio;
    if (disableFlip !== undefined) config.disableFlip = disableFlip;
    return config;
};

const Html5QrcodePlugin = ({
    fps,
    qrbox,
    aspectRatio,
    disableFlip,
    verbose,
    qrCodeSuccessCallback,
    qrCodeErrorCallback,
    setScannerInstance,
}) => {
    const startScanner = () => {
        const config = createConfig({ fps, qrbox, aspectRatio, disableFlip });
        const isVerbose = verbose === true;

        const html5QrcodeScanner = new Html5QrcodeScanner(
            qrcodeRegionId,
            config,
            isVerbose
        );
        setScannerInstance(html5QrcodeScanner); // Store scanner instance
        html5QrcodeScanner.render(qrCodeSuccessCallback, qrCodeErrorCallback);
    };

    return (
        <div className="flex flex-col items-center space-y-4">

            <div
                id={qrcodeRegionId}
                className="w-72 h-72  rounded-lg shadow-lg"
            />
            <button
                onClick={startScanner}
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
            >
                Scan a QR
            </button>
        </div>
    );
};

const QRCamera = () => {
    const [result, setResult] = useState("No QR scanned yet");
    const scannerRef = useRef(null);
    const navigate = useNavigate();

    const sendScannedDataToBackend = async (data) => {
        try {
            const response = await fetch("http://localhost:3000/your-endpoint", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(data),
            });
            const resData = await response.json();
            if (response.ok) {
                console.log("Data sent successfully:", resData);
            } else {
                console.error("Error from server:", resData.message || "Unknown error");
            }
        } catch (error) {
            console.error("Failed to send scanned data:", error);
        }
    };

    const onNewScanResult = (decodedText, decodedResult) => {
        try {
            scanned_data = JSON.parse(decodedText);
            console.log("Scanned Data:", scanned_data);

            // ✅ Check if keyword matches "hellow"
            const id = processKeyword(scanned_data.keyword); // assuming QR JSON has { "keyword": "hellow" }
            if (id) {
                console.log("Use this Secret ID:", id);
                setResult("✅ Secret ID generated! Check console.");
                // Navigate to /diversion if secret id exists
                navigate("/diversion");
            } else {
                setResult("⚠️ Keyword not valid, no ID generated.");
            }

            // Send data to backend
            sendScannedDataToBackend(scanned_data);

            // Stop the scanner after scanning
            if (scannerRef.current) {
                scannerRef.current.clear().catch((err) => {
                    console.error("Failed to clear scanner:", err);
                });
            }
        } catch (e) {
            scanned_data = { error: "Invalid QR format", text: decodedText };
            console.error("Failed to parse QR data:", e);
            setResult("⚠️ Scanned, but invalid JSON format.");

            if (scannerRef.current) {
                scannerRef.current.clear().catch((err) => {
                    console.error("Failed to clear scanner:", err);
                });
            }
        }
    };

    const onScanError = (error) => {
        console.warn("QR Scan error:", error);
    };

    const setScannerInstance = (scanner) => {
        scannerRef.current = scanner;
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-6">
            <h1 className="text-3xl font-bold text-blue-600 mb-6">QR Code Scanner</h1>
            <Html5QrcodePlugin
                fps={10}
                qrbox={250}
                disableFlip={false}
                verbose={false}
                qrCodeSuccessCallback={onNewScanResult}
                qrCodeErrorCallback={onScanError}
                setScannerInstance={setScannerInstance}
            />
        </div>
    );
};

export default QRCamera;
