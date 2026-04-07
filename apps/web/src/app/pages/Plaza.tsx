import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowLeft, Loader2, Sparkles, Filter, MessageCircle, Heart } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { API_BASE_URL } from "../types";
import type { Artwork } from "../types";

export function Plaza() {
  const navigate = useNavigate();
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [activeTab, setActiveTab] = useState<'public' | 'family'>('public');
  const [isLoading, setIsLoading] = useState(true);

  // Mock liked state for UI
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    const headers: any = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    fetch(`${API_BASE_URL}/api/artworks?type=${activeTab}`, { headers })
      .then(res => res.json())
      .then(data => {
        setArtworks(Array.isArray(data) ? data : []);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch artworks", err);
        setIsLoading(false);
      });
  }, [activeTab]);

  const toggleLike = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setLikedMap(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col font-sans selection:bg-accent-rose/20 relative">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent-sky/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-accent-rose/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <header className="px-6 py-5 sticky top-0 bg-white/70 backdrop-blur-xl z-50 flex items-center justify-between shadow-[0_2px_20px_rgb(0,0,0,0.02)]">
        <button
          onClick={() => navigate("/")}
          className="w-11 h-11 rounded-full bg-white border border-[#E5E7EB] flex items-center justify-center shadow-sm text-[#717182] hover:text-[#333333] hover:bg-[#F9FAFB] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex flex-col items-center">
          <h1 className="text-[#333333] font-black text-lg tracking-tight flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-accent-rose" />
            둥둥 광장
            <Sparkles className="w-4 h-4 text-accent-sky" />
          </h1>
        </div>
        <div className="w-11" />
      </header>

      {/* Filter / Tabs */}
      <section className="px-6 pt-6 pb-4 relative z-10">
        <div className="flex p-1.5 bg-white/60 backdrop-blur-md rounded-[20px] shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] border border-[#E5E7EB] w-full max-w-sm mx-auto">
          <button
            onClick={() => setActiveTab('public')}
            className={`flex-1 py-3 rounded-[14px] text-sm font-black transition-all duration-300 ${
              activeTab === 'public' 
              ? 'bg-[#1F2937] text-white shadow-md' 
              : 'text-[#9CA3AF] hover:text-[#717182]'
            }`}
          >
            모두의 상상
          </button>
          <button
            onClick={() => setActiveTab('family')}
            className={`flex-1 py-3 rounded-[14px] text-sm font-black transition-all duration-300 ${
              activeTab === 'family' 
              ? 'bg-[#1F2937] text-white shadow-md' 
              : 'text-[#9CA3AF] hover:text-[#717182]'
            }`}
          >
            가족 기록
          </button>
        </div>
        
        <div className="flex items-center justify-between mt-8 mb-2 px-1">
          <h2 className="text-[#333333] font-black text-xl">
            {activeTab === 'public' ? '전시된 작품들' : '우리의 기억'} <span className="text-accent-rose text-lg ml-1">{artworks.length}</span>
          </h2>
          <button className="flex items-center gap-1 text-[#9CA3AF] text-[11px] font-bold hover:text-[#717182] transition-colors px-3 py-1.5 rounded-full border border-[#E5E7EB] bg-white">
            <Filter className="w-3 h-3" />
            최신순
          </button>
        </div>
      </section>

      {/* Masonry Portfolio Grid */}
      <section className="flex-1 px-4 pb-20 relative z-10">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-accent-sky" />
          </div>
        ) : artworks.length > 0 ? (
          <ResponsiveMasonry columnsCountBreakPoints={{ 100: 2, 500: 3, 900: 4 }}>
            <Masonry gutter="16px">
              {artworks.map((art, index) => {
                const commentCount = art._count?.comments || 0;
                const isLiked = likedMap[art.id] || false;
                
                return (
                  <motion.div
                    key={art.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (index % 10) * 0.05 }}
                    className="mb-2"
                  >
                    <Link to={`/detail/${art.id}`} className="block relative group rounded-[24px] overflow-hidden shadow-sm hover:shadow-[0_20px_40px_rgb(0,0,0,0.12)] transition-shadow duration-500 bg-white">
                      
                      <div className="relative overflow-hidden w-full bg-[#f8f9fa]">
                        <img 
                          src={art.thumbnail} 
                          alt={art.title}
                          className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                          loading="lazy"
                        />
                        
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 mix-blend-multiply" />
                        <div className="absolute inset-0 bg-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 pointer-events-none">
                          <div className="flex justify-between items-start">
                            {/* Badges/Tags */}
                            <div className="flex flex-wrap gap-1.5 pointer-events-auto">
                              {art.tags.slice(0, 2).map(tag => (
                                <span key={tag} className="text-[9px] px-2 py-1 rounded-full bg-white/20 backdrop-blur-md text-white font-bold border border-white/30">
                                  #{tag}
                                </span>
                              ))}
                            </div>
                            
                            {/* Fake Like Button */}
                            <button 
                              onClick={(e) => toggleLike(e, art.id)}
                              className="pointer-events-auto w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 hover:bg-white/40 transition-colors"
                            >
                              <Heart className={`w-4 h-4 transition-colors ${isLiked ? 'fill-accent-rose text-accent-rose' : 'text-white'}`} />
                            </button>
                          </div>

                          <div className="flex flex-col gap-1 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                            <h3 className="text-white font-extrabold text-sm drop-shadow-md truncate">{art.title}</h3>
                            <div className="flex items-center justify-between text-white/90 text-[10px] font-bold">
                              <span className="flex items-center gap-1.5"><span className="text-xs">{art.user?.avatar || '🎨'}</span> {art.user?.name || "익명 작가"}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Default Footer Bar (Visible without hover) */}
                      <div className="px-3 py-3 border-t border-[#F3F4F6] flex items-center justify-between bg-white relative">
                        <div className="flex items-center gap-2 truncate">
                          <span className="text-sm bg-[#F3F4F6] w-6 h-6 rounded-full flex items-center justify-center shrink-0 shadow-inner border border-white">{art.user?.avatar || '🎨'}</span>
                          <span className="text-xs font-extrabold text-[#374151] truncate">{art.title}</span>
                        </div>
                        
                        <div className="flex items-center gap-1 text-[#6B7280] bg-[#F9FAFB] px-2 py-1 rounded-lg shrink-0">
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-black">{commentCount}</span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </Masonry>
          </ResponsiveMasonry>
        ) : (
          <div className="text-center py-32 bg-white/40 rounded-[32px] border-2 border-dashed border-white">
            <div className="w-16 h-16 bg-[#F3F4F6] rounded-full flex items-center justify-center mx-auto mb-4 relative">
              <Sparkles className="w-6 h-6 text-[#9CA3AF]" />
              <div className="absolute top-0 right-0 w-3 h-3 bg-accent-rose rounded-full animate-ping" />
            </div>
            <p className="text-[#374151] font-black text-lg">전시된 상상이 없어요!</p>
            <p className="text-[#9CA3AF] text-xs font-bold mt-1">우리 아이의 그림을 세상에 자랑해볼까요?</p>
            <button onClick={() => navigate('/upload')} className="mt-6 bg-[#1F2937] text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-black transition-colors shadow-lg shadow-black/10">
              상상 추가하기
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
