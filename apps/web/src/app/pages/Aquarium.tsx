import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Sun, Moon, Volume2, VolumeX, Loader2, Info } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { API_BASE_URL } from "../types";
import type { Artwork } from "../types";

// Helper functions
const random = (min: number, max: number) => Math.random() * (max - min) + min;

// 한국어 조사 처리기 ("야" vs "이야" 등)
function getJosa(word: string, josa1: string, josa2: string) {
  if (!word || typeof word !== 'string') return josa1;
  const lastChar = word.charCodeAt(word.length - 1);
  if (lastChar < 0xAC00 || lastChar > 0xD7A3) return josa1; // 한글이 아니면 기본 반환
  const hasJongseong = (lastChar - 0xAC00) % 28 > 0;
  return hasJongseong ? josa2 : josa1;
}

export function Aquarium() {
  const navigate = useNavigate();
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Local Aquarium settings
  const [isNightMode, setIsNightMode] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(false);
  
  // Interaction states
  const [foods, setFoods] = useState<{ id: number; x: number; y: number }[]>([]);
  const [activeBubble, setActiveBubble] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers: any = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    // 개인화 데이터: 우리 가족이 그린 그림만 페칭
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

  const handleContainerClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('.fish-element')) return;
    
    setActiveBubble(null);

    // Drop food relative to the tank container
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newFood = { id: Date.now(), x, y };
    setFoods(prev => [...prev, newFood]);

    // Remove food after animation (4 seconds)
    setTimeout(() => {
      setFoods(prev => prev.filter(f => f.id !== newFood.id));
    }, 4000);
  };

  const toggleSound = () => setIsSoundOn(!isSoundOn);
  const toggleNightMode = () => setIsNightMode(!isNightMode);

  // Extract top 3 unique tags for the dashboard
  const topTags = Array.from(new Set(artworks.flatMap(art => art.tags))).slice(0, 3);

  return (
    // 앱 전역 테마(파스텔톤) 유지
    <div className="min-h-screen bg-background-comfort flex flex-col p-6 overflow-hidden relative">
      
      {/* Header (Consistent with Home.tsx and Detail.tsx) */}
      <header className="flex items-center justify-between mb-6 z-50">
        <button
          onClick={() => navigate("/")}
          className="w-12 h-12 rounded-2xl bg-white border-2 border-white flex items-center justify-center shadow-sm text-[#717182] hover:text-[#333333] transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h3 className="text-[#333333] font-bold text-2xl tracking-tight">둥둥 수족관</h3>
        <div className="w-12" /> {/* Layout balancer */}
      </header>

      {/* Main Glassmorphism Tank Container */}
      <div 
        className="flex-1 relative rounded-[48px] bg-white/40 backdrop-blur-xl border-2 border-white shadow-2xl overflow-hidden glass transition-all duration-1000"
      >
        {/* Tank inner background strictly scoped to this container */}
        <div className={`absolute inset-0 transition-colors duration-1000 ${
            isNightMode ? 'bg-indigo-950/80' : 'bg-cyan-100/50'
          }`} 
        />
      
        {/* Local Settings Panel (Clearly attached to the tank, not global) */}
        <div className="absolute top-6 right-6 flex gap-3 z-50 bg-white/60 backdrop-blur-md px-4 py-2.5 rounded-2xl border-2 border-white shadow-sm">
          <p className="text-[10px] uppercase font-bold text-[#9CA3AF] self-center mr-2 tracking-widest hidden sm:block">환경 설정</p>
          <button
            onClick={toggleSound}
            className={`transition-colors ${isSoundOn ? 'text-accent-rose' : 'text-[#9ca3af]'}`}
          >
            {isSoundOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
          <div className="w-px h-5 bg-white mx-1 self-center" />
          <button
            onClick={toggleNightMode}
            className={`transition-colors ${isNightMode ? 'text-blue-200' : 'text-orange-400'}`}
          >
            {isNightMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
        </div>

        {/* Dashboard: Personalized Family Info */}
        <motion.div 
          className="absolute bottom-6 left-6 z-50 bg-white/80 backdrop-blur-xl p-5 rounded-[32px] border-2 border-white shadow-lg pointer-events-auto min-w-[200px]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Info className="w-4 h-4 text-accent-sky" />
            <span className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wide">수족관 정보</span>
          </div>
          <h4 className="text-[#333333] font-bold text-lg mb-1">우리 가족 물고기</h4>
          <p className="text-xl font-extrabold text-accent-rose mb-3">총 {artworks.length}마리</p>
          
          <div className="flex gap-1.5 flex-wrap">
            {topTags.map(tag => (
              <span key={tag} className="text-[10px] px-2.5 py-1 rounded-full bg-[#F3F4ED] text-[#717182] font-bold border border-white">
                #{tag}
              </span>
            ))}
            {topTags.length === 0 && <span className="text-[10px] text-[#9CA3AF]">아직 특징이 없어요</span>}
          </div>
        </motion.div>

        {/* Tank Activity Area */}
        <div 
          ref={containerRef}
          className="absolute inset-0 z-10 w-full h-full cursor-pointer"
          onClick={handleContainerClick}
        >
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <Loader2 className={`w-12 h-12 animate-spin ${isNightMode ? 'text-white/50' : 'text-accent-sky/50'}`} />
            </div>
          ) : (
            <>
              {artworks.map((art, i) => (
                <FishElement 
                  key={art.id} 
                  art={art} 
                  index={i} 
                  isNightMode={isNightMode}
                  isActive={activeBubble === art.id}
                  onSelect={() => setActiveBubble(activeBubble === art.id ? null : art.id)}
                />
              ))}

              {artworks.length === 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <div className="w-24 h-24 rounded-full bg-white/40 flex items-center justify-center border-2 border-dashed border-white mb-4">
                    <span className="text-4xl">🐠</span>
                  </div>
                  <p className={`font-bold text-lg ${isNightMode ? 'text-white/80' : 'text-[#717182]'}`}>
                    가족 그림이 없어요. 처음으로 그려볼까요?
                  </p>
                </div>
              )}
            </>
          )}

          {/* Render Falling Foods with better animation */}
          <AnimatePresence>
            {foods.map((food) => (
              <motion.div
                key={food.id}
                initial={{ x: food.x - 10, y: food.y - 10, scale: 0, opacity: 1, rotate: 0 }}
                animate={{ 
                  y: food.y + 300, 
                  opacity: [1, 1, 0], 
                  scale: [1, 1.2, 0.5],
                  rotate: [0, 180, 360],
                  x: food.x - 10 + random(-20, 20) // slight swaying
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 4, ease: "easeIn" }}
                className="absolute w-4 h-4 rounded-[6px] bg-[#FFD166] shadow-[0_4px_10px_rgba(255,209,102,0.8)] border-2 border-white z-20 pointer-events-none"
              />
            ))}
          </AnimatePresence>
        </div>
        
        {/* Bubbles Generator background overlay */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute rounded-full border-[1.5px] border-white/40 ${isNightMode ? 'bg-white/10' : 'bg-white/20'}`}
              style={{
                width: random(10, 25),
                height: random(10, 25),
                left: `${random(10, 90)}%`,
              }}
              animate={{
                y: ['100%', '-10%'],
                x: [0, random(-30, 30), 0],
              }}
              transition={{
                duration: random(8, 15),
                repeat: Infinity,
                ease: "linear",
                delay: random(0, 5),
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Fish Component
function FishElement({ art, index, isNightMode, isActive, onSelect }: { 
  art: Artwork; 
  index: number; 
  isNightMode: boolean;
  isActive: boolean;
  onSelect: () => void;
}) {
  const [direction, setDirection] = useState(1); // 1 = right, -1 = left
  // Keep random boundaries slightly inside the tank so they don't get cut off
  const startX = random(5, 80); // percentage
  const startY = random(10, 60); // percentage
  const duration = random(15, 25); 
  
  // 조사 '야/이야' 자동 판별
  const helloGreeting = `난 ${art.title}${getJosa(art.title, "야", "이야")} 🐟`;
  
  return (
    <motion.div
      className="absolute fish-element z-20"
      initial={{ left: `${startX}%`, top: `${startY}%` }}
      animate={{
        y: [`${startY}%`, `${startY - random(3, 8)}%`, `${startY}%`],
        x: [`${startX}%`, `${startX + random(10, 25) * direction}%`, `${startX}%`],
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        ease: "easeInOut",
        y: {
          duration: random(3, 5),
          repeat: Infinity,
          ease: "easeInOut",
        }
      }}
    >
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.8 }}
            animate={{ opacity: 1, y: -20, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute -top-16 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-xl px-4 py-2.5 rounded-[20px] shadow-sm border-2 border-white min-w-max z-50 flex flex-col items-center"
          >
            <div className="absolute -bottom-[10px] left-1/2 -translate-x-1/2 border-solid border-t-white/95 border-t-[10px] border-x-transparent border-x-[10px] border-b-0" />
            <p className="text-[#333333] font-bold text-sm tracking-tight">안녕! {helloGreeting}</p>
            <p className="text-[#9CA3AF] text-[10px] mt-0.5 font-bold uppercase tracking-widest">{art.user?.name || "가족"}이(가) 그렸어요</p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className={`relative cursor-pointer transition-all duration-500 rounded-[32px] overflow-hidden shadow-sm ${
          isNightMode ? 'shadow-[0_0_20px_rgba(255,255,255,1)]' : ''
        }`}
        style={{ width: random(80, 110), height: random(80, 110) }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
          setDirection(d => -d);
        }}
        // Pseudo 3D effect
        animate={{ rotateY: direction === 1 ? 0 : 180 }}
        transition={{ duration: 0.6 }}
      >
        <div className="absolute inset-0 border-[3px] border-white rounded-[32px] z-10 pointer-events-none" />
        <img 
          src={art.thumbnail} 
          alt={art.title} 
          className="w-full h-full object-cover"
        />
        {isNightMode && (
          <div className="absolute inset-0 bg-blue-500/20 mix-blend-overlay pointer-events-none rounded-[32px] transition-colors duration-1000" />
        )}
      </motion.div>
    </motion.div>
  );
}
