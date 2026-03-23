import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { X, Camera as CameraIcon } from "lucide-react";
import { motion } from "motion/react";

export function Upload() {
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCapture = () => {
    if (imagePreview) {
      navigate("/processing");
    } else {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="min-h-screen bg-[#1F2937] relative flex flex-col">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10 px-6 py-6 flex justify-between items-center">
        <button
          onClick={() => navigate("/")}
          className="w-10 h-10 rounded-full glass flex items-center justify-center"
        >
          <X className="w-5 h-5 text-white" />
        </button>
        <span className="text-white/80 font-medium text-sm">둥둥 테두리 안에 맞춰주세요</span>
        <div className="w-10" />
      </header>

      {/* Camera Viewfinder */}
      <div className="flex-1 flex items-center justify-center relative">
        {imagePreview ? (
          <img 
            src={imagePreview} 
            alt="Preview" 
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="w-full max-w-md px-6">
            {/* Guide Box */}
            <div className="relative aspect-4/3 border-2 border-dashed border-white/40 rounded-3xl flex items-center justify-center glass">
              <div className="text-center px-6">
                <motion.div className="animate-float">
                  <CameraIcon className="w-12 h-12 text-[#FEF08A] mx-auto mb-4" />
                </motion.div>
                <p className="text-white text-base font-medium leading-relaxed">
                  그림이 둥둥 떠오를 수 있게<br />
                  정면에서 찰칵! 촬영해주세요
                </p>
              </div>

              {/* Corner Markers */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#FEF08A] rounded-tl-xl" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#FEF08A] rounded-tr-xl" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#FEF08A] rounded-bl-xl" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#FEF08A] rounded-br-xl" />
            </div>
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="pb-12 px-6">
        <div className="text-center mb-6">
          <p className="text-white/70 text-sm">
            {imagePreview ? "사진이 선명한지 확인해주세요" : "아이의 그림을 둥둥으로 보내볼까요?"}
          </p>
        </div>

        {/* Capture Button */}
        <div className="flex justify-center">
          <motion.button
            onClick={handleCapture}
            className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center shadow-2xl"
            style={{ backgroundColor: imagePreview ? "#FEF08A" : "transparent" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
          >
            {!imagePreview && (
              <div className="w-16 h-16 rounded-full bg-white shadow-inner" />
            )}
            {imagePreview && (
              <span className="text-[#1F2937] font-bold">완료</span>
            )}
          </motion.button>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
}
