import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Zap,
  Image as ImageIcon,
  SwitchCamera,
  Camera as CameraIcon,
  RefreshCw,
  ShieldAlert,
} from "lucide-react";

const photoFrames = [
  { id: "meelaban", image: "/frames/meelaban.png", name: "meelaban" },
];

function getUsedFrames() {
  try {
    return JSON.parse(sessionStorage.getItem("usedPhotoFrames") || "[]");
  } catch {
    return [];
  }
}

function getRandomFrame() {
  const active = sessionStorage.getItem("activePhotoFrame");
  const activeFrame = photoFrames.find((frame) => frame.id === active);
  if (activeFrame) return activeFrame;

  let used = getUsedFrames();
  let available = photoFrames.filter((frame) => !used.includes(frame.id));

  if (!available.length) {
    used = [];
    available = [...photoFrames];
  }

  const selected = available[Math.floor(Math.random() * available.length)];
  used.push(selected.id);
  sessionStorage.setItem("usedPhotoFrames", JSON.stringify(used));
  sessionStorage.setItem("activePhotoFrame", selected.id);

  return selected;
}

function MeeLabanCloudBadge() {
  return (
    <div className="relative inline-flex items-center justify-center select-none pointer-events-none">
      <svg
        className="w-32 sm:w-36 h-auto drop-shadow-[0_6px_14px_rgba(0,86,214,0.45)]"
        viewBox="0 0 320 150"
        fill="none"
      >
        <path d="M58 42C48 25 36 16 32 22C28 28 38 45 50 52C55 55 61 48 58 42Z" fill="#FFC700" />
        <path d="M35 65C22 60 8 62 8 68C8 74 22 76 34 73C39 72 40 67 35 65Z" stroke="#0044AA" strokeWidth="3" fill="white" />
        <path d="M262 42C272 25 284 16 288 22C292 28 282 45 270 52C265 55 259 48 262 42Z" fill="#FFC700" />
        <path d="M285 65C298 60 312 62 312 68C312 74 298 76 286 73C281 72 280 67 285 65Z" stroke="#0044AA" strokeWidth="3" fill="white" />
        <path
          d="M160 12C126 12 104 30 99 48C74 52 58 70 58 90C58 116 86 135 160 135C234 135 262 116 262 90C262 70 246 52 221 48C216 30 194 12 160 12Z"
          fill="white"
        />
        <path
          d="M160 18C130 18 110 34 105 52C82 55 66 71 66 89C66 112 92 128 160 128C228 128 254 112 254 89C254 71 238 55 215 52C210 34 190 18 160 18Z"
          fill="#0056D6"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-1.5 text-white">
        <span className="font-display font-bold text-base sm:text-lg leading-none">Mee</span>
        <span className="font-display font-bold text-base sm:text-lg tracking-wider leading-none -mt-0.5">LABAN</span>
      </div>
    </div>
  );
}

