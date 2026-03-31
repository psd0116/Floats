import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowLeft, Eye, Loader2, Sparkles, Filter } from "lucide-react";
import { motion } from "motion/react";
import { API_BASE_URL } from "../types";
import type { Artwork } from "../types";

export function Plaza() {
  const navigate = useNavigate();
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [activeTab, setActiveTab] = useState<'public' | 'family'>('public');
  const [isLoading, setIsLoading] = useState(true);

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

  return (
    <div className="min-h-screen bg-background-comfort flex flex-col hide-scrollbar">
      {/* Header */}
      <header className="px-6 py-6 sticky top-0 bg-background-comfort/80 backdrop-blur-xl z-50 flex items-center justify-between border-b border-white/40">
        <button
          onClick={() => navigate("/")}
          className="w-12 h-12 rounded-2xl bg-white border-2 border-white flex items-center justify-center shadow-sm text-[#717182] hover:text-[#333333] transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex flex-col items-center">
          <h1 className="text-[#333333] font-bold text-xl tracking-wide flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent-rose" />
            둥둥 광장
            <Sparkles className="w-5 h-5 text-accent-sky" />
          </h1>
          <p className="text-[#9CA3AF] text-[10px] font-bold tracking-widest uppercase mt-0.5">Community & Family</p>
        </div>
        <div className="w-12" /> {/* Layout balancer */}
      </header>

      {/* Hero / Filter Section */}
      <section className="px-6 pt-6 pb-4">
        <div className="bg-white/60 backdrop-blur-md rounded-[32px] p-6 border-2 border-white shadow-sm flex flex-col gap-4">
          <p className="text-[#717182] font-bold text-sm text-center">
            가족의 따뜻한 기록과 모두의 멋진 상상을 함께 구경해요!
          </p>
          
          {/* Toggle Tabs (Redesigned for full width) */}
          <div className="flex p-1.5 bg-background-comfort/50 rounded-2xl border border-white/60 shadow-inner w-full">
            <button
              onClick={() => setActiveTab('public')}
              className={`flex-1 py-3 rounded-[12px] text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'public' 
                ? 'bg-white text-[#333333] shadow-sm' 
                : 'text-[#9CA3AF] hover:text-[#717182]'
              }`}
            >
              모두의 상상 (공개)
            </button>
            <button
              onClick={() => setActiveTab('family')}
              className={`flex-1 py-3 rounded-[12px] text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'family' 
                ? 'bg-white text-[#333333] shadow-sm' 
                : 'text-[#9CA3AF] hover:text-[#717182]'
              }`}
            >
              우리 가족 기록
            </button>
          </div>
        </div>
      </section>

      {/* Artworks List */}
      <section className="flex-1 px-6 pb-12">
        <div className="flex items-center justify-between mb-4 px-2">
          <h2 className="text-[#333333] font-bold text-lg"><span className="text-accent-rose">{artworks.length}</span>개의 상상</h2>
          <button className="flex items-center gap-1.5 text-[#9CA3AF] text-xs font-bold hover:text-[#717182] transition-colors bg-white/50 px-3 py-1.5 rounded-full border border-white">
            <Filter className="w-3 h-3" />
            최신순
          </button>
        </div>

        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-accent-sky" />
            </div>
          ) : artworks.length > 0 ? (
            artworks.map((art, index) => (
              <motion.div
                key={art.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link to={`/detail/${art.id}`}>
                  <div className="bg-white/80 backdrop-blur-xl border-2 border-white rounded-[32px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:border-accent-sky/30 transition-all flex gap-5 items-center group">
                    {/* Thumbnail */}
                    <div className="w-28 h-28 rounded-[24px] shrink-0 overflow-hidden shadow-inner relative border-2 border-transparent group-hover:border-accent-rose/20 transition-colors bg-[#F3F4ED]">
                      <img 
                        src={art.thumbnail} 
                        alt={art.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>

                    {/* Meta */}
                    <div className="flex-1 min-w-0 flex flex-col justify-center h-28">
                      <h3 className="text-[#333333] font-extrabold text-xl mb-1.5 truncate pr-2 group-hover:text-accent-sky transition-colors">{art.title}</h3>
                      <p className="text-[#9CA3AF] text-xs font-bold uppercase tracking-wider mb-2">
                        {art.user?.name || "익명 작가"} · {new Date(art.createdAt).toLocaleDateString()}
                      </p>
                      <div className="flex gap-2 flex-wrap">
                        {art.tags.slice(0, 3).map((tag) => (
                          <span 
                            key={tag}
                            className="text-[10px] px-3 py-1.5 rounded-full bg-[#F3F4ED] text-[#717182] font-bold border border-white"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* View Action */}
                    <div className="shrink-0 w-12 h-12 rounded-full bg-[#F3F4F1] flex items-center justify-center border-2 border-white shadow-sm group-hover:bg-accent-sky/10 group-hover:border-accent-sky/20 transition-all">
                      <Eye className="w-5 h-5 text-[#333333] group-hover:text-accent-sky transition-colors" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-24 bg-white/40 rounded-[32px] border-2 border-dashed border-white/60">
              <Sparkles className="w-12 h-12 text-[#9ca3af]/40 mx-auto mb-4" />
              <p className="text-[#717182] font-bold text-lg">아직 전시된 상상이 없어요!</p>
              <p className="text-[#9CA3AF] text-sm mt-1">멋진 그림을 추가해 볼까요?</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
