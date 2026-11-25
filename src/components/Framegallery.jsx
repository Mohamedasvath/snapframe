
import { useState } from "react";
import { motion } from "motion/react";
import { Sparkles, Star, Check, Camera } from "lucide-react";

const frames = [
  {
    id: 1,
    name: "Little Princess",
    category: "ROYAL LOOK",
    emoji: "👸",
    extra: "👑",
    bg: "from-pink-200 to-rose-100",
    accent: "#E879A5",
    tag: "POPULAR",
  },
  {
    id: 2,
    name: "Superhero Star",
    category: "SUPER FUN",
    emoji: "🦸",
    extra: "⚡",
    bg: "from-sky-200 to-blue-100",
    accent: "#5599D9",
    tag: "COOL",
  },
  {
    id: 3,
    name: "Little Chef",
    category: "YUMMY FUN",
    emoji: "👨‍🍳",
    extra: "🍰",
    bg: "from-amber-200 to-yellow-100",
    accent: "#D99B38",
    tag: "YUMMY",
  },
  {
    id: 4,
    name: "Magic Fairy",
    category: "MAGIC WORLD",
    emoji: "🧚",
    extra: "🪄",
    bg: "from-purple-200 to-violet-100",
    accent: "#9872D5",
    tag: "MAGIC",
  },
  {
    id: 5,
    name: "Space Explorer",
    category: "SPACE FUN",
    emoji: "👨‍🚀",
    extra: "🚀",
    bg: "from-cyan-200 to-teal-100",
    accent: "#379D9C",
    tag: "WOW",
  },
  {
    id: 6,
    name: "Cute Animal",
    category: "ANIMAL WORLD",
    emoji: "🐻",
    extra: "🐰",
    bg: "from-orange-200 to-rose-100",
    accent: "#D98557",
    tag: "CUTE",
  },
  {
    id: 7,
    name: "Little Rockstar",
    category: "MUSIC FUN",
    emoji: "🎸",
    extra: "🎤",
    bg: "from-fuchsia-200 to-pink-100",
    accent: "#D45BAA",
    tag: "NEW",
  },
  {
    id: 8,
    name: "Rainbow Dream",
    category: "HAPPY WORLD",
    emoji: "🦄",
    extra: "🌈",
    bg: "from-indigo-200 to-pink-100",
    accent: "#9876C9",
    tag: "MAGICAL",
  },
];

