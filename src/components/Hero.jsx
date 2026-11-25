import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Camera,
  ArrowRight,
  Sparkles,
  Heart,
  Crown,
  QrCode,
  MapPin,
  Clock,
  Star
} from 'lucide-react';
import QR from '../../public/QR.jpeg'

gsap.registerPlugin(ScrollTrigger);

/* --- Custom SVG Doodles matching Reference Image --- */
const MeeLabanLogo = () => (
  <div className="relative inline-flex items-center justify-center select-none">
    <svg className="w-60 sm:w-72 h-auto drop-shadow-[0_10px_20px_rgba(0,82,212,0.22)]" viewBox="0 0 320 150" fill="none">
      <path d="M58 42C48 25 36 16 32 22C28 28 38 45 50 52C55 55 61 48 58 42Z" fill="#FFC700" />
      <path d="M35 65C22 60 8 62 8 68C8 74 22 76 34 73C39 72 40 67 35 65Z" stroke="#0044AA" strokeWidth="2.5" fill="white" />
      <path d="M262 42C272 25 284 16 288 22C292 28 282 45 270 52C265 55 259 48 262 42Z" fill="#FFC700" />
      <path d="M285 65C298 60 312 62 312 68C312 74 298 76 286 73C281 72 280 67 285 65Z" stroke="#0044AA" strokeWidth="2.5" fill="white" />
      <path
        d="M160 12C126 12 104 30 99 48C74 52 58 70 58 90C58 116 86 135 160 135C234 135 262 116 262 90C262 70 246 52 221 48C216 30 194 12 160 12Z"
        fill="white"
      />
      <path
        d="M160 18C130 18 110 34 105 52C82 55 66 71 66 89C66 112 92 128 160 128C228 128 254 112 254 89C254 71 238 55 215 52C210 34 190 18 160 18Z"
        fill="#0056D6"
      />
    </svg>
    <div className="absolute inset-0 flex flex-col items-center justify-center pt-3 text-white">
      <span className="font-display font-bold text-3xl sm:text-4xl tracking-tight leading-none">Mee</span>
      <span className="font-display font-bold text-3xl sm:text-4xl tracking-wider leading-none -mt-1">LABAN</span>
    </div>
  </div>
);

const DoodleCamera = ({ className }) => (
  <svg className={className} viewBox="0 0 90 80" fill="none">
    <path d="M62 14L68 6M72 20L82 16M52 12L53 3" stroke="#0056D6" strokeWidth="4" strokeLinecap="round" />
    <g transform="rotate(-14 45 45)">
      <rect x="12" y="24" width="64" height="44" rx="10" stroke="#0056D6" strokeWidth="4.5" fill="white" />
      <path d="M28 24L33 15H55L60 24" stroke="#0056D6" strokeWidth="4.5" strokeLinejoin="round" fill="white" />
      <circle cx="44" cy="46" r="12" stroke="#0056D6" strokeWidth="4.5" />
      <circle cx="44" cy="46" r="4" fill="#0056D6" />
      <circle cx="64" cy="34" r="2.5" fill="#0056D6" />
    </g>
  </svg>
);

const DoodleHeart = ({ className }) => (
  <svg className={className} viewBox="0 0 70 70" fill="none">
    <path
      d="M35 58C35 58 10 42 10 24C10 15 17 9 25 9C30 9 34 12 35 16C36 12 40 9 45 9C53 9 60 15 60 24C60 42 35 58 35 58Z"
      stroke="#0056D6"
      strokeWidth="4.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="white"
    />
  </svg>
);

const DoodleCrown = ({ className }) => (
  <svg className={className} viewBox="0 0 80 60" fill="none">
    <path
      d="M12 46L8 18L27 30L40 10L53 30L72 18L68 46H12Z"
      stroke="#FFC700"
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="#FFFDF7"
    />
  </svg>
);

