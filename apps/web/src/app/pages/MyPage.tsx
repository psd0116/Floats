import { motion, AnimatePresence } from "motion/react";
import { Settings, LogOut, ChevronRight, Grid, List, Loader2, Copy, Check, X, Trash2, Globe, Lock, PenTool, Calendar as CalendarIcon, Users, Edit3 } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../types";
import type { Artwork, UserStats, Badge, CalendarRecord, FamilyMember } from "../types";

const AVATARS = ['🐰', '🦊', '🐻', '🐼', '🦁', '🐶', '🐱', '🐸'];

export default function MyPage() {
  const navigate = useNavigate();
  
  // Data states
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [stats, setStats] = useState<UserStats>({ artworkCount: 0, commentCount: 0, streak: 0 });
  const [badges, setBadges] = useState<Badge[]>([]);
  const [calendar, setCalendar] = useState<CalendarRecord[]>([]);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  
  // User profile state
  const [user, setUser] = useState<{ id: string, name: string, email: string, familyCode: string, avatar: string } | null>(null);

  // UI states
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isEditMode, setIsEditMode] = useState(false);
  const [isProfileEdit, setIsProfileEdit] = useState(false);
  const [editName, setEditName] = useState("");
  const [editAvatar, setEditAvatar] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchAllData = async (token: string) => {
    try {
      const headers = { "Authorization": `Bearer ${token}` };
      
      const [artRes, authRes, statsRes, badgesRes, calRes, famRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/artworks/my`, { headers }),
        fetch(`${API_BASE_URL}/api/auth/me`, { headers }),
        fetch(`${API_BASE_URL}/api/user/stats`, { headers }),
        fetch(`${API_BASE_URL}/api/user/badges`, { headers }),
        fetch(`${API_BASE_URL}/api/user/calendar`, { headers }),
        fetch(`${API_BASE_URL}/api/user/family`, { headers }),
      ]);

      if (artRes.ok) setArtworks(await artRes.json());
      if (authRes.ok) {
        const userData = await authRes.json();
        setUser({ ...userData, avatar: userData.avatar || '🐰' });
        setEditName(userData.name || "");
        setEditAvatar(userData.avatar || '🐰');
      }
      if (statsRes.ok) setStats(await statsRes.json());
      if (badgesRes.ok) setBadges(await badgesRes.json());
      if (calRes.ok) setCalendar(await calRes.json());
      if (famRes.ok) setFamilyMembers(await famRes.json());
      
    } catch (err) {
      console.error("Failed to fetch data", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchAllData(token);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const copyFamilyCode = () => {
    if (user?.familyCode) {
      navigator.clipboard.writeText(user.familyCode);
      alert("가족 코드가 복사되었습니다!");
    }
  };

  const saveProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/user/profile`, {
        method: 'PUT',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name: editName, avatar: editAvatar })
      });
      if (res.ok) {
        const updated = await res.json();
        setUser(prev => prev ? { ...prev, name: updated.name, avatar: updated.avatar } : null);
        setIsProfileEdit(false);
      }
    } catch (e) {
      console.error(e);
      alert('프로필 수정에 실패했습니다.');
    }
  };

  const deleteArtwork = async (id: string) => {
    if (!confirm('정말 삭제할까요?')) return;
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      setDeletingId(id);
      const res = await fetch(`${API_BASE_URL}/api/artworks/${id}`, {
        method: 'DELETE',
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        setArtworks(prev => prev.filter(a => a.id !== id));
        // 통계 갱신은 생략하거나 다시 패치
        setStats(prev => ({ ...prev, artworkCount: prev.artworkCount - 1 }));
      } else {
        alert('삭제 실패했습니다.');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-background-comfort flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-accent-rose" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F4F8] pb-24 font-sans selection:bg-accent-sky/30">
      {/* --- Profile Header --- */}
      <section className="px-6 pt-14 pb-8 bg-white rounded-b-[40px] shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="flex justify-between items-start mb-6">
          <div className="flex gap-4 items-center">
            <div className="relative group cursor-pointer" onClick={() => setIsProfileEdit(true)}>
              <div className="w-20 h-20 rounded-[24px] bg-gradient-to-br from-accent-sky/20 to-accent-rose/20 border-4 border-white shadow-md flex items-center justify-center text-4xl transform group-hover:scale-105 transition-transform">
                {user.avatar}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-white p-1.5 rounded-full shadow-sm border border-[#E5E7EB]">
                <Edit3 className="w-4 h-4 text-[#9CA3AF]" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-black text-[#1F2937] tracking-tight">{user.name}</h1>
              <p className="text-sm font-semibold text-[#6B7280]">{user.email}</p>
            </div>
          </div>
          <button onClick={() => setIsProfileEdit(true)} className="p-2.5 rounded-2xl bg-[#F3F4F6] text-[#4B5563] hover:bg-[#E5E7EB] transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>

        {/* Stats Flex */}
        <div className="flex gap-3 mt-8">
          <div className="flex-1 bg-gradient-to-b from-[#FFF0F4] to-[#FFE4EC] p-4 rounded-[24px] text-center shadow-sm">
            <p className="text-[11px] font-bold text-accent-rose/70 uppercase">작품 수</p>
            <p className="text-2xl font-black text-accent-rose mt-1">{stats.artworkCount}</p>
          </div>
          <div className="flex-1 bg-gradient-to-b from-[#F0F7FF] to-[#E0F0FE] p-4 rounded-[24px] text-center shadow-sm">
            <p className="text-[11px] font-bold text-accent-sky/70 uppercase">연속 그림</p>
            <p className="text-2xl font-black text-accent-sky mt-1">{stats.streak}일</p>
          </div>
          <div className="flex-1 bg-gradient-to-b from-[#FDF4FF] to-[#FAE8FF] p-4 rounded-[24px] text-center shadow-sm">
            <p className="text-[11px] font-bold text-fuchsia-600/70 uppercase">받은 응원</p>
            <p className="text-2xl font-black text-fuchsia-600 mt-1">{stats.commentCount}</p>
          </div>
        </div>
      </section>

      {/* --- Family Code Card --- */}
      <section className="px-6 mt-8">
        <div className="bg-gradient-to-r from-accent-sky/90 to-accent-rose/90 p-1 rounded-[28px] shadow-lg">
          <div className="bg-white/95 backdrop-blur-sm rounded-[24px] p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-[16px] bg-[#F3F4F6] flex items-center justify-center">
                <Users className="w-6 h-6 text-[#4B5563]" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-[#6B7280] uppercase">가족 초대 코드</p>
                <p className="text-xl font-black text-[#1F2937] tracking-widest">{user.familyCode}</p>
              </div>
            </div>
            <button onClick={copyFamilyCode} className="px-4 py-2 bg-[#1F2937] text-white text-sm font-bold rounded-xl hover:bg-[#374151] transition-colors flex items-center gap-2">
              <Copy className="w-4 h-4" /> 복사
            </button>
          </div>
        </div>
      </section>

      {/* --- Activity Calendar (잔디밭) --- */}
      <section className="px-6 mt-10">
        <h2 className="text-lg font-black text-[#1F2937] mb-4 flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-accent-sky" /> 꼬마 화가의 잔디밭
        </h2>
        <div className="bg-white p-5 rounded-[28px] shadow-sm overflow-x-auto">
          {calendar.length > 0 ? (
            <div className="flex flex-col gap-1 w-max">
              {/* 12주 컬럼, 각 컬럼당 7일 (Row 단위 렌더링) */}
              {Array.from({ length: 7 }).map((_, dayIndex) => (
                <div key={dayIndex} className="flex gap-1">
                  {Array.from({ length: 12 }).map((_, weekIndex) => {
                    const record = calendar[weekIndex * 7 + dayIndex];
                    if (!record) return <div key={weekIndex} className="w-3.5 h-3.5 rounded-sm bg-transparent" />;
                    let color = 'bg-[#EBEDF0]';
                    if (record.count === 1) color = 'bg-[#9BE9A8]';
                    else if (record.count === 2) color = 'bg-[#40C463]';
                    else if (record.count >= 3) color = 'bg-[#30A14E]';
                    return (
                      <div 
                        key={weekIndex} 
                        className={`w-3.5 h-3.5 rounded-[4px] ${color}`} 
                        title={`${record.date}: ${record.count}개 작품`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          ) : (
             <div className="h-28 flex items-center justify-center text-sm font-bold text-[#9CA3AF]">
               로딩 중이거나 데이터가 없습니다.
             </div>
          )}
        </div>
      </section>

      {/* --- Badges --- */}
      <section className="px-6 mt-10">
        <h2 className="text-lg font-black text-[#1F2937] mb-4 flex items-center gap-2">
          <PenTool className="w-5 h-5 text-accent-rose" /> 나의 빛나는 뱃지
        </h2>
        <div className="flex gap-3 overflow-x-auto pb-4 hide-scrollbar">
          {badges.map(b => (
            <div key={b.id} className={`flex-shrink-0 w-[100px] p-4 rounded-[24px] text-center transition-all ${b.earned ? 'bg-white shadow-sm border border-transparent' : 'bg-[#E5E7EB]/50 border-2 border-dashed border-[#D1D5DB] opacity-60 grayscale'}`}>
              <div className="text-3xl mb-2">{b.emoji}</div>
              <p className="text-xs font-black text-[#1F2937] whitespace-nowrap">{b.name}</p>
              <p className="text-[9px] font-bold text-[#6B7280] mt-1 leading-tight">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- Collection Section --- */}
      <section className="px-6 mt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black text-[#1F2937]">컬렉션</h2>
          <div className="flex items-center gap-2">
            <button onClick={() => setIsEditMode(!isEditMode)} className={`text-xs font-bold px-3 py-1.5 rounded-full transition-colors ${isEditMode ? 'bg-[#1F2937] text-white' : 'bg-white text-[#4B5563] border border-[#E5E7EB]'}`}>
              {isEditMode ? '완료' : '편집'}
            </button>
            <div className="flex gap-1 bg-white p-1 rounded-xl shadow-sm border border-[#E5E7EB]">
              <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-[#F3F4F6] text-[#1F2937]' : 'text-[#9CA3AF]'}`}><Grid className="w-4 h-4" /></button>
              <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-[#F3F4F6] text-[#1F2937]' : 'text-[#9CA3AF]'}`}><List className="w-4 h-4" /></button>
            </div>
          </div>
        </div>

        {artworks.length > 0 ? (
          <div className={viewMode === 'grid' ? "grid grid-cols-2 gap-4" : "flex flex-col gap-4"}>
            {artworks.map((art) => (
              <motion.div
                layout
                key={art.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={viewMode === 'grid' ? "relative group" : "relative group flex gap-4 bg-white p-3 rounded-[24px] shadow-sm"}
              >
                <Link to={`/detail/${art.id}`} className={viewMode === 'grid' ? "" : "flex gap-4 flex-1 items-center"}>
                  <div className={`relative ${viewMode === 'grid' ? 'aspect-square rounded-[28px]' : 'w-24 h-24 rounded-[20px]'} overflow-hidden shadow-sm`}>
                    <img src={art.thumbnail} alt={art.title} className="w-full h-full object-cover" />
                    {/* Public Badge */}
                    <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded-full flex items-center gap-1">
                      {art.isPublic ? <Globe className="w-3 h-3 text-white" /> : <Lock className="w-3 h-3 text-white" />}
                    </div>
                  </div>
                  
                  {viewMode === 'list' && (
                    <div className="flex-1 min-w-0">
                      <h3 className="font-black text-[#1F2937] truncate text-lg pr-8">{art.title}</h3>
                      <p className="text-xs font-bold text-[#6B7280] mt-1">{new Date(art.createdAt).toLocaleDateString()}</p>
                    </div>
                  )}
                  
                  {viewMode === 'grid' && (
                    <div className="mt-2 pl-1">
                      <h3 className="font-extrabold text-sm text-[#374151] truncate pr-6">{art.title}</h3>
                    </div>
                  )}
                </Link>

                {isEditMode && (
                  <button 
                    onClick={(e) => { e.preventDefault(); deleteArtwork(art.id); }}
                    disabled={deletingId === art.id}
                    className={`absolute ${viewMode === 'grid' ? 'top-2 right-2' : 'top-3 right-3'} p-2.5 bg-destructive rounded-full text-white shadow-lg hover:bg-red-600 transition-colors z-10`}
                  >
                    {deletingId === art.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-[32px] border-2 border-dashed border-[#D1D5DB]">
            <p className="text-[#6B7280] font-bold">아직 컬렉션이 비어있어요.</p>
            <p className="text-[#9CA3AF] text-xs mt-1">첫 번째 상상을 그려보세요!</p>
          </div>
        )}
      </section>

      {/* --- Family Members --- */}
      {familyMembers.length > 0 && (
        <section className="px-6 mt-10">
          <h2 className="text-lg font-black text-[#1F2937] mb-4">함께하는 가족</h2>
          <div className="bg-white rounded-[28px] p-2 shadow-sm">
            {familyMembers.map((member, i) => (
              <div key={member.id} className={`flex items-center gap-4 p-3 ${i !== familyMembers.length - 1 ? 'border-b border-[#F3F4F6]' : ''}`}>
                <div className="w-12 h-12 rounded-xl bg-accent-sky/10 flex items-center justify-center text-2xl">
                  {member.avatar}
                </div>
                <div className="flex-1">
                  <p className="font-black text-[#1F2937]">{member.name}</p>
                  <p className="text-xs font-bold text-[#6B7280]">작품 {member.artworkCount}개</p>
                </div>
                {member.id === user.id && (
                  <span className="px-2.5 py-1 bg-accent-rose/10 text-accent-rose text-[10px] font-bold rounded-lg mr-2">나</span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* --- Logout --- */}
      <section className="px-6 mt-12 mb-8">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 p-5 bg-white border border-[#E5E7EB] rounded-[24px] text-[#6B7280] font-bold hover:bg-[#F9FAFB] hover:text-destructive transition-colors"
        >
          <LogOut className="w-5 h-5" /> 로그아웃
        </button>
      </section>

      {/* --- Profile Edit Modal --- */}
      <AnimatePresence>
        {isProfileEdit && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-sm rounded-[32px] p-6 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-[#1F2937]">프로필 수정</h3>
                <button onClick={() => setIsProfileEdit(false)} className="p-2 bg-[#F3F4F6] rounded-full text-[#6B7280]">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-6">
                <label className="block text-xs font-bold text-[#6B7280] mb-2 uppercase">아바타 선택</label>
                <div className="grid grid-cols-4 gap-3">
                  {AVATARS.map(emoji => (
                    <button 
                      key={emoji}
                      onClick={() => setEditAvatar(emoji)}
                      className={`text-3xl p-3 rounded-2xl transition-all ${editAvatar === emoji ? 'bg-accent-sky/20 border-2 border-accent-sky transform scale-105' : 'bg-[#F3F4F6] border-2 border-transparent hover:bg-[#E5E7EB]'}`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-xs font-bold text-[#6B7280] mb-2 uppercase">이름 / 닉네임</label>
                <input 
                  type="text" value={editName} onChange={e => setEditName(e.target.value)}
                  className="w-full bg-[#F3F4F6] border-none rounded-2xl p-4 font-bold text-[#1F2937] focus:ring-2 focus:ring-accent-sky outline-none"
                  placeholder="아이 이름이나 별명"
                />
              </div>

              <button 
                onClick={saveProfile}
                className="w-full py-4 bg-[#1F2937] text-white font-bold rounded-2xl text-lg shadow-lg"
              >
                저장하기
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
