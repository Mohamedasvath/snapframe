import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import Home from "./pages/Home";
import Camera from "./components/Camera";
import PhotoPreview from "./components/PhotoPreview";

function RootEntry() {
  const { search } = useLocation();
  const params = new URLSearchParams(search);


  const isQrScan =
    params.get("qr") === "true" ||
    params.get("qr") === "1" ||
    params.get("source") === "qr";

  if (isQrScan) {
    return <Navigate to="/camera" replace />;
  }

  // Normal website open panna Hero.jsx (Home) show aagum
  return <Home />;
}

export default function App() {
  const { pathname } = useLocation();
  const isLandingPage = pathname === "/";

  return (
    <div className="min-h-screen bg-[#FFFDF7]">
      {/* Hero landing page-la custom Mee Laban header irukku; /camera & /preview-la Navbar show aagum */}
     

      <Routes>
        <Route path="/" element={<RootEntry />} />
        <Route path="/camera" element={<Camera />} />
        <Route path="/preview" element={<PhotoPreview />} />
      </Routes>
    </div>
  );
}