import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, BarChart3, Clock, Sparkles, Heart } from "lucide-react";
import { motion } from "motion/react";
import { API_BASE_URL } from "../types";
import type { Artwork } from "../types";

export function Diary() {
  const navigate = useNavigate();
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    const headers: any = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    fetch(`${API_BASE_URL}/api/artworks?type=family`, { headers })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          // Sort from oldest to newest for chronological growth timeline
          const sorted = data.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
          setArtworks(sorted);
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch artworks for diary", err);
        setIsLoading(false);
      });
  }, []);

  // Data processing for Insights
  const allTags = artworks.flatMap(a => a.tags);
  const tagCounts = allTags.reduce((acc, tag) => {
    acc[tag] = (acc[tag] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const topTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(e => e[0]);

  const colorCounts = artworks.reduce((acc, a) => {
    if (a.color) acc[a.color] = (acc[a.color] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const topColors = Object.entries(colorCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(e => e[0] || "#F3F4ED"); // fallback

  const mostUsedTag = topTags.length > 0 ? topTags[0] : "알록달록 다채로운";

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col font-sans selection:bg-accent-sage/20 relative">
      {/* Background Texture Overlay (Subtle noise/paper feel) */}
      <div className="absolute inset-0 pointer-events-none opacity-40 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjRkRGQkY3IiAvPgo8cmVjdCB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSIjRTVFN0VCIiAvPgo8L3N2Zz4=')] z-0" />

      {/* Header */}
      <header className="px-6 py-6 sticky top-0 bg-[#FDFBF7]/90 backdrop-blur-xl z-50 flex items-center justify-between border-b border-[#E5E7EB]/50">
        <button
          onClick={() => navigate("/")}
          className="w-12 h-12 rounded-full bg-white border border-[#E5E7EB] flex items-center justify-center shadow-sm text-[#717182] hover:text-[#333333] transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex flex-col items-center">
          <h1 className="text-[#333333] font-bold text-xl tracking-tight flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-accent-sage" />
            성장 일기
          </h1>
          <p className="text-[#9CA3AF] text-[10px] font-bold tracking-widest uppercase mt-0.5">Memories & Growth</p>
        </div>
        <div className="w-12" />
      </header>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-6 py-8 pb-32 z-10 space-y-12">
        
        {/* 1. 요정의 편지 (Fairy's Letter) */}
        {!isLoading && artworks.length > 0 && (
          <motion.section 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative w-full max-w-lg mx-auto"
          >
            {/* Paper shadow offset */}
            <div className="absolute inset-0 bg-[#E5E7EB] rounded-2xl rotate-1 translate-y-1 z-0" />
            
            {/* Real paper */}
            <div className="relative bg-white rounded-2xl p-8 border border-[#F3F4F6] shadow-sm z-10 flex flex-col items-center text-center">
              {/* Top Tape decoration */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-[#FCA5A5]/20 rotate-[-2deg] backdrop-blur-sm shadow-[0_1px_3px_rgba(0,0,0,0.05)]" />
              
              <div className="w-12 h-12 rounded-full bg-accent-sage/10 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-accent-sage" />
              </div>
              
              <h2 className="text-[#333333] font-black text-xl mb-3 tracking-tight">가족의 사랑이 쑥쑥 자라요!</h2>
              <p className="text-[#4B5563] text-sm leading-relaxed font-bold break-keep">
                우리 가족은 지금까지 <span className="text-accent-rose font-black">{artworks.length}개</span>의 멋진 상상을 함께 피워냈어요! 
                요즘 특히 <span className="bg-accent-sky/20 px-2 py-0.5 rounded-md text-accent-sky font-black">#{mostUsedTag}</span> 이야기에 푹 빠져 있네요.
                앞으로 또 어떤 놀라운 세상을 보여줄까요?
              </p>
            </div>
          </motion.section>
        )}

        {/* 2. 감성 대시보드 (Colors & Tags) */}
        {!isLoading && artworks.length > 0 && (
          <motion.section 
            className="max-w-lg mx-auto bg-white/50 backdrop-blur-md rounded-[32px] p-6 border-2 border-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex flex-col gap-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {/* Color Palette */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <PaletteIcon />
                <h3 className="text-[#333333] font-bold text-sm">가장 사랑받은 물감들</h3>
              </div>
              <div className="flex pl-3">
                {topColors.length > 0 ? topColors.map((color, i) => (
                  <motion.div
                    key={color + i}
                    initial={{ scale: 0, x: -20 }}
                    animate={{ scale: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.1, type: "spring" }}
                    className="w-10 h-10 rounded-full border-4 border-white shadow-md relative -ml-3"
                    style={{ backgroundColor: color }}
                  />
                )) : (
                  <span className="text-[#9CA3AF] text-xs font-bold">앗, 색상 기록이 부족해요!</span>
                )}
              </div>
            </div>

            <div className="h-px bg-[#E5E7EB]/50 w-full" />

            {/* Tag Cloud */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <CloudIcon />
                <h3 className="text-[#333333] font-bold text-sm">요즘 꽉 찬 생각 주머니</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {topTags.map((tag, i) => (
                  <motion.span
                    key={tag}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    // Map index to visually interesting bubble shapes
                    className={`px-4 py-2 rounded-full font-bold border border-white shadow-sm flex items-center justify-center
                      ${i === 0 ? 'bg-accent-rose/10 text-accent-rose text-base py-3' : 
                       i === 1 ? 'bg-accent-sky/10 text-accent-sky text-sm' : 
                       'bg-[#F3F4ED] text-[#717182] text-xs'}`
                    }
                  >
                    #{tag}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.section>
        )}

        {/* 3. 상상 스크랩북 타임라인 (Chronological Timeline) */}
        {!isLoading && artworks.length > 0 && (
          <section className="relative w-full max-w-lg mx-auto pt-8">
            <div className="text-center mb-10">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#E5E7EB]/50 text-[#717182] font-bold text-xs">
                <Clock className="w-3.5 h-3.5" />
                첫 시작부터 지금까지
              </span>
            </div>

            {/* The Vertical Vine/Line */}
            <div className="absolute left-1/2 -ml-px top-20 bottom-10 w-[2px] bg-gradient-to-b from-accent-sage/20 via-[#E5E7EB] to-transparent z-0" />

            <div className="space-y-16">
              {artworks.map((art, i) => {
                const isLeft = i % 2 === 0;
                // Randomize tilt for natural polaroid look
                const rotate = i % 2 === 0 ? -2 : 3;

                return (
                  <motion.div 
                    key={art.id}
                    className={`relative w-full flex ${isLeft ? 'justify-start' : 'justify-end'} z-10`}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
                  >
                    {/* Connection dot to the center line */}
                    <div className="absolute top-1/2 left-1/2 -mt-1.5 -ml-1.5 w-3 h-3 bg-white border-2 border-accent-sage/30 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.05)] z-20" />
                    
                    {/* The Polaroid Card */}
                    <div 
                      className={`w-[45%] bg-white p-2 md:p-3 relative shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-[#F3F4F6] cursor-pointer hover:shadow-xl hover:-translate-y-1 hover:rotate-0 transition-all ${isLeft ? 'mr-auto pr-6' : 'ml-auto pl-6'}`}
                      style={{ transform: `rotate(${rotate}deg)` }}
                      onClick={() => navigate(`/detail/${art.id}`)}
                    >
                      {/* Top Pin/Tape */}
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-3 bg-white/50 backdrop-blur-md border border-[#E5E7EB] rounded-full shadow-sm" />

                      {/* Photo Area */}
                      <div className="aspect-square w-full bg-[#F9FAFB] border border-[#E5E7EB] overflow-hidden rounded-sm">
                        <img 
                          src={art.thumbnail} 
                          alt={art.title} 
                          className="w-full h-full object-cover mix-blend-multiply"
                        />
                      </div>

                      {/* Handwritten feel caption area */}
                      <div className="pt-3 pb-2 text-center flex flex-col items-center">
                        <p className="text-[#333333] font-bold text-xs truncate w-full">{art.title}</p>
                        <p className="text-[#9CA3AF] font-mono text-[9px] mt-0.5">{new Date(art.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
            
            {/* End Mark */}
            <div className="flex justify-center mt-16 pb-10 relative z-10">
              <div className="w-10 h-10 bg-white rounded-full border border-[#E5E7EB] shadow-sm flex items-center justify-center text-accent-rose">
                <Heart className="w-5 h-5 fill-current" />
              </div>
            </div>
          </section>
        )}

        {/* Empty State */}
        {!isLoading && artworks.length === 0 && (
          <div className="text-center py-32">
            <div className="w-20 h-20 bg-white rounded-full border-2 border-dashed border-[#d1d5db] flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-8 h-8 text-[#9CA3AF]" />
            </div>
            <p className="text-[#717182] font-bold text-lg mb-1">아직 일기장에 쓰일 추억이 없어요.</p>
            <p className="text-[#9CA3AF] text-sm font-bold">가족과 함께 상상을 시작해 볼까요?</p>
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="text-center py-32 flex justify-center">
            <div className="w-10 h-10 border-4 border-accent-sage/20 border-t-accent-sage rounded-full animate-spin" />
          </div>
        )}

      </div>
    </div>
  );
}

// Subcomponents for Icons
function PaletteIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent-rose">
      <circle cx="13.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="10.5" r="2.5"/><circle cx="8.5" cy="7.5" r="2.5"/><circle cx="6.5" cy="12.5" r="2.5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>
    </svg>
  );
}

function CloudIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent-sky">
      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>
    </svg>
  );
}
