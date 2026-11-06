
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Download,
  MessageCircle,
  Camera,
  RefreshCw,
  ArrowLeft,
  Share2,
} from "lucide-react";

export default function PhotoPreview() {
  const location = useLocation();
  const navigate = useNavigate();

  const photo =
    location.state?.photo ||
    sessionStorage.getItem("capturedPhoto");

  const [sharing, setSharing] = useState(false);

  function downloadPhoto() {
    if (!photo) return;

    const link = document.createElement("a");
    link.href = photo;
    link.download = `snapframe-${Date.now()}.png`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  async function sharePhoto(platform) {
    if (!photo) return;

    setSharing(true);

    try {
      const response = await fetch(photo);
      const blob = await response.blob();

      const file = new File(
        [blob],
        "snapframe-photo.png",
        { type: "image/png" }
      );

      if (
        navigator.share &&
        navigator.canShare &&
        navigator.canShare({ files: [file] })
      ) {
        await navigator.share({
          files: [file],
          title: "My SnapFrame Photo",
          text: "Check out my photo!",
        });
      } else {
        downloadPhoto();

        if (platform === "whatsapp") {
          window.open(
            "https://wa.me/?text=" +
              encodeURIComponent("Check out my SnapFrame photo!"),
            "_blank"
          );
        } else {
          window.open("https://www.instagram.com/", "_blank");
        }
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Share error:", error);
      }
    } finally {
      setSharing(false);
    }
  }

  function retakePhoto() {
    navigate("/camera");
  }

  if (!photo) {
    return (
      <main className="flex min-h-[calc(100svh-80px)] flex-col items-center justify-center bg-[#FAF9F6] px-6 text-center">
        <Camera size={42} className="text-gray-400" />

        <h2 className="mt-5 text-xl font-semibold text-gray-900">
          No photo found
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          Take a photo first to see your preview.
        </p>

        <button
          onClick={retakePhoto}
          className="mt-6 rounded-full bg-black px-7 py-3 text-sm font-semibold text-white"
        >
          Open Camera
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100svh-80px)] bg-[#FAF9F6] px-4 py-5 sm:px-8">
      <div className="mx-auto flex w-full max-w-[1050px] flex-col">

        {/* HEADER */}
        <header className="mb-4 flex items-center justify-between">
          <button
            onClick={retakePhoto}
            className="flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-black"
          >
            <ArrowLeft size={19} />
            Back
          </button>

          <span className="text-xs font-semibold tracking-[0.2em] text-gray-400">
            SNAPFRAME
          </span>

          <button
            onClick={() => sharePhoto("whatsapp")}
            disabled={sharing}
            aria-label="Share photo"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-700 shadow-sm transition hover:bg-gray-100"
          >
            <Share2 size={19} />
          </button>
        </header>

        {/* TITLE */}
        <div className="mb-4 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-[#202020] sm:text-3xl">
            Your Photo
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Your special moment is ready!
          </p>
        </div>

        {/* LARGE PHOTO PREVIEW */}
        <div className="flex justify-center">
          <div className="flex w-full items-center justify-center">
            <img
              src={photo}
              alt="Your captured photo"
              className="block max-h-[58svh] w-auto max-w-full rounded-sm object-contain shadow-[0_12px_35px_rgba(0,0,0,0.12)] sm:max-h-[62svh]"
            />
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="mx-auto mt-5 w-full max-w-[460px]">
          <button
            onClick={downloadPhoto}
            className="group flex w-full items-center justify-center gap-3 rounded-xl bg-[#171717] px-5 py-4 text-sm font-semibold text-white shadow-md transition duration-200 hover:-translate-y-0.5 hover:bg-[#303030] hover:shadow-lg active:scale-[0.98]"
          >
            <Download
              size={20}
              className="text-[#F5D547] transition group-hover:scale-110"
            />
            Save Photo
          </button>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <button
              onClick={() => sharePhoto("whatsapp")}
              disabled={sharing}
              className="flex items-center justify-center gap-2 rounded-xl border border-[#D8E9DC] bg-white px-3 py-3.5 text-sm font-semibold text-[#18864A] transition hover:-translate-y-0.5 hover:bg-[#EFFAF2] hover:shadow-md active:scale-[0.98] disabled:opacity-50"
            >
              <MessageCircle size={19} />
              WhatsApp
            </button>

            <button
              onClick={() => sharePhoto("instagram")}
              disabled={sharing}
              className="flex items-center justify-center gap-2 rounded-xl border border-[#EBD9E8] bg-white px-3 py-3.5 text-sm font-semibold text-[#B43C83] transition hover:-translate-y-0.5 hover:bg-[#FFF1FA] hover:shadow-md active:scale-[0.98] disabled:opacity-50"
            >
              <Camera size={19} />
              Instagram
            </button>
          </div>

          <button
            onClick={retakePhoto}
            className="mt-4 flex w-full items-center justify-center gap-2 py-2 text-sm font-medium text-gray-500 transition hover:text-black"
          >
            <RefreshCw size={16} />
            Retake Photo
          </button>
        </div>

        <p className="mt-4 text-center text-[10px] tracking-wide text-gray-400">
          LITTLE ANGELS KIDS FASHION
        </p>
      </div>
    </main>
  );
}
