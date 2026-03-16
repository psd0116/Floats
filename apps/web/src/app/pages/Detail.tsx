import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
  ArrowLeft,
  Maximize2,
  MessageCircle,
  Send,
} from "lucide-react";
import { artworks } from "../data/mockData";
import { motion } from "motion/react";

export function Detail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isRotating, setIsRotating] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [showComments, setShowComments] = useState(false);

  const artwork = artworks.find((art) => art.id === id);

  if (!artwork) {
    return null;
  }

  const handleARView = () => {
    // Mock AR view
    alert(
      "AR 뷰어가 실행됩니다. 실제 환경에서는 카메라를 통해 3D 모델을 볼 수 있어요.",
    );
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      alert(`댓글이 추가되었습니다: ${newComment}`);
      setNewComment("");
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col">
      {/* Header */}
      <header className="px-6 py-6 bg-white flex items-center justify-between shadow-sm z-10">
        <button
          onClick={() => navigate("/")}
          className="w-10 h-10 rounded-full bg-[#F3F4F6] flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-[#1F2937]" />
        </button>
        <h3 className="text-[#1F2937]">{artwork.title}</h3>
        <div className="w-10" />
      </header>

      {/* 3D Viewer Section */}
      <section className="relative h-[400px] bg-gradient-to-b from-white to-[#F9FAFB]">
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="relative w-64 h-64 rounded-[24px] shadow-xl cursor-pointer"
            style={{ backgroundColor: artwork.color }}
            animate={isRotating ? { rotateY: 360 } : {}}
            transition={{
              duration: 3,
              ease: "linear",
              repeat: isRotating ? Infinity : 0,
            }}
            onTap={() => setIsRotating(!isRotating)}
          >
            <img
              src={artwork.thumbnail}
              alt={artwork.title}
              className="w-full h-full object-cover rounded-[24px] opacity-70"
            />

            {/* 3D Effect Overlay */}
            <div className="absolute inset-0 rounded-[24px] bg-gradient-to-tr from-black/10 via-transparent to-white/20" />
          </motion.div>
        </div>

        {/* 360° Swipe Indicator */}
        {!isRotating && (
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Maximize2 className="w-4 h-4 text-white" />
            <span className="text-white text-sm">
              탭하여 회전
            </span>
          </motion.div>
        )}
      </section>

      {/* AR Button */}
      <div className="px-6 py-6">
        <motion.button
          onClick={handleARView}
          className="w-full py-4 rounded-[20px] shadow-lg flex items-center justify-center gap-2"
          style={{ backgroundColor: "#FEF08A" }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Maximize2 className="w-5 h-5 text-[#1F2937]" />
          <span className="text-[#1F2937]">AR로 보기</span>
        </motion.button>
      </div>

      {/* Bottom Sheet - Artwork Info */}
      <section className="flex-1 bg-white rounded-t-[32px] shadow-2xl px-6 py-6 overflow-y-auto">
        {/* Original Drawing */}
        <div className="mb-6">
          <h4 className="text-[#1F2937] mb-3">원본 그림</h4>
          <div
            className="w-full aspect-[4/3] rounded-[20px] overflow-hidden"
            style={{ backgroundColor: artwork.color }}
          >
            <img
              src={artwork.thumbnail}
              alt="Original drawing"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Metadata */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[#9CA3AF] text-sm">
              {artwork.date}
            </p>
            <div className="flex gap-2">
              {artwork.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-3 py-1 rounded-full text-[#6B7280]"
                  style={{ backgroundColor: artwork.color }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="border-t border-[#F3F4F6] pt-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-[#1F2937]">가족 댓글</h4>
            <button
              onClick={() => setShowComments(!showComments)}
              className="text-[#6B7280] text-sm"
            >
              {showComments
                ? "닫기"
                : `${artwork.comments.length}개 보기`}
            </button>
          </div>

          {showComments && (
            <div className="space-y-4 mb-4">
              {artwork.comments.map((comment) => (
                <div
                  key={comment.id}
                  className="bg-[#F9FAFB] rounded-[16px] p-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-[#D1FAE5] flex items-center justify-center">
                      <span className="text-xs text-[#1F2937]">
                        {comment.author[0]}
                      </span>
                    </div>
                    <span className="text-sm text-[#1F2937]">
                      {comment.author}
                    </span>
                    <span className="text-xs text-[#9CA3AF] ml-auto">
                      {comment.date}
                    </span>
                  </div>
                  <p className="text-[#4B5563] text-sm leading-relaxed">
                    {comment.text}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Add Comment */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="따뜻한 응원 메시지를 남겨주세요"
              className="flex-1 px-4 py-3 rounded-[16px] bg-[#F9FAFB] text-[#1F2937] placeholder:text-[#9CA3AF] outline-none focus:ring-2 focus:ring-[#D1FAE5]"
            />
            <button
              onClick={handleAddComment}
              className="w-12 h-12 rounded-[16px] flex items-center justify-center"
              style={{
                backgroundColor: newComment.trim()
                  ? "#D1FAE5"
                  : "#F3F4F6",
              }}
              disabled={!newComment.trim()}
            >
              <Send className="w-5 h-5 text-[#1F2937]" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}