const MilkSplashDecor = () => (
  <>
    <svg className="pointer-events-none absolute top-0 left-0 w-44 sm:w-64 h-auto z-0" viewBox="0 0 260 220" fill="none">
      <path d="M0 0H210C180 40 130 25 95 65C60 105 40 160 0 185V0Z" fill="#0056D6" />
      <path d="M0 110C35 95 65 115 90 95C115 75 110 35 145 20C165 12 185 15 200 0H120C90 35 55 30 25 65L0 95V110Z" fill="#EBF3FF" />
    </svg>
    <svg className="pointer-events-none absolute top-[45%] -left-6 w-36 sm:w-52 h-auto z-0" viewBox="0 0 200 320" fill="none">
      <path d="M0 20C45 65 75 135 55 200C38 255 15 280 0 300V20Z" fill="#0056D6" />
      <path d="M0 175C40 190 85 180 110 215C130 242 95 270 125 290C145 302 175 285 185 305H0V175Z" fill="#F2F7FF" />
    </svg>
    <svg className="pointer-events-none absolute bottom-0 right-0 w-56 sm:w-80 h-auto z-0" viewBox="0 0 320 260" fill="none">
      <path d="M320 40C260 65 245 125 190 155C135 185 65 180 20 260H320V40Z" fill="#0056D6" />
      <path d="M320 95C275 100 265 145 225 160C185 175 165 140 140 165C115 190 130 230 95 260H320V95Z" fill="#FFFFFF" />
    </svg>
  </>
);

