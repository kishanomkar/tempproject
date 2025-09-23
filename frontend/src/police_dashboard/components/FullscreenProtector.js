import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function FullscreenProtector({ redirectTo = "/home" }) {
  const navigate = useNavigate();

  useEffect(() => {
    // enter fullscreen
    const enterFullscreen = () => {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      }
    };

    enterFullscreen();

    // handle fullscreen exit
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        navigate(redirectTo);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [navigate, redirectTo]);

  return null; 
}
