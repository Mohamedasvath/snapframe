import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Home, Download, Camera, CheckCircle2 } from "lucide-react";

export default function PhotoPreview() {
  const location = useLocation();
  const navigate = useNavigate();

  const [photo] = useState(
    () => location.state?.photo || sessionStorage.getItem("capturedPhoto") || ""
  );
  const [savedToast, setSavedToast] = useState(false);

  useEffect(() => {
    if (!photo) {
      navigate("/camera", { replace: true });
    }
  }, [photo, navigate]);

  if (!photo) return null;

  function triggerDownload() {
    const link = document.createElement("a");
    link.href = photo;
    link.download = `MeeLaban-Moment-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function handleDownload() {
    triggerDownload();
    setSavedToast(true);
    setTimeout(() => {
      navigate("/thank-you");
    }, 1100);
  }

  async function handleSocialShare(platform) {
    try {
      const response = await fetch(photo);
      const blob = await response.blob();
      const file = new File([blob], "MeeLaban-Photo.jpg", { type: "image/jpeg" });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "Mee Laban Photo Booth",
          text: "Capture the Moment, Keep the Memory! #MeeLaban",
        });
        navigate("/thank-you");
        return;
      }
    } catch (err) {
      console.warn("Native share skipped:", err);
    }

    // Desktop / non-WebShare fallback: Save file first & open app
    triggerDownload();
    setSavedToast(true);

    setTimeout(() => {
      if (platform === "whatsapp") {
        window.open(
          `https://wa.me/?text=${encodeURIComponent("Check out my Mee Laban Photo Booth memory! #MeeLaban")}`,
          "_blank"
        );
      }
      navigate("/thank-you");
    }, 1000);
  }

  return (
    <main className="relative min-h-[100svh] w-full flex justify-center bg-[radial-gradient(circle_at_50%_25%,#FFFFFF_0%,#FFFDF7_60%,#EEF5FF_100%)] text-[#0B192C] overflow-hidden">
      {/* Saved Toast Notification */}
      <AnimatePresence>
        {savedToast && (
          <motion.div
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -40, opacity: 0 }}
            className="fixed top-5 z-50 flex items-center gap-2 rounded-full bg-[#0056D6] px-5 py-2.5 text-xs font-display font-bold text-white shadow-xl"
          >
            <CheckCircle2 size={16} className="text-[#FFC700]" />
            <span>Photo Saved! Redirecting...</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative flex w-full max-w-[460px] flex-col justify-between px-5 pt-5 pb-24">
        {/* TOP NAV */}
        <header className="relative z-20 flex items-center justify-between">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate("/camera")}
            aria-label="Back to Camera"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-[#0056D6] shadow-sm hover:bg-blue-50 transition cursor-pointer"
          >
            <ArrowLeft size={22} strokeWidth={2.5} />
          </motion.button>

          <span className="font-display font-bold text-xs uppercase tracking-widest text-[#0056D6]/70">
            Mee Laban Booth
          </span>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate("/")}
            aria-label="Go Home"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-[#0056D6] shadow-sm hover:bg-blue-50 transition cursor-pointer"
          >
            <Home size={21} strokeWidth={2.3} />
          </motion.button>
        </header>

        {/* TILTED POLAROID SHOWCASE CARD */}
        <section className="relative z-20 mx-auto mt-3 w-full max-w-[300px]">
          {/* Yellow Sparkle Rays Top-Left */}
          <motion.svg
            animate={{ scale: [1, 1.15, 1], rotate: [-4, 4, -4] }}
            transition={{ duration: 2.8, repeat: Infinity }}
            className="absolute -left-7 -top-4 w-9 h-9"
            viewBox="0 0 40 40"
            fill="none"
          >
            <path d="M32 10L16 6M30 20L10 22M32 30L16 36" stroke="#FFC700" strokeWidth="4.5" strokeLinecap="round" />
          </motion.svg>

          {/* Blue Doodle Heart Top-Right */}
          <motion.svg
            animate={{ y: [0, -6, 0], rotate: [6, 12, 6] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute -right-7 top-3 w-12 h-12"
            viewBox="0 0 70 70"
            fill="none"
          >
            <path
              d="M35 58C35 58 10 42 10 24C10 15 17 9 25 9C30 9 34 12 35 16C36 12 40 9 45 9C53 9 60 15 60 24C60 42 35 58 35 58Z"
              stroke="#0056D6"
              strokeWidth="4.5"
              fill="white"
            />
          </motion.svg>

          <motion.div
            initial={{ scale: 0.82, rotate: -10, y: 20, opacity: 0 }}
            animate={{ scale: 1, rotate: -3, y: 0, opacity: 1 }}
            whileHover={{ rotate: 0, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 210, damping: 17 }}
            className="bg-white p-3 pb-4 rounded-2xl shadow-[0_22px_50px_rgba(0,55,140,0.2)] border-2 border-white"
          >
            <div className="overflow-hidden rounded-xl bg-blue-50 shadow-inner">
              <img
                src={photo}
                alt="Your Mee Laban Snap"
                className="w-full h-auto max-h-[285px] object-contain mx-auto"
              />
            </div>

            <div className="mt-2.5 flex items-center justify-between px-1.5">
              <span className="font-script font-bold text-xl text-[#0056D6]">
                Sweet Memories ✨
              </span>
              <span className="rounded-full bg-[#0056D6] px-2.5 py-0.5 font-display text-[10px] font-bold tracking-wider text-white">
                Mee LABAN
              </span>
            </div>
          </motion.div>
        </section>

        {/* HEADING + SHARE TILES + RETAKE BUTTON */}
        <motion.section
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="relative z-20 mt-4 text-center"
        >
          <h1 className="font-script font-bold text-5xl text-[#0056D6] -rotate-2 leading-[0.92]">
            Your Photo
            <br />
            is Ready!
          </h1>
          <svg className="w-44 h-3 mx-auto mt-1" viewBox="0 0 220 14" fill="none">
            <path d="M6 9C65 3 155 3 214 9" stroke="#FFC700" strokeWidth="5" strokeLinecap="round" />
          </svg>

          <p className="mt-2 text-xs sm:text-sm font-bold text-[#1E3A6D]">
            Share the fun with your friends <span className="text-[#0056D6]">♡</span>
          </p>

          {/* 3 Share Cards */}
          <div className="mt-3.5 grid grid-cols-3 gap-3 max-w-[330px] mx-auto">
            <motion.button
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => handleSocialShare("instagram")}
              className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-white py-3.5 px-2 shadow-[0_10px_24px_rgba(0,55,140,0.09)] border border-blue-100/70 cursor-pointer"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white shadow-sm">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
                </svg>
              </div>
              <span className="text-[11px] font-bold text-[#0B192C]">Instagram</span>
            </motion.button>

            <motion.button
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => handleSocialShare("whatsapp")}
              className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-white py-3.5 px-2 shadow-[0_10px_24px_rgba(0,55,140,0.09)] border border-blue-100/70 cursor-pointer"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#25D366] text-white shadow-sm">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.03 2C6.5 2 2.02 6.48 2.02 12c0 1.77.46 3.49 1.34 5.01L2 22l5.13-1.34A9.94 9.94 0 0 0 12.03 22c5.52 0 10-4.48 10-10s-4.48-10-10-10zm5.82 14.13c-.24.68-1.41 1.3-1.95 1.38-.5.08-1.13.11-1.82-.11-.42-.13-.96-.31-1.65-.61-2.9-1.25-4.79-4.18-4.94-4.37-.14-.19-1.18-1.57-1.18-3 0-1.43.75-2.13 1.02-2.42.27-.29.59-.36.79-.36.2 0 .39 0 .56.01.18.01.42-.07.66.5.24.58.83 2.02.9 2.17.07.15.12.32.02.51-.1.19-.15.32-.29.49-.15.17-.31.38-.44.51-.15.15-.3.31-.13.61.17.29.76 1.25 1.63 2.03 1.12 1 2.07 1.31 2.36 1.46.29.15.46.12.63-.07.17-.19.73-.85.93-1.15.2-.29.39-.24.66-.15.27.1 1.71.81 2 .95.29.15.49.22.56.34.07.12.07.7-.17 1.38z" />
                </svg>
              </div>
              <span className="text-[11px] font-bold text-[#0B192C]">WhatsApp</span>
            </motion.button>

            <motion.button
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.94 }}
              onClick={handleDownload}
              className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-white py-3.5 px-2 shadow-[0_10px_24px_rgba(0,55,140,0.09)] border border-blue-100/70 cursor-pointer"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0056D6] text-white shadow-sm">
                <Download size={22} strokeWidth={2.5} />
              </div>
              <span className="text-[11px] font-bold text-[#0B192C]">Download</span>
            </motion.button>
          </div>

          {/* Take Another Photo Button */}
          <div className="mt-4 max-w-[330px] mx-auto">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/camera")}
              className="w-full py-3 rounded-full bg-white border-2 border-[#0056D6]/25 hover:border-[#0056D6] text-[#0056D6] font-display font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
            >
              <Camera size={18} />
              <span>Take Another Photo</span>
            </motion.button>
          </div>
        </motion.section>

        {/* Bottom Poster Dessert Images (from public/) */}
        <img
          src="/images/cup-left.png"
          alt=""
          onError={(e) => (e.currentTarget.style.display = "none")}
          className="pointer-events-none absolute bottom-2 left-2 z-20 w-24 h-auto object-contain"
        />
        <img
          src="/images/dessert-right.png"
          alt=""
          onError={(e) => (e.currentTarget.style.display = "none")}
          className="pointer-events-none absolute bottom-2 right-2 z-20 w-24 h-auto object-contain"
        />

        {/* Bottom Milk Splash */}
        <svg
          className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 w-full h-14"
          viewBox="0 0 460 60"
          preserveAspectRatio="none"
        >
          <path fill="#0056D6" d="M0,25 C120,55 260,5 460,30 L460,60 L0,60 Z" />
          <path fill="#FFFFFF" opacity="0.88" d="M0,42 C150,20 300,52 460,36 L460,60 L0,60 Z" />
        </svg>
      </div>
    </main>
  );
}