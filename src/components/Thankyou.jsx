import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Check, Home, Camera } from "lucide-react";

export default function ThankYou() {
  const navigate = useNavigate();

  return (
    <main className="relative min-h-[100svh] w-full flex justify-center bg-[radial-gradient(circle_at_50%_35%,#FFFFFF_0%,#FFFDF7_65%,#EEF5FF_100%)] text-[#0B192C] overflow-hidden">
      <div className="relative flex w-full max-w-[460px] flex-col items-center justify-between px-6 pt-12 pb-12 text-center">
        {/* Top-Left Royal Blue & Cream Milk Corner */}
        <svg className="pointer-events-none absolute top-0 left-0 w-48 h-auto z-0" viewBox="0 0 220 180" fill="none">
          <path d="M0 0H180C148 35 104 22 74 58C45 92 30 138 0 160V0Z" fill="#0056D6" />
          <path d="M0 95C30 82 55 98 76 80C97 62 92 28 122 15L145 0H90L0 80V95Z" fill="#EBF3FF" />
        </svg>

        {/* Animated Checkmark Circle + Golden Rays */}
        <motion.div
          initial={{ scale: 0.4, rotate: -15, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 240, damping: 15 }}
          className="relative z-10 mt-2"
        >
          <motion.svg
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 2.2, repeat: Infinity }}
            className="w-9 h-9 absolute -left-11 top-3"
            viewBox="0 0 40 40"
            fill="none"
          >
            <path d="M32 10L16 6M30 20L10 22M32 30L16 36" stroke="#FFC700" strokeWidth="4.5" strokeLinecap="round" />
          </motion.svg>

          <motion.svg
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, delay: 0.3 }}
            className="w-9 h-9 absolute -right-11 top-3"
            viewBox="0 0 40 40"
            fill="none"
          >
            <path d="M8 10L24 6M10 20L30 22M8 30L24 36" stroke="#FFC700" strokeWidth="4.5" strokeLinecap="round" />
          </motion.svg>

          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-b from-[#0A66FF] to-[#0047B3] text-white shadow-[0_14px_30px_rgba(0,86,214,0.38)] ring-4 ring-white">
            <Check size={42} strokeWidth={3.5} />
          </div>
        </motion.div>

        {/* Thank You Script Title */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="relative z-10 mt-3"
        >
          <h1 className="font-script font-bold text-6xl text-[#0056D6] -rotate-3 leading-none drop-shadow-[0_2px_0_#FFFFFF]">
            Thank You!
          </h1>
          <svg className="w-48 h-3 mx-auto mt-1" viewBox="0 0 220 14" fill="none">
            <path d="M6 9C65 3 155 3 214 9" stroke="#FFC700" strokeWidth="5.5" strokeLinecap="round" />
          </svg>
          <p className="mt-2.5 text-sm sm:text-base font-bold text-[#0044AA] leading-snug">
            for being a part of
            <br />
            our memories <span className="text-[#0056D6]">♡</span>
          </p>
        </motion.div>

        {/* Center Floating Dessert Cup + Blue Check Doodle */}
        <div className="relative z-10 my-2 flex items-center justify-center">
          {/* Decorative Blue Tick Doodle on Right */}
          <motion.svg
            animate={{ y: [0, -6, 0], rotate: [8, 16, 8] }}
            transition={{ duration: 2.8, repeat: Infinity }}
            className="w-9 h-9 absolute -right-8 top-4 text-[#0056D6]"
            viewBox="0 0 40 40"
            fill="none"
          >
            <path d="M8 21L17 30L33 10" stroke="#0056D6" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          </motion.svg>

          <motion.img
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            src="/images/cup-center.png"
            alt="Mee Laban Dessert Cup"
            onError={(e) => (e.currentTarget.style.display = "none")}
            className="w-44 h-44 object-contain drop-shadow-[0_18px_28px_rgba(0,55,140,0.18)]"
          />
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="relative z-10 w-full max-w-[270px] space-y-2.5"
        >
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate("/")}
            className="btn-laban w-full py-3.5 rounded-full text-white font-display font-bold text-base flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <Home size={19} strokeWidth={2.5} />
            <span>Back to Home</span>
          </motion.button>

          <button
            onClick={() => navigate("/camera")}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0056D6]/80 hover:text-[#0056D6] transition cursor-pointer"
          >
            <Camera size={14} />
            <span>Take Another Snap</span>
          </button>
        </motion.div>

        {/* Bottom Cloud Logo + See you soon! */}
        <div className="relative z-10 mt-4 flex flex-col items-center">
          <div className="relative inline-flex items-center justify-center">
            <svg className="w-32 h-auto drop-shadow-md" viewBox="0 0 320 150" fill="none">
              <path d="M58 42C48 25 36 16 32 22C28 28 38 45 50 52C55 55 61 48 58 42Z" fill="#FFC700" />
              <path d="M262 42C272 25 284 16 288 22C292 28 282 45 270 52C265 55 259 48 262 42Z" fill="#FFC700" />
              <path
                d="M160 12C126 12 104 30 99 48C74 52 58 70 58 90C58 116 86 135 160 135C234 135 262 116 262 90C262 70 246 52 221 48C216 30 194 12 160 12Z"
                fill="white"
              />
              <path
                d="M160 18C130 18 110 34 105 52C82 55 66 71 66 89C66 112 92 128 160 128C228 128 254 112 254 89C254 71 238 55 215 52C210 34 190 18 160 18Z"
                fill="#0056D6"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center pt-1 text-white">
              <span className="font-display font-bold text-sm leading-none">Mee</span>
              <span className="font-display font-bold text-sm tracking-wider leading-none -mt-0.5">LABAN</span>
            </div>
          </div>

          <p className="mt-1 font-script font-bold text-2xl text-[#0056D6]">
            See you soon! <span className="text-[#0056D6]">♡</span>
          </p>
        </div>

        {/* Bottom Milk Wave */}
        <svg
          className="pointer-events-none absolute bottom-0 left-0 right-0 z-0 w-full h-14"
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