import { Link } from "react-router";
import { Camera, Eye, Palette, Fish, Book, BarChart3, User, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../types";
import type { Artwork } from "../types";



export function Home() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [activeTab, setActiveTab] = useState<'family' | 'public'>('public'); // Default to public to see content
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

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

  const navItems = [
    { title: "나의 갤러리", icon: <Palette className="w-6 h-6" />, color: "bg-accent-rose/20", textColor: "text-accent-rose", path: "/gallery" },
    { title: "둥둥 수족관", icon: <Fish className="w-6 h-6" />, color: "bg-accent-sky/20", textColor: "text-accent-sky", path: "/aquarium" },
    { title: "AI 동화책", icon: <Book className="w-6 h-6" />, color: "bg-accent-lavender/20", textColor: "text-accent-lavender", path: "/storybook" },
    { title: "성장 일기", icon: <BarChart3 className="w-6 h-6" />, color: "bg-accent-sage/20", textColor: "text-accent-sage", path: "/diary" },
  ];

  return (
    <div className="min-h-screen bg-background-comfort">
      {/* Header */}
      <header className="px-6 py-8 flex items-start justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-[#333333] mb-1 font-bold text-3xl">둥둥</h1>
          <p className="text-[#717182] text-sm">아이와 엄마의 상상이 자라나는 따뜻한 공간</p>
        </motion.div>
        <Link to={isLoggedIn ? "/mypage" : "/login"}>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-12 h-12 rounded-2xl bg-white border-2 border-white shadow-sm flex items-center justify-center text-[#717182] hover:text-[#333333] transition-colors"
          >
            <User className="w-6 h-6" />
          </motion.button>
        </Link>
      </header>


      {/* Hero Section */}
      <section className="px-6 mb-8">
        <div className="relative h-[260px] rounded-[40px] overflow-hidden bg-linear-to-br from-accent-sky/40 via-accent-lavender/30 to-accent-rose/30 shadow-md border-2 border-white/60 glass">
          <div className="absolute inset-0 flex items-center justify-center">
            {isLoading ? (
              <Loader2 className="w-8 h-8 animate-spin text-white/50" />
            ) : artworks.length > 0 ? (
              artworks.slice(0, 3).map((art, index) => (
                <motion.div
                  key={art.id}
                  className={`absolute ${index % 2 === 0 ? 'animate-float' : 'animate-float-delayed'}`}
                  style={{
                    left: `${15 + index * 32}%`,
                    top: `${20 + index * 12}%`,
                  }}
                >
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-3xl shadow-2xl backdrop-blur-md border-2 border-white/80 overflow-hidden">
                      <img 
                        src={art.thumbnail} 
                        alt={art.title}
                        className="w-full h-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-white/90 px-3 py-1 rounded-full text-[10px] font-bold text-[#333333] shadow-sm border border-white/50">
                      {art.title}
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-white/60 font-bold text-sm">새로운 상상을 그려보세요!</p>
            )}
          </div>
          <div className="absolute inset-0 bg-linear-to-t from-background-comfort/50 to-transparent pointer-events-none" />
          <div className="absolute top-4 left-6 px-4 py-1.5 rounded-full bg-white/40 backdrop-blur-md border border-white/60 text-[11px] font-bold text-[#333333]/70 uppercase tracking-widest">
            Featured Imagination
          </div>
        </div>
      </section>

      {/* Quick Navigation Grid */}
      <section className="px-6 mb-10">
        <div className="grid grid-cols-2 gap-4">
          {navItems.map((item, index) => (
            <Link key={item.title} to={item.path}>
              <motion.div
                className="bg-white/80 backdrop-blur-xl border-2 border-white shadow-sm p-6 rounded-[32px] flex flex-col items-center justify-center gap-3 hover:shadow-lg hover:border-accent-sky/30 transition-all h-[140px]"
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className={`w-12 h-12 rounded-2xl ${item.color} flex items-center justify-center ${item.textColor} border border-white/50 shadow-inner`}>
                  {item.icon}
                </div>
                <span className="text-[#333333] font-bold text-sm tracking-tight">{item.title}</span>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Activity Board */}
      <section className="px-6 pb-24">
        <div className="flex flex-col mb-6 px-2 gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[#333333] text-xl font-extrabold tracking-tight">작품 둘러보기</h2>
            <Link to="/gallery" className="text-xs font-bold text-[#717182] hover:text-[#333333] bg-white/50 px-3 py-1.5 rounded-full border border-white/60">전체보기</Link>
          </div>

          {/* Toggle Tabs */}
          <div className="flex p-1 bg-white/40 backdrop-blur-md rounded-2xl border border-white/60 shadow-sm w-fit">
            <button
              onClick={() => setActiveTab('family')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'family' ? 'bg-white text-[#333333] shadow-sm' : 'text-[#9CA3AF]'}`}
            >
              우리 가족
            </button>
            <button
              onClick={() => setActiveTab('public')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'public' ? 'bg-white text-[#333333] shadow-sm' : 'text-[#9CA3AF]'}`}
            >
              공개 광장
            </button>
          </div>
        </div>
        
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-6 h-6 animate-spin text-accent-rose" />
            </div>
          ) : artworks.length > 0 ? (
            artworks.map((art, index) => (
              <motion.div
                key={art.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={`/detail/${art.id}`}>
                  <div className="bg-white border-2 border-white rounded-[32px] p-5 shadow-sm hover:shadow-md hover:border-accent-sky/20 transition-all flex gap-5 items-center">
                    <div className="w-24 h-24 rounded-2xl shrink-0 overflow-hidden shadow-inner relative border border-black/5 bg-[#F3F4ED]">
                      <img 
                        src={art.thumbnail} 
                        alt={art.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-[#333333] font-extrabold text-lg mb-1 truncate">{art.title}</h3>
                      <p className="text-[#9CA3AF] text-xs mb-3 font-bold uppercase tracking-wider">
                        {new Date(art.createdAt).toLocaleDateString()}
                      </p>
                      <div className="flex gap-2 flex-wrap">
                        {art.tags.slice(0, 2).map((tag) => (
                          <span 
                            key={tag}
                            className="text-[10px] px-3 py-1 rounded-full bg-[#F3F4F1] text-[#717182] font-bold border border-[#E5E7EB]"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="shrink-0 w-12 h-12 rounded-full bg-[#F3F4F1] flex items-center justify-center border-2 border-white shadow-sm">
                      <Eye className="w-5 h-5 text-[#333333]" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12 bg-white/40 rounded-[32px] border-2 border-dashed border-white/60">
              <p className="text-[#717182] font-bold">아직 등록된 작품이 없어요.</p>
              <p className="text-[#9CA3AF] text-xs mt-1">첫 번째 상상을 공유해볼까요?</p>
            </div>
          )}
        </div>
      </section>

      {/* FAB */}
      <Link to="/upload">
        <motion.button
          className="fixed bottom-8 right-6 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center animate-float overflow-hidden group"
          style={{ backgroundColor: "var(--accent-rose)" }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          <Camera className="w-8 h-8 text-white relative z-10" />
        </motion.button>
      </Link>
    </div>
  );
}
