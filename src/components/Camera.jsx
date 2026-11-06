
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Zap,
  RefreshCw,
  Layers,
  Camera as CameraIcon,
  ChevronUp,
  CircleDot,
} from "lucide-react";

const photoFrames = [
  { id: "rewind", image: "/frames/rewind.PNG", name: "Rewind" },
  { id: "tiktok", image: "/frames/tiktok.PNG", name: "TikTok" },
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

export default function Camera() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const frameImageRef = useRef(null);
  const streamRef = useRef(null);

  const navigate = useNavigate();

  const [photoFrame, setPhotoFrame] = useState(getRandomFrame);
  const [facingMode, setFacingMode] = useState("user");
  const [cameraReady, setCameraReady] = useState(false);
  const [frameReady, setFrameReady] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const [retry, setRetry] = useState(0);
  const [frameSize, setFrameSize] = useState({ width: 4, height: 5 });

  // Start camera
  useEffect(() => {
    let mounted = true;
    let currentStream = null;

    async function startCamera() {
      setCameraReady(false);
      setCameraError(false);

      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error("Camera is not supported");
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: facingMode },
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
          audio: false,
        });

        currentStream = stream;

        if (!mounted) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();

          if (mounted) setCameraReady(true);
        }
      } catch (error) {
        console.error("Camera error:", error);
        if (mounted) setCameraError(true);
      }
    }

    startCamera();

    return () => {
      mounted = false;

      if (currentStream) {
        currentStream.getTracks().forEach((track) => track.stop());
      }

      if (streamRef.current === currentStream) {
        streamRef.current = null;
      }
    };
  }, [facingMode, retry]);

  // Frame loaded
  function handleFrameLoad(event) {
    const image = event.currentTarget;

    setFrameSize({
      width: image.naturalWidth,
      height: image.naturalHeight,
    });

    setFrameReady(true);
  }

  // Switch front/back camera
  function switchCamera() {
    setFacingMode((current) =>
      current === "user" ? "environment" : "user"
    );
  }

  // Change frame without repeating until all are used
  function switchFrame() {
    if (photoFrames.length <= 1) return;

    let used = getUsedFrames();

    let available = photoFrames.filter(
      (frame) => !used.includes(frame.id) && frame.id !== photoFrame?.id
    );

    if (!available.length) {
      used = photoFrame ? [photoFrame.id] : [];
      available = photoFrames.filter(
        (frame) => frame.id !== photoFrame?.id
      );
    }

    if (!available.length) return;

    const nextFrame =
      available[Math.floor(Math.random() * available.length)];

    used.push(nextFrame.id);

    sessionStorage.setItem("usedPhotoFrames", JSON.stringify(used));
    sessionStorage.setItem("activePhotoFrame", nextFrame.id);

    setFrameReady(false);
    setPhotoFrame(nextFrame);
  }

  // Match live camera crop
  function drawVideoCover(ctx, video, width, height) {
    const scale = Math.max(
      width / video.videoWidth,
      height / video.videoHeight
    );

    const drawWidth = video.videoWidth * scale;
    const drawHeight = video.videoHeight * scale;

    const x = (width - drawWidth) / 2;
    const y = (height - drawHeight) / 2;

    ctx.drawImage(video, x, y, drawWidth, drawHeight);
  }

  // Capture photo
  function capturePhoto() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const frame = frameImageRef.current;

    if (
      !cameraReady ||
      !frameReady ||
      !video ||
      !canvas ||
      !frame ||
      !frame.complete ||
      !frame.naturalWidth ||
      !video.videoWidth
    ) {
      return;
    }

    const width = 1200;
    const height = Math.round(
      width * (frameSize.height / frameSize.width)
    );

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");

    ctx.save();

    if (facingMode === "user") {
      ctx.translate(width, 0);
      ctx.scale(-1, 1);
    }

    drawVideoCover(ctx, video, width, height);
    ctx.restore();

    // Draw the exact same frame on top
    ctx.drawImage(frame, 0, 0, width, height);

    const photo = canvas.toDataURL("image/png");

    sessionStorage.setItem("capturedPhoto", photo);
    sessionStorage.setItem("capturedFrame", photoFrame.id);

    navigate("/preview", {
      state: {
        photo,
        frameId: photoFrame.id,
      },
    });
  }

  return (
    <main className="fixed inset-0 z-50 flex h-[100svh] w-full justify-center overflow-hidden bg-[#111] text-white">
      <canvas ref={canvasRef} className="hidden" />

      {/* Responsive camera body */}
      <div className="mx-auto flex h-full w-full max-w-[480px] flex-col bg-black">

        {/* TOP CONTROLS */}
        <header className="flex h-[62px] shrink-0 items-center justify-between px-6 sm:h-[70px] sm:px-8">
          <button
            aria-label="Flash"
            className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-white/10 active:scale-90"
          >
            <Zap size={22} strokeWidth={1.8} />
          </button>

          <div className="flex flex-col items-center gap-1">
            <button
              onClick={switchFrame}
              aria-label="Change frame"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20 active:scale-90"
            >
              <ChevronUp size={24} />
            </button>

            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
              <span className="text-[9px] tracking-widest text-white/70">
                LIVE
              </span>
            </div>
          </div>

          <button
            onClick={switchFrame}
            aria-label="Frame options"
            className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-white/10 active:scale-90"
          >
            <CircleDot size={25} strokeWidth={1.7} />
          </button>
        </header>

        {/* CAMERA PREVIEW */}
        <section className="flex min-h-0 flex-1 items-center justify-center overflow-hidden px-0">
          <div
            className="relative h-auto w-full max-h-full max-w-full overflow-hidden bg-[#151515]"
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
                  setFrameReady(false);
                  console.error("Frame not found:", photoFrame.image);
                }}
                className="pointer-events-none absolute inset-0 z-20 h-full w-full object-fill"
              />
            )}

            {!cameraReady && !cameraError && (
              <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black">
                <CameraIcon
                  size={38}
                  className="animate-pulse text-white/60"
                />
                <p className="mt-3 text-xs text-white/50">
                  Starting camera...
                </p>
              </div>
            )}

            {cameraError && (
              <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black px-5 text-center">
                <CameraIcon size={38} className="text-white/60" />
                <p className="mt-4 text-sm">Camera unavailable</p>
                <p className="mt-2 text-xs text-white/50">
                  Please allow camera permission in your browser.
                </p>
                <button
                  onClick={() => setRetry((value) => value + 1)}
                  className="mt-5 rounded-full bg-white px-5 py-2.5 text-xs font-semibold text-black"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        </section>

        {/* PHOTO MODE */}
        <div className="flex h-[34px] shrink-0 items-center justify-center sm:h-[42px]">
          <span className="text-xs font-semibold tracking-[0.22em] text-[#F5D547]">
            PHOTO
          </span>
        </div>

        {/* BOTTOM CONTROLS */}
        <footer className="flex h-[100px] shrink-0 items-center justify-between px-7 sm:h-[112px] sm:px-10">
          <button
            onClick={switchFrame}
            aria-label="Change photo frame"
            className="flex h-[52px] w-[52px] items-center justify-center overflow-hidden rounded-xl border border-white/20 bg-[#242424] transition active:scale-90"
          >
            {photoFrame && (
              <img
                src={photoFrame.image}
                alt="Current frame"
                className="h-full w-full object-contain"
              />
            )}
          </button>

          <button
            onClick={capturePhoto}
            disabled={!cameraReady || !frameReady}
            aria-label="Capture photo"
            className="flex h-[80px] w-[80px] items-center justify-center rounded-full border-[5px] border-white transition hover:scale-105 active:scale-90 disabled:opacity-40 sm:h-[86px] sm:w-[86px]"
          >
            <span className="h-[64px] w-[64px] rounded-full bg-white sm:h-[68px] sm:w-[68px]" />
          </button>

          <button
            onClick={switchCamera}
            aria-label="Switch camera"
            className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#242424] transition hover:bg-[#383838] active:scale-90"
          >
            <RefreshCw size={24} strokeWidth={1.8} />
          </button>
        </footer>

        <div className="h-2 shrink-0 sm:h-3" />
      </div>
    </main>
  );
}