const Hero = ({ children }) => {
  const mainRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hero-stagger', {
        y: 35,
        opacity: 0,
        duration: 0.85,
        stagger: 0.12,
        ease: 'back.out(1.4)'
      });

      gsap.to('.float-slow', {
        y: -12,
        rotation: 4,
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

      gsap.to('.float-reverse', {
        y: 10,
        rotation: -5,
        duration: 3.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

      gsap.utils.toArray('.reveal-card').forEach((card, i) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: 'top 86%',
            toggleActions: 'play none none reverse'
          },
          y: 40,
          opacity: 0,
          duration: 0.7,
          delay: (i % 3) * 0.1,
          ease: 'power3.out'
        });
      });
    }, mainRef);

    return () => ctx.revert();
  }, []);

  const steps = [
    {
      num: '01',
      title: 'Grab Your order',
      desc: 'Pick your favorite Egyptian cream cup — Salankatia, Qashtuta, or Loaded Nutella Pistachio.',
      badge: 'Sweet Start',
      color: 'bg-[#0056D6] text-white'
    },
    {
      num: '02',
      title: 'Step Into The Booth',
      desc: 'Gather your squad in front of our studio-lit Mee Laban booth with fun dessert frames.',
      badge: 'Strike a Pose',
      color: 'bg-[#FFC700] text-[#0B192C]'
    },
    {
      num: '03',
      title: 'Share Your memories',
      desc: 'Get a custom-branded glossy Polaroid strip plus instant HD download on your phone.',
      badge: 'Keep Forever',
      color: 'bg-[#0056D6] text-white'
    }
  ];

  const menuCombos = [
    {
      name: 'Nutella Pistachio Salankatia',
      tag: 'Bestseller + 2 Prints',
      price: '₹349',
      desc: 'Rich milk cake soaked in sweet cream, topped with roasted pistachio drizzle & Nutella.',
      img: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=600&q=80'
    },
    {
      name: '3-in-1 Royal Qashtuta',
      tag: 'Squad Pack + 4 Prints',
      price: '₹449',
      desc: 'Velvety clotted cream layered with mango, Lotus Biscoff crunch, and honey glaze.',
      img: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=600&q=80'
    },
    {
      name: 'De Paris Choco Bomb',
      tag: 'Couple Special + Strip',
      price: '₹390',
      desc: 'Warm Belgian chocolate poured tableside over soft sponge and signature cold laban.',
      img: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80'
    }
  ];

  const gallerySnaps = [
    {
      caption: 'Late night squad run!',
      tag: '@arjun.vibe',
      rotate: '-rotate-3',
      img: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=600&q=80'
    },
    {
      caption: 'Qashtuta + Besties = ❤️',
      tag: '@priya_diaries',
      rotate: 'rotate-2',
      img: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=600&q=80'
    },
    {
      caption: 'Post-movie sweet stop',
      tag: '@karthik.clicks',
      rotate: '-rotate-2',
      img: 'https://images.unsplash.com/photo-1543807535-eceef0bc6599?auto=format&fit=crop&w=600&q=80'
    },
    {
      caption: 'Mee Laban forever mood',
      tag: '@sneha.creates',
      rotate: 'rotate-3',
      img: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=600&q=80'
    }
  ];

  return (
    <div ref={mainRef} className="min-h-screen bg-[#FFFDF7] text-[#0B192C] selection:bg-[#0056D6] selection:text-white">
      {/* =========================================================
          SECTION 1: EXACT HERO SECTION
      ========================================================= */}
      <section className="relative min-h-screen flex flex-col items-center justify-between pt-6 pb-14 px-4 sm:px-8 overflow-hidden bg-[radial-gradient(circle_at_50%_40%,#FFFFFF_0%,#FFF9EC_65%,#F4F8FF_100%)]">
        <MilkSplashDecor />

        <motion.header
          initial={{ scale: 0.7, opacity: 0, y: -20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 220, damping: 16 }}
          className="relative z-10 mt-1"
        >
          <MeeLabanLogo />
        </motion.header>

        <div className="relative z-10 max-w-2xl w-full mx-auto text-center my-4 sm:my-6">
          <div className="float-slow hidden sm:block absolute -left-10 lg:-left-20 -top-8">
            <DoodleCamera className="w-20 h-20" />
          </div>
          <div className="float-slow sm:hidden absolute left-1 -top-10">
            <DoodleCamera className="w-14 h-14" />
          </div>

          <div className="float-reverse hidden sm:block absolute -right-8 lg:-right-16 -top-6">
            <DoodleHeart className="w-16 h-16" />
          </div>
          <div className="float-reverse sm:hidden absolute right-2 -top-8">
            <DoodleHeart className="w-12 h-12" />
          </div>

          <div className="hero-stagger relative inline-block -rotate-6">
            <svg className="w-8 h-8 absolute -right-8 -top-2 text-[#FFC700]" viewBox="0 0 40 40" fill="none">
              <path d="M6 16L22 10M8 25L26 24M6 34L20 36" stroke="#FFC700" strokeWidth="4.5" strokeLinecap="round" />
            </svg>
            <h1 className="font-script font-bold text-6xl sm:text-7xl md:text-8xl text-[#0056D6] leading-[0.88] tracking-tight drop-shadow-[0_3px_0_rgba(255,255,255,1)]">
              Capture
              <br />
              the Moment
            </h1>
            <svg className="w-9 h-9 absolute -left-10 bottom-0 text-[#FFC700]" viewBox="0 0 40 40" fill="none">
              <path d="M32 10L16 6M30 20L10 22M32 30L16 36" stroke="#FFC700" strokeWidth="4.5" strokeLinecap="round" />
            </svg>
          </div>

          <div className="hero-stagger mt-3 -rotate-3">
            <h2 className="font-script font-bold text-3xl sm:text-4xl md:text-5xl text-[#0044AA] inline-block relative">
              Keep the Memory
              <svg className="w-full h-4 -mt-1" viewBox="0 0 260 18" fill="none" preserveAspectRatio="none">
                <path d="M6 12C75 4 185 3 254 10" stroke="#FFC700" strokeWidth="5.5" strokeLinecap="round" />
                <path d="M45 15C110 10 175 10 220 13" stroke="#0044AA" strokeWidth="2" strokeLinecap="round" opacity="0.45" />
              </svg>
            </h2>
          </div>

          <p className="hero-stagger mt-3 text-sm sm:text-base md:text-lg font-semibold text-[#1E3A6D] max-w-md mx-auto leading-snug">
            Step into our Photo Booth and create unforgettable memories!
          </p>

          {/* Start Now -> Navigates to /camera */}
          <div className="hero-stagger mt-6">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => navigate('/camera')}
              className="btn-laban inline-flex items-center gap-3 px-8 py-3.5 rounded-full text-white font-display font-semibold text-lg sm:text-xl tracking-wide cursor-pointer"
            >
              <span className="bg-white text-[#0056D6] p-1.5 rounded-lg">
                <Camera className="w-5 h-5 stroke-[2.5]" />
              </span>
              <span>Start Now</span>
              <ArrowRight className="w-5 h-5 stroke-[2.5]" />
            </motion.button>
          </div>
        </div>

        {/* Bottom Tilted Polaroid Card */}
        <div className="hero-stagger relative z-10 w-full max-w-md sm:max-w-lg mx-auto mt-4">
          <motion.div
            animate={{ rotate: [10, 18, 10], y: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-8 right-3 sm:right-5 z-20"
          >
            <DoodleCrown className="w-16 h-12 sm:w-20 sm:h-14 drop-shadow-sm" />
          </motion.div>

          <motion.div
            whileHover={{ rotate: 0, scale: 1.02 }}
            onClick={() => navigate('/camera')}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="-rotate-3 bg-white p-3 sm:p-4 pb-6 sm:pb-8 rounded-2xl shadow-[0_22px_50px_rgba(0,45,120,0.22)] border-2 border-white cursor-pointer"
          >
            <div className="relative aspect-[16/11] w-full overflow-hidden rounded-xl bg-blue-100">
              <img
                src={QR}
                alt="Friends smiling at Mee Laban Photo Booth"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2.5 right-2.5 bg-[#0056D6]/90 backdrop-blur-sm text-white text-xs font-display px-3 py-1 rounded-full flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-[#FFC700]" />
                <span>Mee Laban Booth</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -bottom-5 -left-2 sm:-left-8 z-20 bg-white p-1.5 rounded-2xl shadow-xl border-2 border-[#0056D6]/15 flex items-center gap-2.5 pr-3.5"
          >
           
            <div>
             
            </div>
          </motion.div>
        </div>
      </section>

      {/* Optional injected FrameGallery slot if you want it right below Hero */}
      {children}

      {/* =========================================================
          SECTION 2: HOW THE PHOTO BOOTH WORKS
      ========================================================= */}
      <section id="how-it-works" className="relative py-20 px-4 sm:px-8 bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#EBF3FF] text-[#0056D6] font-display font-semibold text-sm">
              <Star className="w-4 h-4 text-[#FFC700] fill-[#FFC700]" />
              <span>3 Easy Steps</span>
            </span>
            <h2 className="mt-3 font-script font-bold text-5xl sm:text-6xl text-[#0056D6] -rotate-1">
              Sip, Snap & Keep!
            </h2>
            <p className="mt-2 text-[#1E3A6D]/80 font-medium text-base sm:text-lg">
              Every visit to Mee Laban comes with sweet Egyptian desserts and studio-grade Polaroid memories.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step) => (
              <motion.div
                key={step.num}
                whileHover={{ y: -8 }}
                className="reveal-card relative bg-[#FFFDF7] rounded-3xl p-7 border-2 border-[#0056D6]/10 shadow-[0_14px_35px_rgba(0,86,214,0.08)]"
              >
                <div className="flex items-center justify-between mb-6">
                  <span className="font-script font-bold text-5xl text-[#0056D6]">{step.num}</span>
                  <span className={`px-3.5 py-1 rounded-full text-xs font-display font-bold ${step.color}`}>
                    {step.badge}
                  </span>
                </div>
                <h3 className="font-display font-bold text-2xl text-[#0B192C]">{step.title}</h3>
                <p className="mt-2.5 text-[#1E3A6D]/80 text-sm sm:text-base leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION 3: SIGNATURE DESSERT + BOOTH COMBOS
      ========================================================= */}
     

      {/* =========================================================
          SECTION 4: LIVE POLAROID MEMORY WALL
      ========================================================= */}
     
      {/* =========================================================
          FOOTER SECTION
      ========================================================= */}
      <footer className="bg-[#003E9C] text-white pt-14 pb-8 px-4 sm:px-8 border-t-4 border-[#FFC700]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 pb-10 border-b border-white/15">
          <div className="md:col-span-2">
            <div className="inline-block bg-white px-5 py-2 rounded-full">
              <span className="font-display font-bold text-2xl text-[#0056D6]">Mee LABAN</span>
            </div>
            <p className="mt-4 text-blue-100 text-sm sm:text-base max-w-sm leading-relaxed">
              Capture the Moment, Keep the Memory. Authentic Egyptian cream desserts paired with our signature Polaroid booth experience.
            </p>
          </div>

          <div>
            <h4 className="font-display font-bold text-lg text-[#FFC700] mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm text-blue-100">
              <li><a href="#how-it-works" className="hover:text-white transition">How It Works</a></li>
              <li><a href="#combos" className="hover:text-white transition">Dessert + Booth Combos</a></li>
              <li><a href="#gallery" className="hover:text-white transition">Memory Wall</a></li>
              <li>
                <button onClick={() => navigate('/camera')} className="hover:text-white transition cursor-pointer">
                  Open Photo Booth
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-lg text-[#FFC700] mb-3">Visit & Hours</h4>
            <ul className="space-y-2.5 text-sm text-blue-100">
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-[#FFC700] shrink-0 mt-0.5" />
                <span>Daily: 2:00 PM – 1:00 AM</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#FFC700] shrink-0 mt-0.5" />
                <span>Mee Laban Flagship Dessert Lounge</span>
              </li>
              <li className="pt-1">
                <a
                  href="#instagram"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition"
                >
                  <svg className="w-4 h-4 text-[#FFC700]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="2" width="20" height="20" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
                  </svg>
                  <span>@meelaban</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-6xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-blue-200">
          <p>© {new Date().getFullYear()} Mee Laban Photo Booth. All rights reserved.</p>
          <p className="font-display text-white/90">Made with Sweet Cream & Smiles ✨</p>
        </div>
      </footer>
    </div>
  );
};

export default Hero;