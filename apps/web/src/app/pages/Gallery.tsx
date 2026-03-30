import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, Play, Pause, Volume2, VolumeX, Sparkles } from "lucide-react";
import { API_BASE_URL } from "../types";
import type { Artwork } from "../types";

export function Gallery() {
  const navigate = useNavigate();
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers: any = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    fetch(`${API_BASE_URL}/api/artworks?type=family`, { headers })
      .then(res => res.json())
      .then(data => {
        setArtworks(Array.isArray(data) ? data : []);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch artworks", err);
        setIsLoading(false);
      });
  }, []);

  // Auto-scrolling feature for "Play" mode
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying && scrollRef.current) {
      interval = setInterval(() => {
        if (scrollRef.current) {
          const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
          if (scrollLeft + clientWidth >= scrollWidth - 10) {
            scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            scrollRef.current.scrollBy({ left: clientWidth, behavior: 'smooth' });
          }
        }
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="h-screen bg-[#FDFBF7] overflow-hidden flex flex-col font-sans relative selection:bg-accent-rose/20">
      
      {/* --- 무대 분위기 (Stage Effects) --- */}
      {/* 1. Backdrop ambient lighting */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_#ffffff_0%,_#FDFBF7_70%)] opacity-100 z-0" />
      
      {/* 2. Side Stage Curtains (Soft Vignette) */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#F0EDDF]/40 to-transparent pointer-events-none z-0" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#F0EDDF]/40 to-transparent pointer-events-none z-0" />

      {/* 3. Top Spotlights Colors */}
      <div className="absolute -top-20 -left-20 w-[400px] h-[400px] bg-accent-sky/20 rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="absolute -top-20 -right-20 w-[400px] h-[400px] bg-accent-rose/20 rounded-full blur-[100px] pointer-events-none z-0" />

      {/* 4. Curved Stage Floor */}
      <div className="absolute -bottom-[20vh] -left-[10vw] w-[120vw] h-[55vh] bg-gradient-to-t from-white to-[#FDFBF7] rounded-[100%] border-t-4 border-white shadow-[0_-10px_40px_rgba(0,0,0,0.02)] pointer-events-none z-0" />


      {/* --- Header (Museum Navigation) --- */}
      <header className="absolute top-0 left-0 right-0 z-50 px-6 py-6 flex items-center justify-between">
        <button
          onClick={() => navigate("/")}
          className="w-12 h-12 rounded-full bg-white/60 backdrop-blur-md border border-white flex items-center justify-center text-[#717182] hover:bg-white transition-colors shadow-sm"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        
        <div className="text-center px-6 py-2 bg-white/40 backdrop-blur-md rounded-full border border-white shadow-sm flex flex-col items-center">
          <h1 className="text-[#333333] font-black text-sm tracking-widest flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-accent-sky" />
            온택트 갤러리
            <Sparkles className="w-4 h-4 text-accent-rose" />
          </h1>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="w-12 h-12 rounded-full bg-white/60 backdrop-blur-md border border-white flex items-center justify-center text-[#717182] hover:bg-white transition-colors shadow-sm"
            title={isMuted ? "BGM 켜기" : "BGM 끄기"}
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-[#9CA3AF]" /> : <Volume2 className="w-5 h-5" />}
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`w-12 h-12 rounded-[24px] border-2 border-white flex items-center justify-center text-white transition-all shadow-md ${isPlaying ? 'bg-accent-rose' : 'bg-[#1F2937]'}`}
            title={isPlaying ? "전시 멈춤" : "자동 관람"}
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-1" />}
          </button>
        </div>
      </header>

      {/* --- 3D Gallery View --- */}
      <div 
        ref={scrollRef}
        className="flex-1 flex overflow-x-auto overflow-y-hidden snap-x snap-mandatory hide-scrollbar items-center relative z-10"
      >
        {isLoading ? (
          <div className="w-full h-full absolute inset-0 flex justify-center items-center z-10">
            <div className="text-[#9CA3AF] text-sm font-bold tracking-widest animate-pulse mb-10">무대를 준비하고 있습니다...</div>
          </div>
        ) : artworks.length > 0 ? (
          <>
            <div className="w-[10vw] shrink-0 snap-center" />
            
            {artworks.map((art, index) => (
              <GalleryItem key={art.id} art={art} index={index} navigate={navigate} />
            ))}
            
            <div className="w-[10vw] shrink-0 snap-center" />
          </>
        ) : (
          <div className="w-full h-full absolute inset-0 flex flex-col items-center justify-center z-10 space-y-4 mb-10">
            <p className="tracking-widest font-black text-[#717182] text-lg">아직 전시된 가족의 주인공이 없어요!</p>
            <p className="text-sm font-bold text-[#9CA3AF] -mt-2">업로드 화면에서 첫 작품을 올려볼까요?</p>
            <button 
              onClick={() => navigate('/upload')}
              className="mt-2 px-8 py-3 bg-white border border-[#E5E7EB] rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all text-sm font-black text-[#333333]"
            >
              첫 주인공 되기
            </button>
          </div>
        )}
      </div>

      <audio ref={audioRef} loop muted={isMuted}>
        {/* Placeholder for actual audio source */}
        <source src="https://assets.mixkit.co/music/preview/mixkit-relaxing-nature-413.mp3" type="audio/mpeg" />
      </audio>
    </div>
  );
}

// Separate component for each artwork to handle intersection/motion easily
function GalleryItem({ art, index, navigate }: { art: Artwork, index: number, navigate: any }) {
  const itemRef = useRef<HTMLDivElement>(null);

  const frameColors = ['bg-[#FFEACB]', 'bg-[#E5F3FF]', 'bg-[#FEE5E5]', 'bg-[#E8F5E9]'];
  const frameColor = frameColors[index % frameColors.length];

  return (
    <motion.div
      ref={itemRef}
      className="w-[85vw] max-w-md shrink-0 h-[80%] flex flex-col items-center justify-center snap-center px-4 relative group"
      initial={{ opacity: 0, scale: 0.85, y: 30 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ amount: 0.5 }}
      transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
    >
      {/* Main Spotlight from above */}
      <div className="absolute -top-[20vh] w-[200px] h-[500px] bg-gradient-to-b from-white/80 via-white/20 to-transparent blur-[40px] rounded-full pointer-events-none transition-opacity duration-1000 group-hover:opacity-100 opacity-60 mix-blend-overlay z-0" />

      {/* Floating Art Frame Container */}
      <div 
        className="relative cursor-pointer transition-transform duration-700 ease-out group-hover:-translate-y-4 z-10"
        onClick={() => navigate(`/detail/${art.id}`)}
      >
        {/* The Frame */}
        <div className={`p-4 md:p-6 ${frameColor} rounded-[32px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15),_0_0_0_1px_rgba(255,255,255,0.5)] border-4 border-white relative z-10`}>
          <div className="p-4 md:p-8 bg-white rounded-[20px] shadow-[inset_0_4px_15px_rgba(0,0,0,0.03)] border-2 border-[#F3F4F6]">
            <div className="relative shadow-[3px_8px_20px_rgba(0,0,0,0.08)] rounded-xl overflow-hidden">
              <img 
                src={art.thumbnail} 
                alt={art.title}
                className="w-full h-auto max-h-[45vh] object-contain bg-[var(--art-color,white)]"
                style={{ '--art-color': art.color || '#ffffff' } as any}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-white/40 pointer-events-none mix-blend-overlay" />
            </div>
          </div>
        </div>

        {/* Floor Shadow for 3D Floating Effect */}
        <div className="absolute -bottom-10 left-[10%] w-[80%] h-6 bg-black/10 blur-[12px] rounded-[100%] transition-transform duration-700 group-hover:scale-110 group-hover:opacity-60" />
      </div>

      {/* Museum Nameplate Plaque (Resting on the floor / Stage) */}
      <div className="relative mt-16 z-20" style={{ perspective: '800px' }}>
        <motion.div 
          className="bg-white px-8 py-5 rounded-2xl shadow-[0_15px_30px_rgb(0,0,0,0.08)] border-2 border-white text-center min-w-[280px] w-max max-w-[320px] transform-gpu"
          initial={{ rotateX: 30, opacity: 0, y: 10 }}
          whileInView={{ rotateX: 10, opacity: 1, y: 0 }}
          viewport={{ amount: 0.8 }}
          transition={{ delay: 0.2, duration: 0.6, type: "spring" }}
          style={{ transformOrigin: 'bottom' }}
        >
          {/* Plaque highlight */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent-sky/50 to-transparent opacity-50 rounded-t-2xl" />
          
          <h3 className="text-[#1F2937] font-black text-xl tracking-tight mb-2 truncate px-2">{art.title}</h3>
          
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="h-1 w-2 bg-[#F3F4F6] rounded-full" />
            <div className="h-1.5 w-6 bg-accent-rose/40 rounded-full" />
            <div className="h-1.5 w-6 bg-accent-sky/40 rounded-full" />
            <div className="h-1 w-2 bg-[#F3F4F6] rounded-full" />
          </div>
          
          <div className="flex flex-col gap-0.5">
            <p className="text-[#4B5563] text-sm font-extrabold tracking-widest">{art.user?.name || "꼬마 화가"}</p>
            <p className="text-[#9CA3AF] text-[10px] tracking-widest font-bold font-mono">{new Date(art.createdAt).toLocaleDateString()}</p>
          </div>
        </motion.div>
      </div>

    </motion.div>
  );
}