export default function Camera() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const frameImageRef = useRef(null);
  const streamRef = useRef(null);
  const requestIdRef = useRef(0);

  const navigate = useNavigate();

  const [photoFrame, setPhotoFrame] = useState(getRandomFrame);
  const [facingMode, setFacingMode] = useState("user");
  const [flashOn, setFlashOn] = useState(false);
  const [flashTrigger, setFlashTrigger] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [permissionState, setPermissionState] = useState("checking"); // 'checking' | 'prompt' | 'granted' | 'denied'
  const [errorMessage, setErrorMessage] = useState("");
  const [retry, setRetry] = useState(0);
  const [frameSize, setFrameSize] = useState({ width: 1080, height: 1350 });

  // Check browser camera permission status proactively
  useEffect(() => {
    let permissionStatus;
    async function checkPermission() {
      if (navigator.permissions && navigator.permissions.query) {
        try {
          permissionStatus = await navigator.permissions.query({ name: "camera" });
          setPermissionState(permissionStatus.state);
          permissionStatus.onchange = () => {
            setPermissionState(permissionStatus.state);
            if (permissionStatus.state === "granted") {
              setRetry((r) => r + 1);
            }
          };
        } catch {
          setPermissionState("prompt");
        }
      } else {
        setPermissionState("prompt");
      }
    }
    checkPermission();
    return () => {
      if (permissionStatus) permissionStatus.onchange = null;
    };
  }, []);

  useEffect(() => {
    const currentRequestId = ++requestIdRef.current;

    function stopExistingStream() {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }

    async function startCamera() {
      stopExistingStream();
      setCameraReady(false);
      setErrorMessage("");

      if (!window.isSecureContext) {
        setErrorMessage("Camera requires HTTPS or localhost.");
        return;
      }

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setErrorMessage("Your browser does not support camera access.");
        return;
      }

      try {
        let stream;
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: { ideal: facingMode },
              width: { ideal: 1280 },
              height: { ideal: 720 },
            },
            audio: false,
          });
        } catch {
          stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
          });
        }

        if (requestIdRef.current !== currentRequestId) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        const videoTrack = stream.getVideoTracks()[0];
        if (!videoTrack || videoTrack.readyState === "ended") {
          setCameraReady(false);
          setErrorMessage("Camera is turned off or blocked in device settings. Turn on your camera and tap Allow.");
          return;
        }

        // Listen if user turns off/blocks camera while open
        videoTrack.onended = () => {
          setCameraReady(false);
          setErrorMessage("Camera disconnected or turned off. Please enable camera access.");
        };

        streamRef.current = stream;
        setPermissionState("granted");

        const video = videoRef.current;
        if (!video) return;

        video.srcObject = stream;
        video.setAttribute("playsinline", "true");
        video.muted = true;

        video.onloadedmetadata = async () => {
          if (requestIdRef.current !== currentRequestId) return;
          try {
            await video.play();
            setCameraReady(true);
          } catch {
            setErrorMessage("Camera permission needed. Tap 'Allow Camera' below.");
          }
        };
      } catch (err) {
        if (requestIdRef.current !== currentRequestId) return;
        setCameraReady(false);

        if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
          setPermissionState("denied");
          setErrorMessage(
            "Camera permission is blocked. Click the camera/lock icon in your browser address bar, choose Allow, then tap Allow Camera."
          );
        } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
          setErrorMessage("No active camera found. Connect or enable your webcam and retry.");
        } else if (err.name === "NotReadableError" || err.name === "TrackStartError") {
          setErrorMessage("Camera is busy in another app or turned off by laptop privacy switch.");
        } else {
          setErrorMessage("Please allow camera permission to use Mee Laban Booth.");
        }
      }
    }

    startCamera();

    return () => {
      requestIdRef.current++;
      stopExistingStream();
    };
  }, [facingMode, retry]);

  function handleFrameLoad(event) {
    const image = event.currentTarget;
    if (image.naturalWidth && image.naturalHeight) {
      setFrameSize({
        width: image.naturalWidth,
        height: image.naturalHeight,
      });
    }
  }

  function switchCamera() {
    setFacingMode((current) => (current === "user" ? "environment" : "user"));
  }

  function switchFrame() {
    if (photoFrames.length <= 1) return;

    let used = getUsedFrames();
    let available = photoFrames.filter(
      (frame) => !used.includes(frame.id) && frame.id !== photoFrame?.id
    );

    if (!available.length) {
      used = photoFrame ? [photoFrame.id] : [];
      available = photoFrames.filter((frame) => frame.id !== photoFrame?.id);
    }

    if (!available.length) return;

    const nextFrame = available[Math.floor(Math.random() * available.length)];
    used.push(nextFrame.id);

    sessionStorage.setItem("usedPhotoFrames", JSON.stringify(used));
    sessionStorage.setItem("activePhotoFrame", nextFrame.id);

    setPhotoFrame(nextFrame);
  }

  function drawVideoCover(ctx, video, width, height) {
    const scale = Math.max(width / video.videoWidth, height / video.videoHeight);
    const drawWidth = video.videoWidth * scale;
    const drawHeight = video.videoHeight * scale;
    const x = (width - drawWidth) / 2;
    const y = (height - drawHeight) / 2;

    ctx.drawImage(video, x, y, drawWidth, drawHeight);
  }

  function capturePhoto() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const frame = frameImageRef.current;

    if (!cameraReady || !video || !canvas || !video.videoWidth || !video.videoHeight) {
      setRetry((r) => r + 1);
      return;
    }

    if (flashOn) {
      setFlashTrigger(true);
      setTimeout(() => setFlashTrigger(false), 250);
    }

    try {
      const width = 1200;
      const height = Math.round(width * (frameSize.height / frameSize.width));

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas not supported");

      ctx.save();
      if (facingMode === "user") {
        ctx.translate(width, 0);
        ctx.scale(-1, 1);
      }
      drawVideoCover(ctx, video, width, height);
      ctx.restore();

      if (frame && frame.complete && frame.naturalWidth) {
        ctx.drawImage(frame, 0, 0, width, height);
      }

      const photo = canvas.toDataURL("image/jpeg", 0.92);

      try {
        sessionStorage.setItem("capturedPhoto", photo);
        sessionStorage.setItem("capturedFrame", photoFrame.id);
      } catch (storageError) {
        console.warn("Photo storage unavailable:", storageError);
      }

      navigate("/preview", {
        state: {
          photo,
          frameId: photoFrame.id,
        },
      });
    } catch (error) {
      console.error("Photo capture failed:", error);
      alert("Photo capture failed. Please try again.");
    }
  }

  return (
    <main className="fixed inset-0 z-50 flex h-[100svh] w-full justify-center overflow-hidden bg-[#0A0C10] text-white">
      <canvas ref={canvasRef} className="hidden" />

      {flashTrigger && (
        <div className="pointer-events-none fixed inset-0 z-[60] bg-white opacity-95 transition-opacity" />
      )}

      <div className="relative mx-auto flex h-full w-full max-w-[460px] flex-col justify-between bg-[#0E1117] shadow-2xl overflow-hidden">
        {/* TOP HEADER */}
        <header className="relative z-30 flex h-[68px] shrink-0 items-center justify-between px-5 pt-2">
          <button
            onClick={() => navigate("/")}
            aria-label="Back to Home"
            className="flex h-10 w-10 items-center justify-center rounded-full text-white/90 transition hover:bg-white/10 active:scale-90 cursor-pointer"
          >
            <ArrowLeft size={22} strokeWidth={2.2} />
          </button>

          <div className="translate-y-2 z-30">
            <MeeLabanCloudBadge />
          </div>

          <button
            onClick={() => setFlashOn((prev) => !prev)}
            aria-label="Toggle Flash"
            className={`flex h-10 w-10 items-center justify-center rounded-full transition active:scale-90 cursor-pointer ${
              flashOn ? "bg-[#FFC700] text-[#0B192C]" : "text-white/90 hover:bg-white/10"
            }`}
          >
            <Zap size={20} strokeWidth={2.2} className={flashOn ? "fill-current" : ""} />
          </button>
        </header>

        {/* CAMERA VIEWFINDER WITH FULL-FIT FRAME */}
        <section className="relative z-20 flex min-h-0 flex-1 items-center justify-center px-3 py-1">
          <div
            className="relative flex items-center justify-center overflow-hidden rounded-[22px]"
            style={{
              aspectRatio: `${frameSize.width} / ${frameSize.height}`,
              height: "100%",
              maxHeight: "100%",
              width: "auto",
              maxWidth: "100%",
            }}
          >
            {/* 1. Live Camera Feed (Inset inside the frame window so edges don't bleed outside PNG cutouts) */}
            <div className="absolute inset-[6%] z-10 overflow-hidden rounded-[24px] bg-[#161B24]">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`h-full w-full object-cover ${
                  facingMode === "user" ? "-scale-x-100" : ""
                }`}
              />
            </div>

            {/* 2. PNG Template Overlay (Edge-to-Edge Fit) */}
            {photoFrame && (
              <img
                key={photoFrame.id}
                ref={frameImageRef}
                src={photoFrame.image}
                alt={photoFrame.name}
                onLoad={handleFrameLoad}
                onError={() => console.error("Frame not found:", photoFrame.image)}
                className="pointer-events-none relative z-20 h-full w-full object-contain select-none"
              />
            )}

            {/* Asking Camera Permission / Starting Overlay */}
            {(!cameraReady || errorMessage) && (
              <div className="absolute inset-[8%] z-30 flex flex-col items-center justify-center rounded-[22px] bg-[#0E1117]/95 px-5 text-center backdrop-blur-md">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#0056D6]/25 text-[#FFC700]">
                  {errorMessage || permissionState === "denied" ? (
                    <ShieldAlert size={30} />
                  ) : (
                    <CameraIcon size={30} className="animate-pulse text-[#0A66FF]" />
                  )}
                </div>

                <p className="mt-3 text-sm font-bold text-white">
                  {errorMessage || permissionState === "denied"
                    ? "Camera Permission Required"
                    : "Allow Camera Access"}
                </p>

                <p className="mt-1.5 text-xs text-white/75 leading-relaxed">
                  {errorMessage
                    ? errorMessage
                    : "Please allow camera permission in your browser popup to take your Mee Laban photo."}
                </p>

                <button
                  onClick={() => setRetry((value) => value + 1)}
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#0056D6] hover:bg-[#0A66FF] px-5 py-2.5 text-xs font-bold text-white shadow-lg transition active:scale-95 cursor-pointer"
                >
                  <RefreshCw size={14} />
                  <span>Allow Camera</span>
                </button>
              </div>
            )}
          </div>
        </section>

        {/* BOTTOM CONTROLS */}
        <footer className="relative z-30 flex h-[118px] shrink-0 items-center justify-between px-9 pb-5">
          <button
            onClick={switchFrame}
            aria-label="Change Frame"
            className="flex flex-col items-center gap-1.5 text-white/90 transition hover:text-white active:scale-90 cursor-pointer"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/25 bg-white/10 backdrop-blur-sm">
              <ImageIcon size={20} strokeWidth={2} />
            </div>
            <span className="text-[11px] font-medium tracking-wide">Frame</span>
          </button>

          <button
            onClick={capturePhoto}
            aria-label="Capture photo"
            className={`flex h-[76px] w-[76px] items-center justify-center rounded-full border-[4px] border-white p-1 transition hover:scale-105 active:scale-90 cursor-pointer shadow-[0_0_25px_rgba(255,255,255,0.25)] ${
              !cameraReady ? "opacity-50" : ""
            }`}
          >
            <span className="h-full w-full rounded-full bg-white" />
          </button>

          <button
            onClick={switchCamera}
            aria-label="Flip Camera"
            className="flex flex-col items-center gap-1.5 text-white/90 transition hover:text-white active:scale-90 cursor-pointer"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/25 bg-white/10 backdrop-blur-sm">
              <SwitchCamera size={20} strokeWidth={2} />
            </div>
            <span className="text-[11px] font-medium tracking-wide">Flip</span>
          </button>
        </footer>

        {/* Bottom Milk Wave */}
        <svg
          className="pointer-events-none absolute bottom-0 left-0 right-0 z-20 w-full h-9 text-white"
          viewBox="0 0 460 40"
          preserveAspectRatio="none"
        >
          <path fill="#0056D6" d="M0,26 C90,10 170,34 260,18 C340,6 400,24 460,14 L460,40 L0,40 Z" />
          <path fill="#FFFFFF" d="M0,18 C65,32 135,10 215,24 C290,36 375,12 460,22 L460,40 L0,40 Z" />
        </svg>
      </div>
    </main>
  );
}