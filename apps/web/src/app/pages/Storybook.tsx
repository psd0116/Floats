import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, BookOpen, Sparkles, Wand2, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { API_BASE_URL } from "../types";
import type { Artwork } from "../types";

// Helper: 한국어 조사 판별
const getJosa = (word: string, josa1: string, josa2: string) => {
  if (!word) return josa1;
  const lastChar = word.charCodeAt(word.length - 1);
  if (lastChar < 0xAC00 || lastChar > 0xD7A3) return josa1;
  const hasJongseong = (lastChar - 0xAC00) % 28 > 0;
  return hasJongseong ? josa2 : josa1;
};

// Story Generation Logic (Mock)
type StoryPage = { text: string; imageUrl?: string };

function generateStory(art: Artwork): StoryPage[] {
  const name = art.title;
  const i = getJosa(name, '가', '이가');
  const eun = getJosa(name, '는', '은');
  const eul = getJosa(name, '를', '을');
  const feature = art.tags.length > 0 ? art.tags[0] : "반짝반짝";
  
  // Choose random template
  const isAdventure = Math.random() > 0.5;

  if (isAdventure) {
    return [
      { text: `용감한 ${name}${getJosa(name, '의', '의')} 대모험`, imageUrl: art.thumbnail }, // Cover
      { text: `어느 맑은 날, ${name}${i} 신비한 숲속으로 모험을 떠났어요. "${feature} 친구들이 도와줄 거야!"` },
      { text: `숲속에서 길을 잃은 꼬마 요정을 발견했어요. ${name}${eun} 용기를 내어 요정을 구해주었답니다.` },
      { text: `요정은 고마움의 선물로 ${name}에게 마법의 가루를 주었어요. 정말 신나는 하루였죠! 끝.` }
    ];
  } else {
    return [
      { text: `별빛 마을의 ${name}`, imageUrl: art.thumbnail }, // Cover
      { text: `밤하늘이 예쁜 별빛 마을에 ${name}${i} 살고 있었어요. ${name}${eun} 밤마다 노래를 룰루랄라 불렀지요.` },
      { text: `어느 날, 커다란 별똥별이 떨어졌어요. ${name}${eun} 소원을 빌러 달리기 시작했어요.` },
      { text: `"${feature} 나의 친구들이 모두 행복하게 해주세요!" 소원이 이루어진 예쁜 밤이었어요. 끝.` }
    ];
  }
}

