import { useEffect } from "react";



export default function ScreenshotProtector() {
  useEffect(() => {
    const handleKeyUp = (e) => {
      if (e.key === "PrintScreen") {
        navigator.clipboard.writeText(""); // overwrite clipboard
        alert("Screenshots are disabled on this page!");
      }
    };

    document.addEventListener("keyup", handleKeyUp);
    return () => document.removeEventListener("keyup", handleKeyUp);
  }, []);

  return null;
}