function FrameArtwork({ frame }) {
  return (
    <div
      className={`relative flex aspect-[4/5] w-full items-center justify-center overflow-hidden rounded-[22px] bg-gradient-to-br ${frame.bg}`}
    >
      {/* Background decorations */}
      <div className="absolute -left-8 -top-8 h-28 w-28 rounded-full bg-white/30" />
      <div className="absolute -bottom-8 -right-8 h-36 w-36 rounded-full bg-white/30" />

      <motion.span
        className="absolute left-[12%] top-[15%] text-2xl"
        animate={{ rotate: [0, 20, -20, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        ✨
      </motion.span>

      <motion.span
        className="absolute right-[12%] top-[23%] text-xl"
        animate={{ y: [0, -7, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        ⭐
      </motion.span>

      <span className="absolute bottom-[15%] left-[13%] text-xl">
        💖
      </span>

      {/* Cartoon portrait area */}
      <div className="relative z-10 flex h-[76%] w-[76%] flex-col items-center justify-center rounded-[45%_45%_35%_35%] border-[5px] border-white/90 bg-white/40 shadow-[0_8px_20px_rgba(100,70,100,0.10)]">
        <span className="absolute -top-5 rounded-full border-2 border-white bg-white px-3 py-1 text-[9px] font-black tracking-widest text-[#8D7180] shadow-sm">
          LITTLE ANGELS
        </span>

        <motion.span
          className="text-[76px] drop-shadow-lg sm:text-[95px]"
          animate={{ y: [0, -6, 0], rotate: [0, 2, -2, 0] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {frame.emoji}
        </motion.span>

        <span className="mt-1 text-3xl drop-shadow-sm">
          {frame.extra}
        </span>

        <div className="absolute -bottom-3 rounded-full border-2 border-white bg-white px-4 py-1.5 text-[9px] font-black tracking-wider text-[#A16B86] shadow-sm">
          PHOTO MAGIC ✨
        </div>
      </div>

      {/* Frame number */}
      <div className="absolute bottom-3 right-3 rounded-full bg-white/80 px-3 py-1 text-[9px] font-black text-[#806B78]">
        FRAME #{String(frame.id).padStart(2, "0")}
      </div>
    </div>
  );
}

export default function FrameGallery() {
  const [selectedFrame, setSelectedFrame] = useState(null);

  return (
    <main className="min-h-screen overflow-hidden bg-[#FFF9ED] px-3 py-8 sm:px-6 sm:py-12">

      {/* Heading */}
      <section className="relative mx-auto mb-9 max-w-3xl text-center sm:mb-12">

        <div className="mb-4 inline-flex items-center gap-2 rounded-full border-2 border-[#F6D88E] bg-[#FFF0C5] px-4 py-2 text-[10px] font-black tracking-wide text-[#A67527] sm:text-xs">
          <Sparkles size={15} />
          WELCOME TO THE MAGIC WORLD
          <Sparkles size={15} />
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-black leading-tight text-[#254D3B] sm:text-5xl"
        >
          Pick Your
          <span className="block text-[#F0789D] sm:inline sm:ml-3">
            Magic Frame!
          </span>
        </motion.h1>

        <p className="mx-auto mt-3 max-w-md text-sm font-semibold leading-6 text-[#987D7D] sm:text-base">
          Choose your favourite character and make a super special memory!
        </p>

        <div className="mt-4 flex justify-center gap-4 text-2xl">
          <span>🌈</span>
          <span>🎈</span>
          <span>🦋</span>
          <span>⭐</span>
        </div>
      </section>

      {/* Gallery */}
      <section className="mx-auto grid max-w-6xl grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">

        {frames.map((frame, index) => {
          const isSelected = selectedFrame === frame.id;

          return (
            <motion.article
              key={frame.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              whileHover={{ y: -6 }}
              className={`relative overflow-hidden rounded-[25px] border-[3px] bg-white p-2.5 shadow-[0_6px_0_#F0DCE2] transition-all sm:rounded-[30px] sm:p-3 ${
                isSelected
                  ? "border-[#F0789D] ring-2 ring-[#F8B9CF]"
                  : "border-white"
              }`}
            >
              {/* Tag */}
              <div
                className="absolute right-3 top-3 z-20 rounded-full px-2.5 py-1 text-[8px] font-black text-white shadow-sm sm:text-[9px]"
                style={{ backgroundColor: frame.accent }}
              >
                {frame.tag}
              </div>

              <FrameArtwork frame={frame} />

              <div className="px-1 pb-2 pt-3 text-center">
                <p
                  className="text-[9px] font-black tracking-widest sm:text-[10px]"
                  style={{ color: frame.accent }}
                >
                  {frame.category}
                </p>

                <h2 className="mt-1 truncate text-sm font-black text-[#354B3C] sm:text-lg">
                  {frame.name}
                </h2>

                <motion.button
                  whileTap={{ scale: 0.93 }}
                  onClick={() => setSelectedFrame(frame.id)}
                  className={`mt-3 flex w-full items-center justify-center gap-1.5 rounded-full px-2 py-3 text-[10px] font-black transition-all sm:text-sm ${
                    isSelected
                      ? "bg-[#65C99A] text-white shadow-[0_4px_0_#399A6B]"
                      : "bg-[#FF83A9] text-white shadow-[0_4px_0_#D95D88] hover:bg-[#F16D99]"
                  }`}
                >
                  {isSelected ? (
                    <>
                      <Check size={15} />
                      Selected!
                    </>
                  ) : (
                    <>
                      <Camera size={15} />
                      Choose Frame
                    </>
                  )}
                </motion.button>
              </div>
            </motion.article>
          );
        })}
      </section>

      {/* Selection message */}
      {selectedFrame && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto mt-8 max-w-md rounded-3xl border-2 border-[#A9E4C3] bg-[#E6F8ED] p-4 text-center"
        >
          <p className="font-black text-[#32855A]">
            🎉 Awesome choice!
          </p>
          <p className="mt-1 text-xs font-semibold text-[#548B6D]">
            {frames.find((f) => f.id === selectedFrame)?.name} selected!
          </p>
          <p className="mt-2 text-[10px] font-bold text-[#548B6D]">
            Camera feature will be connected next.
          </p>
        </motion.div>
      )}

      {/* Footer */}
      <div className="mx-auto mt-10 max-w-md rounded-full border-2 border-dashed border-[#F2C4D2] bg-white/70 px-4 py-3 text-center">
        <p className="text-[10px] font-black text-[#B27D91] sm:text-xs">
          💖 LITTLE ANGELS KIDS FASHION · LET'S MAKE MEMORIES!
        </p>
      </div>

    </main>
  );
}
