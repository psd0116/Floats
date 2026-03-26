import { motion } from "motion/react";
import { Settings, LogOut, ChevronRight, Heart, Grid, List, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../types";
import type { Artwork } from "../types";



export default function MyPage() {
  const navigate = useNavigate();
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const user = {
    name: storedUser.name || "친구",
    email: storedUser.email || "guest@example.com",
    profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop"
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    fetch(`${API_BASE_URL}/api/artworks/my`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setArtworks(Array.isArray(data) ? data : []);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch my artworks", err);
        setIsLoading(false);
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const copyFamilyCode = () => {
    navigator.clipboard.writeText(storedUser.familyCode || "");
    alert("가족 코드가 복사되었습니다!");
  };

  return (
    <div className="min-h-screen bg-background-comfort pb-20">
      {/* Profile Header */}
      <section className="px-6 pt-12 pb-8 bg-white/40 border-b border-white/60 backdrop-blur-sm">
        <div className="flex items-start justify-between mb-8">
          <div className="flex gap-5 items-center">
            <div className="w-20 h-20 rounded-[30px] border-4 border-white shadow-xl overflow-hidden">
              <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-[#333333] mb-1">{user.name}</h1>
              <div className="flex items-center gap-2">
                <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider">{user.email}</p>
                <div className="h-3 w-[1px] bg-[#E5E7EB]" />
                <button 
                  onClick={copyFamilyCode}
                  className="text-[10px] font-extrabold text-accent-sky hover:underline flex items-center gap-1"
                >
                  코드: {storedUser.familyCode}
                </button>
              </div>
            </div>
          </div>
          <button className="p-3 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm text-[#717182] hover:bg-[#F9FAFB] transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>

        <div className="flex gap-4">
          <div className="flex-1 bg-white/80 p-4 rounded-3xl border border-white shadow-sm text-center">
            <p className="text-[10px] font-bold text-[#9CA3AF] uppercase mb-1">작품 수</p>
            <p className="text-xl font-extrabold text-[#333333]">{artworks.length}</p>
          </div>
          <div className="flex-1 bg-white/80 p-4 rounded-3xl border border-white shadow-sm text-center">
            <p className="text-[10px] font-bold text-[#9CA3AF] uppercase mb-1">받은 응원</p>
            <p className="text-xl font-extrabold text-accent-rose">0</p>
          </div>
        </div>
      </section>

      {/* Collection Section */}
      <section className="px-6 mt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-extrabold text-[#333333]">나의 둥둥 컬렉션</h2>
          <div className="flex gap-1 bg-white/60 p-1 rounded-xl border border-white">
            <button className="p-1.5 rounded-lg bg-white shadow-sm text-[#333333]"><Grid className="w-4 h-4" /></button>
            <button className="p-1.5 rounded-lg text-[#9CA3AF]"><List className="w-4 h-4" /></button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-accent-rose" />
          </div>
        ) : artworks.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {artworks.map((art, index) => (
              <motion.div
                key={art.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <Link to={`/detail/${art.id}`}>
                  <div className="relative aspect-square rounded-[32px] overflow-hidden border-2 border-white shadow-md group-hover:shadow-lg transition-all">
                    <img src={art.thumbnail} alt={art.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                      <p className="text-white text-xs font-bold truncate">{art.title}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white/40 rounded-[40px] border-2 border-dashed border-white/60">
            <p className="text-[#717182] font-bold">아직 컬렉션이 비어있어요.</p>
            <p className="text-[#9CA3AF] text-xs mt-1">첫 번째 상상을 그려보세요!</p>
          </div>
        )}
      </section>

      {/* Action Menu */}
      <section className="px-6 mt-10 space-y-3">
        <button className="w-full flex items-center justify-between p-5 bg-white/80 border-2 border-white rounded-3xl shadow-sm text-[#333333] font-bold group hover:border-accent-sky/30 transition-all">
          <div className="flex gap-4 items-center">
            <div className="w-10 h-10 rounded-xl bg-accent-sky/10 flex items-center justify-center text-accent-sky">
              <Heart className="w-5 h-5" />
            </div>
            <span>응원 보낸 거울</span>
          </div>
          <ChevronRight className="w-5 h-5 text-[#9CA3AF] group-hover:translate-x-1 transition-transform" />
        </button>

        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 p-5 bg-destructive/5 border-2 border-destructive/10 rounded-3xl text-destructive font-bold hover:bg-destructive/10 transition-all mt-6"
        >
          <LogOut className="w-5 h-5" />
          로그아웃
        </button>
      </section>

      <div className="h-10" />
    </div>
  );
}
