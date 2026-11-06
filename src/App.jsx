
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Camera from "./components/Camera";
import PhotoPreview from "./components/PhotoPreview";

export default function App() {
  return (
    <div className="min-h-screen bg-[#FFF8E9]">
      <Navbar />

      <Routes>
        <Route path="/" element={<Navigate to="/camera" replace />} />
        <Route path="/camera" element={<Camera />} />
        <Route path="/preview" element={<PhotoPreview />} />
      </Routes>
    </div>
  );
}
