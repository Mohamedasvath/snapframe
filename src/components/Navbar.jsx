import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Camera, Sparkles } from "lucide-react";

const logoLetters = [
  { char: "S", color: "#FF3366" }, // Pink
  { char: "N", color: "#0066CC" }, // Blue
  { char: "A", color: "#FFB800" }, // Yellow
  { char: "P", color: "#22C55E" }, // Green
  { char: "F", color: "#06B6D4" }, // Cyan
  { char: "R", color: "#FF6B00" }, // Orange
  { char: "A", color: "#A855F7" }, // Purple
  { char: "M", color: "#22C55E" }, // Green
  { char: "E", color: "#FF3366" }, // Pink
];

export default function Navbar() {
  return (
    <header className="relative z-50 w-full px-3 pt-3 sm:px-6 sm:pt-5 select-none">
      {/* Clean 3D Kids Font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Titan+One&family=Fredoka:wght@700;800&display=swap');
        
        .font-kids-title {
          font-family: 'Titan One', cursive;
          -webkit-text-stroke: 1.8px #000000;
          paint-order: stroke fill;
          text-shadow: 0px 3px 0px #000000;
        }

        @media (min-width: 640px) {
          .font-kids-title {
            -webkit-text-stroke: 2.5px #000000;
            text-shadow: 0px 4px 0px #000000;
          }
        }

        .font-kids-badge {
          font-family: 'Fredoka', sans-serif;
        }
      `}</style>

      {/* Sleek Pill Navbar matching the 'Retake' button aesthetic */}
      <motion.nav
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 240, damping: 20 }}
        className="
          relative mx-auto flex max-w-[1050px]
          items-center justify-between
          rounded-full border-[3px] sm:border-[3.5px] border-black
          bg-white px-3 py-2 sm:px-6 sm:py-3
          shadow-[0_5px_0_#000] sm:shadow-[0_7px_0_#000]
        "
      >
        {/* Left: Cute Camera Icon + Clean Bouncing SNAPFRAME Text */}
        <Link
          to="/camera"
          className="flex items-center gap-2 sm:gap-3.5"
        >
          {/* Compact Yellow Camera Badge */}
          <motion.div
            whileHover={{ rotate: -10, scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            className="
              flex h-10 w-10 sm:h-12 sm:w-12 shrink-0
              items-center justify-center
              rounded-full border-[2.5px] sm:border-[3px] border-black
              bg-[#FFD400]
              shadow-[0_3px_0_#000]
            "
          >
            <Camera className="h-5 w-5 sm:h-6 sm:w-6 text-black" strokeWidth={2.8} />
          </motion.div>

          {/* Brand Name & Subtitle */}
          <div className="flex flex-col">
            <div className="flex items-center leading-none">
              {logoLetters.map((item, index) => (
                <motion.span
                  key={index}
                  animate={{ y: [0, -3, 0] }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    delay: index * 0.08,
                    ease: "easeInOut",
                  }}
                  whileHover={{ y: -6, scale: 1.15 }}
                  style={{ color: item.color }}
                  className="
                    font-kids-title inline-block
                    text-[20px] xs:text-[22px] sm:text-[30px] md:text-[34px]
                    tracking-tight
                  "
                >
                  {item.char}
                </motion.span>
              ))}
            </div>

            {/* Clean Subtitle without cramped borders */}
            <span className="font-kids-badge mt-0.5 text-[8px] sm:text-[10px] font-extrabold tracking-wider text-gray-600">
              
            </span>
          </div>
        </Link>

        {/* Right: Fun Kids Pill Badge (Fits 320px cleanly & expands on Desktop) */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="
            font-kids-badge
            flex items-center gap-1 sm:gap-1.5
            rounded-full border-[2.5px] border-black
            bg-[#FF3366] px-2.5 py-1 sm:px-4 sm:py-1.5
            text-[10px] sm:text-xs font-extrabold text-white
            shadow-[0_3px_0_#000]
          "
        >
          <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 fill-[#FFD400] text-[#FFD400]" />
          <span className="hidden xs:inline">SMILE!</span>
          <span>📸</span>
        </motion.div>
      </motion.nav>
    </header>
  );
}