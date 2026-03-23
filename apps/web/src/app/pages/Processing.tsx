import { useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";

export function Processing() {
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate AI processing time
    const timer = setTimeout(() => {
      navigate("/detail/1");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center px-6">
      {/* Breathing Glow & Floating Animation */}
      <div className="relative mb-12">
        <motion.div
          className="w-32 h-32 rounded-full animate-float shadow-xl bg-linear-135 from-[#FEF08A] via-[#BAE6FD] to-[#DBEAFE]"
          animate={{
            scale: [1, 1.15, 1],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute inset-0 w-32 h-32 rounded-full glass"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Loading Text */}
      <div className="text-center">
        <h2 className="text-[#1F2937] mb-3 font-bold text-2xl">그림이 둥둥 떠오르고 있어요</h2>
        <p className="text-[#6B7280] text-base max-w-xs mx-auto leading-relaxed">
          AI가 아이의 소중한 낙서를<br />
          마법처럼 3D로 만들고 있습니다.
        </p>
      </div>

      {/* Progress Dots */}
      <div className="flex gap-2 mt-8">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-[#9CA3AF]"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    </div>
  );
}
