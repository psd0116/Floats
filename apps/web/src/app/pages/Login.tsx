import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Mail, Lock, User as UserIcon, AlertCircle, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { API_BASE_URL } from "../types";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [familyCode, setFamilyCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/signup";
      const body = isLogin ? { email, password } : { email, password, name, familyCode };

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "문제가 발생했습니다. 다시 시도해 주세요.");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/mypage");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-comfort flex items-center justify-center px-6 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10">
          <motion.h1 
            className="text-4xl font-extrabold text-[#333333] mb-2"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            둥둥
          </motion.h1>
          <p className="text-[#717182] text-sm">
            {isLogin ? "다시 오신 것을 환영해요!" : "아이의 상상을 기록하는 첫 걸음"}
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl border-2 border-white rounded-[40px] p-8 shadow-xl relative overflow-hidden">
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-2xl flex items-center gap-3 text-destructive text-xs font-bold"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#717182] uppercase ml-1">이름</label>
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#F3F4ED] border border-[#E5E7EB] rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent-sky/30 transition-all font-medium disabled:opacity-50"
                      placeholder="이름을 입력하세요"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#717182] uppercase ml-1">가족 코드 (선택)</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
                    <input 
                      type="text" 
                      value={familyCode}
                      onChange={(e) => setFamilyCode(e.target.value)}
                      className="w-full bg-[#F3F4ED] border border-[#E5E7EB] rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent-sky/30 transition-all font-medium disabled:opacity-50"
                      placeholder="기존 가족 코드가 있다면 입력하세요"
                      disabled={isLoading}
                    />
                  </div>
                  <p className="text-[10px] text-[#9CA3AF] ml-1">* 입력하지 않으면 새로운 가족 코드가 생성됩니다.</p>
                </div>
              </>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-[#717182] uppercase ml-1">이메일</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#F3F4ED] border border-[#E5E7EB] rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent-sky/30 transition-all font-medium disabled:opacity-50"
                  placeholder="name@example.com"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-[#717182] uppercase ml-1">비밀번호</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#F3F4ED] border border-[#E5E7EB] rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent-sky/30 transition-all font-medium disabled:opacity-50"
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-accent-rose text-white font-bold py-4 rounded-2xl shadow-lg shadow-accent-rose/20 flex items-center justify-center gap-2 mt-4 hover:bg-accent-rose/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {isLogin ? "로그인하기" : "회원가입하기"}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-8 text-center pt-6 border-t border-[#E5E7EB]">
            <p className="text-sm text-[#717182]">
              {isLogin ? "계정이 없으신가요?" : "이미 계정이 있으신가요?"}
              <button 
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError("");
                }}
                className="ml-2 font-bold text-accent-sky hover:underline"
              >
                {isLogin ? "회원가입" : "로그인"}
              </button>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link to="/" className="text-xs font-bold text-[#9CA3AF] hover:text-[#717182] transition-colors">
            메인 페이지로 돌아가기
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