export function Storybook() {
  const navigate = useNavigate();
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Application Modes: 'SELECT' | 'MAGIC' | 'READ'
  const [mode, setMode] = useState<'SELECT' | 'MAGIC' | 'READ'>('SELECT');
  const [selectedArt, setSelectedArt] = useState<Artwork | null>(null);
  const [story, setStory] = useState<StoryPage[]>([]);
  const [currentPage, setCurrentPage] = useState(0);

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

  // Handle Character Selection
  const handleSelect = (art: Artwork) => {
    setSelectedArt(art);
    setMode('MAGIC');
    
    // Generate Story
    setStory(generateStory(art));
    setCurrentPage(0);

    // Fake AI Processing Time
    setTimeout(() => {
      setMode('READ');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-background-comfort flex flex-col hide-scrollbar relative overflow-hidden">
      
      {/* Header */}
      {mode === 'SELECT' && (
        <header className="px-6 py-6 flex items-center justify-between z-10">
          <button
            onClick={() => navigate("/")}
            className="w-12 h-12 rounded-2xl bg-white border-2 border-white flex items-center justify-center shadow-sm text-[#717182] hover:text-[#333333] transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex flex-col items-center">
            <h1 className="text-[#333333] font-bold text-xl tracking-wide flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-accent-lavender" />
              AI 동화책
            </h1>
            <p className="text-[#9CA3AF] text-[10px] font-bold tracking-widest uppercase mt-0.5">magical storybook</p>
          </div>
          <div className="w-12" /> {/* Spacer */}
        </header>
      )}

      {/* --- MODE 1: SELECT --- */}
      {mode === 'SELECT' && (
        <motion.div 
          className="flex-1 flex flex-col px-6 pb-12"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        >
          <div className="bg-white/60 backdrop-blur-md rounded-[32px] p-8 border-2 border-white shadow-sm flex flex-col items-center gap-2 mb-8 text-center mt-4">
            <Wand2 className="w-8 h-8 text-accent-rose mb-2" />
            <h2 className="text-[#333333] font-bold text-xl">오늘 이야기의 주인공은 누구일까요?</h2>
            <p className="text-[#717182] text-sm">가족이 그린 작품을 하나 골라 마법 동화를 만들어보세요!</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {isLoading ? (
              <div className="col-span-2 flex justify-center py-20">
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}>
                  <Sparkles className="w-10 h-10 text-accent-lavender" />
                </motion.div>
              </div>
            ) : artworks.length > 0 ? (
              artworks.map((art, i) => (
                <motion.div
                  key={art.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => handleSelect(art)}
                  className="bg-white rounded-[28px] border-2 border-transparent hover:border-accent-lavender shadow-sm p-4 cursor-pointer group flex flex-col items-center relative"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="w-full aspect-square rounded-[20px] overflow-hidden bg-[#F3F4F6] relative z-10 shadow-inner">
                    <img src={art.thumbnail} alt={art.title} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-[#333333] font-extrabold text-sm mt-3 truncate w-full text-center">{art.title}</h3>
                  <div className="absolute inset-0 bg-accent-lavender/5 rounded-[28px] opacity-0 group-hover:opacity-100 transition-opacity z-0 pointer-events-none" />
                </motion.div>
              ))
            ) : (
              <div className="col-span-2 text-center py-20 bg-white/40 rounded-[32px] border-2 border-dashed border-white">
                <p className="text-[#717182] font-bold">앗, 주인공이 아무도 없어요!</p>
                <p className="text-[#9CA3AF] text-xs mt-1">작품을 먼저 등록해주세요.</p>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* --- MODE 2: MAGIC PROCESSING --- */}
      {mode === 'MAGIC' && selectedArt && (
        <motion.div 
          className="absolute inset-0 z-50 bg-accent-lavender/90 backdrop-blur-3xl flex flex-col items-center justify-center"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        >
          <div className="relative w-48 h-48 mb-8">
            <motion.div 
              className="absolute inset-0 bg-white rounded-full opacity-20 blur-2xl"
              animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <div className="w-48 h-48 rounded-[40px] border-4 border-white overflow-hidden shadow-2xl relative z-10 animate-float bg-white">
              <img src={selectedArt.thumbnail} alt={selectedArt.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-accent-lavender/50 to-transparent mix-blend-multiply" />
            </div>
          </div>
          
          <h2 className="text-white text-2xl font-black tracking-tight mb-2">요정 둥둥이가 줄거리를 짜고 있어요!</h2>
          <p className="text-white/80 font-bold mb-8">잠시만 기다려주세요 ✨</p>
          
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-3 h-3 bg-white rounded-full"
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* --- MODE 3: READER --- */}
      {mode === 'READ' && (
        <motion.div 
          className="absolute inset-0 z-40 bg-[#FDFBF7] flex flex-col"
          initial={{ y: '100%' }} animate={{ y: 0 }} transition={{ type: "spring", stiffness: 200, damping: 25 }}
        >
          {/* Reader Header */}
          <header className="px-6 py-4 flex items-center justify-between z-50">
            <button
              onClick={() => { setMode('SELECT'); setStory([]); setCurrentPage(0); }}
              className="w-10 h-10 rounded-full bg-white border border-[#E5E7EB] shadow-sm flex items-center justify-center text-[#9CA3AF] hover:text-[#333333] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-1.5">
              {story.map((_, i) => (
                <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === currentPage ? 'w-6 bg-accent-lavender' : 'w-2 bg-[#E5E7EB]'}`} />
              ))}
            </div>
            <div className="w-10 h-10" />
          </header>

          {/* Book Content Area */}
          <div className="flex-1 relative flex items-center justify-center overflow-hidden px-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, x: 50, rotateY: 10 }} // pseudo 3D turn
                animate={{ opacity: 1, x: 0, rotateY: 0 }}
                exit={{ opacity: 0, x: -50, rotateY: -10 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-lg aspect-[4/5] bg-white rounded-r-[32px] rounded-l-[16px] shadow-[-10px_20px_40px_rgba(0,0,0,0.1)] border border-[#E5E7EB] border-l-[12px] flex flex-col relative"
                style={{ transformOrigin: "left center" }} // Binder on the left
              >
                {/* Visual binder details */}
                <div className="absolute left-0 top-1/4 bottom-1/4 w-[2px] bg-black/5" />
                <div className="absolute left-2 top-8 bottom-8 w-[1px] bg-black/10" />

                {currentPage === 0 ? (
                  // TITLE PAGE
                  <div className="flex-1 flex flex-col items-center justify-center p-8 bg-linear-to-b from-white to-[#F9FAFB] rounded-r-[20px]">
                    <div className="w-48 h-48 rounded-full border-[6px] border-white shadow-xl overflow-hidden mb-8 relative">
                      <img src={story[0].imageUrl} className="w-full h-full object-cover" alt="" />
                      <div className="absolute inset-0 bg-accent-lavender/10 mix-blend-overlay" />
                    </div>
                    <h2 className="text-[#333333] text-2xl font-black text-center leading-snug tracking-tight">
                      {story[0].text}
                    </h2>
                    <p className="mt-4 text-[#9CA3AF] text-sm font-bold tracking-widest uppercase">
                      AI 동화책 시리즈
                    </p>
                  </div>
                ) : (
                  // STORY PAGE
                  <div className="flex-1 flex flex-col p-8 md:p-12 relative">
                    <div className="absolute top-6 right-8 text-[#E5E7EB] text-4xl font-black opacity-30 select-none">
                      {currentPage}
                    </div>
                    <div className="flex-1 flex items-center">
                      <p className="text-[#333333] text-xl md:text-2xl font-bold leading-relaxed tracking-tight break-keep text-center w-full">
                        {story[currentPage].text}
                      </p>
                    </div>
                    
                    {currentPage === story.length - 1 && (
                      <div className="mt-auto pt-6 border-t-2 border-dashed border-[#F3F4ED] flex justify-center">
                        <div className="flex items-center gap-2 text-accent-rose font-bold bg-[#FFF1F2] px-4 py-2 rounded-full">
                          <Check className="w-4 h-4" />
                          <span>다 읽었어요!</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Controls */}
          <div className="px-6 py-8 flex items-center justify-between max-w-md mx-auto w-full z-50">
            <button
              disabled={currentPage === 0}
              onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                currentPage === 0 ? 'bg-white/50 text-[#D1D5DB] border-2 border-transparent shadow-none' : 'bg-white border-2 border-white shadow-md text-[#333333] hover:text-accent-lavender'
              }`}
            >
              <ChevronLeft className="w-6 h-6 mr-1" />
            </button>

            <span className="text-[#9CA3AF] font-bold text-sm tracking-widest select-none">
              {currentPage + 1} / {story.length}
            </span>

            <button
              onClick={() => {
                if (currentPage < story.length - 1) {
                  setCurrentPage(p => p + 1);
                } else {
                  setMode('SELECT'); // End book
                }
              }}
              className="w-14 h-14 rounded-full flex items-center justify-center bg-white border-2 border-white shadow-md text-[#333333] hover:text-accent-lavender transition-all"
            >
              {currentPage === story.length - 1 ? (
                <Check className="w-6 h-6" /> // Finish
              ) : (
                <ChevronRight className="w-6 h-6 ml-1" />
              )}
            </button>
          </div>
        </motion.div>
      )}

    </div>
  );
}
