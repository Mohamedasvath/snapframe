import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Zap,
  Image as ImageIcon,
  SwitchCamera,
  Camera as CameraIcon,
  RefreshCw,
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
      <svg className="w-36 sm:w-40 h-auto drop-shadow-[0_6px_14px_rgba(0,86,214,0.45)]" viewBox="0 0 320 150" fill="none">
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
        <span className="font-display font-bold text-lg sm:text-xl leading-none">Mee</span>
        <span className="font-display font-bold text-lg sm:text-xl tracking-wider leading-none -mt-0.5">LABAN</span>
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
  const [frameReady, setFrameReady] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [retry, setRetry] = useState(0);
  const [frameSize, setFrameSize] = useState({ width: 4, height: 5 });

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
        setErrorMessage(
          "Camera requires HTTPS or localhost. Open via HTTPS link or localhost."
        );
        return;
      }

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setErrorMessage("Your browser does not support camera access.");
        return;
      }

      try {
        let stream;
        try {
          // 1st attempt: Preferred resolution & facingMode
          stream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: { ideal: facingMode },
              width: { ideal: 1280 },
              height: { ideal: 720 },
            },
            audio: false,
          });
        } catch {
          // 2nd attempt: Universal fallback for strict devices/webcams
          stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
          });
        }

        // Ignore stale request if component re-mounted or user switched camera
        if (requestIdRef.current !== currentRequestId) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;

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
          } catch (playErr) {
            console.error("Video play failed:", playErr);
            setErrorMessage("Tap 'Enable Camera' below to start the preview.");
          }
        };
      } catch (err) {
        if (requestIdRef.current !== currentRequestId) return;
        console.error("Camera permission error:", err);

        if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
          setErrorMessage(
            "Camera permission was blocked. Click the lock/camera icon in your browser address bar, select Allow, and tap Retry."
          );
        } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
          setErrorMessage("No camera device found on this phone/PC.");
        } else if (err.name === "NotReadableError" || err.name === "TrackStartError") {
          setErrorMessage("Camera is currently in use by another app. Close other apps and retry.");
        } else {
          setErrorMessage("Unable to access camera. Please check browser permissions.");
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
    setFrameSize({
      width: image.naturalWidth,
      height: image.naturalHeight,
    });
    setFrameReady(true);
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

    setFrameReady(false);
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
        <header className="relative z-30 flex h-[74px] shrink-0 items-center justify-between px-5 pt-2">
          <button
            onClick={() => navigate("/")}
            aria-label="Back to Home"
            className="flex h-10 w-10 items-center justify-center rounded-full text-white/90 transition hover:bg-white/10 active:scale-90 cursor-pointer"
          >
            <ArrowLeft size={22} strokeWidth={2.2} />
          </button>

          <div className="translate-y-3 z-30">
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

        {/* CAMERA VIEWFINDER */}
        <section className="relative z-20 flex min-h-0 flex-1 items-center justify-center px-3.5 py-1">
          <div
            className="relative h-auto w-full max-h-full max-w-full overflow-hidden rounded-[26px] border-[3px] border-[#0066FF] bg-[#161B24] shadow-[0_0_30px_rgba(0,102,255,0.3)]"
            style={{
              aspectRatio: `${frameSize.width} / ${frameSize.height}`,
            }}
          >
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`absolute inset-0 h-full w-full object-cover ${
                facingMode === "user" ? "-scale-x-100" : ""
              }`}
            />

            {photoFrame && (
              <img
                key={photoFrame.id}
                ref={frameImageRef}
                src={photoFrame.image}
                alt={photoFrame.name}
                onLoad={handleFrameLoad}
                onError={() => {
                  setFrameReady(true); // Allow capture even if frame asset is missing
                  console.error("Frame not found:", photoFrame.image);
                }}
                className="pointer-events-none absolute inset-0 z-20 h-full w-full object-fill"
              />
            )}

            {/* Bottom Milk Rim inside Viewfinder */}
            <svg
              className="pointer-events-none absolute bottom-0 left-0 right-0 z-20 w-full h-7 text-white/95"
              viewBox="0 0 400 32"
              preserveAspectRatio="none"
            >
              <path
                fill="currentColor"
                d="M0,18 C45,28 85,8 140,20 C195,30 245,10 300,22 C345,30 375,16 400,14 L400,32 L0,32 Z"
              />
            </svg>

            {/* Starting State */}
            {!cameraReady && !errorMessage && (
              <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#0E1117]/95">
                <CameraIcon size={38} className="animate-pulse text-[#0066FF]" />
                <p className="mt-3 text-xs font-medium text-white/75">Starting Mee Laban Booth...</p>
              </div>
            )}

            {/* Clear Actionable Permission Error State */}
            {errorMessage && (
              <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-[#0E1117]/95 px-6 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#0056D6]/20 text-[#FFC700]">
                  <CameraIcon size={30} />
                </div>
                <p className="mt-3 text-sm font-bold text-white">Camera Access Needed</p>
                <p className="mt-1.5 text-xs text-white/70 leading-relaxed">{errorMessage}</p>
                <button
                  onClick={() => setRetry((value) => value + 1)}
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#0056D6] hover:bg-[#0A66FF] px-6 py-2.5 text-xs font-bold text-white shadow-lg cursor-pointer"
                >
                  <RefreshCw size={14} />
                  <span>Enable / Retry Camera</span>
                </button>
              </div>
            )}
          </div>
        </section>

        {/* BOTTOM CONTROLS */}
        <footer className="relative z-30 flex h-[126px] shrink-0 items-center justify-between px-9 pb-5">
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
            disabled={!cameraReady}
            aria-label="Capture photo"
            className="flex h-[78px] w-[78px] items-center justify-center rounded-full border-[4px] border-white p-1 transition hover:scale-105 active:scale-90 disabled:opacity-40 cursor-pointer shadow-[0_0_25px_rgba(255,255,255,0.25)]"
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