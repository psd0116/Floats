import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
  ArrowLeft,
  Maximize2,
  Send,
  Loader2,
} from "lucide-react";
import { motion } from "motion/react";
import { API_BASE_URL } from "../types";
import type { Artwork } from "../types";



export function Detail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRotating, setIsRotating] = useState(false);
  const [newComment, setNewComment] = useState("");

  const fetchComments = (artworkId: string) => {
    fetch(`${API_BASE_URL}/api/comments?artworkId=${artworkId}`)
      .then(res => res.json())
      .then(data => setComments(Array.isArray(data) ? data : []))
      .catch(err => console.error("Failed to fetch comments", err));
  };

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/artworks/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setArtwork(null);
        } else {
          setArtwork(data);
          fetchComments(data.id);
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch artwork detail", err);
        setIsLoading(false);
      });
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background-comfort flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-accent-rose" />
      </div>
    );
  }

  if (!artwork) {
    return (
      <div className="min-h-screen bg-background-comfort flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold text-[#333333] mb-2">작품을 찾을 수 없어요.</h2>
        <button 
          onClick={() => navigate("/")}
          className="px-6 py-2 bg-white border-2 border-white rounded-2xl shadow-sm font-bold text-[#717182]"
        >
          홈으로 돌아가기
        </button>
      </div>
    );
  }

  const handleARView = () => {
    alert("AR 뷰어가 실행됩니다. 실제 환경에서는 카메라를 통해 3D 모델을 볼 수 있어요.");
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    const token = localStorage.getItem('token');
    if (!token) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          artworkId: artwork.id,
          content: newComment
        })
      });

      if (response.ok) {
        setNewComment("");
        fetchComments(artwork.id); // Refresh comments
      } else {
        const data = await response.json();
        alert(data.error || "댓글 작성에 실패했습니다.");
      }
    } catch (error) {
      console.error("Comment error:", error);
      alert("문제가 발생했습니다. 다시 시도해 주세요.");
    }
  };

  return (
    <div className="min-h-screen bg-background-comfort flex flex-col">
      {/* Header */}
      <header className="px-6 py-6 bg-white/40 flex items-center justify-between border-b border-white/60 backdrop-blur-md z-10">
        <button
          onClick={() => navigate("/")}
          className="w-10 h-10 rounded-full bg-white border-2 border-white flex items-center justify-center shadow-sm text-[#717182] hover:text-[#333333]"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h3 className="text-[#333333] font-extrabold text-lg">둥둥 갤러리</h3>
        <div className="w-10" />
      </header>

      {/* 3D Viewer Section */}
      <section className="relative h-[400px] bg-linear-to-b from-white/20 to-transparent overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className={`relative w-64 h-64 rounded-[40px] shadow-2xl cursor-pointer border-4 border-white ${isRotating ? '' : 'animate-float'}`}
            style={{ backgroundColor: artwork.color || "#F3F4ED" }}
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
              className="w-full h-full object-cover rounded-[36px]"
            />
            <div className="absolute inset-0 rounded-[36px] bg-linear-to-tr from-black/5 via-transparent to-white/10" />
          </motion.div>
        </div>

        {!isRotating && (
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-white/60 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/80 shadow-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Maximize2 className="w-4 h-4 text-[#333333]" />
            <span className="text-[#333333] text-xs font-bold tracking-tight">탭하여 돌려보기</span>
          </motion.div>
        )}
      </section>

      {/* Content */}
      <section className="flex-1 bg-white/80 backdrop-blur-xl rounded-t-[48px] border-t-2 border-white shadow-2xl px-8 py-10">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-extrabold text-[#333333] tracking-tight">{artwork.title}</h1>
            <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-widest bg-white px-3 py-1.5 rounded-full shadow-xs border border-white">
              {new Date(artwork.createdAt).toLocaleDateString()}
            </p>
          </div>
          
          <div className="flex gap-2 flex-wrap mb-8">
            {artwork.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-4 py-1.5 rounded-full bg-background-comfort text-[#717182] font-bold border border-white shadow-sm"
              >
                #{tag}
              </span>
            ))}
          </div>

          <motion.button
            onClick={handleARView}
            className="w-full py-5 rounded-[24px] shadow-lg flex items-center justify-center gap-3 bg-accent-sky text-white border-2 border-white/20"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Maximize2 className="w-6 h-6" />
            <span className="font-extrabold text-lg">우리 집에 소환하기 (AR)</span>
          </motion.button>
        </div>

        {/* Real Comments Section */}
        <div className="border-t-2 border-white/60 pt-8 mt-4">
          <h4 className="text-xl font-extrabold text-[#333333] mb-6">가족 댓글 ({comments.length})</h4>
          
          <div className="space-y-4 mb-8">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <motion.div 
                  key={comment.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white/40 p-5 rounded-[28px] border-2 border-white/60 shadow-sm"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-extrabold text-[#333333]">{comment.user?.name || "익명"}</span>
                    <span className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-tighter">
                      {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-[#717182] text-sm leading-relaxed">{comment.content}</p>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-10 bg-white/40 rounded-[32px] border-2 border-dashed border-white/60">
                <p className="text-[#9CA3AF] text-sm font-bold">아직 댓글이 없어요. 첫 번째 응원을 남겨보세요!</p>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <input
              type="text"
              value={newComment}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewComment(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
              placeholder="따뜻한 응원 메시지를 남겨주세요"
              className="flex-1 px-6 py-4 rounded-3xl bg-white border-2 border-white shadow-inner text-[#333333] placeholder:text-[#9CA3AF] outline-none focus:border-accent-rose/30 transition-all font-medium"
            />
            <button
              onClick={handleAddComment}
              className={`w-14 h-14 rounded-3xl flex items-center justify-center shadow-md transition-all ${newComment.trim() ? "bg-accent-rose text-white" : "bg-white text-[#9CA3AF] border-2 border-white"}`}
              disabled={!newComment.trim()}
            >
              <Send className="w-6 h-6" />
            </button>
          </div>
        </div>
      </section>
      <div className="h-10" />
    </div>
  );
}