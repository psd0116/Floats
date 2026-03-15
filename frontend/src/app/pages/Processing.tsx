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
      {/* Breathing Glow Animation */}
      <div className="relative mb-12">
        <motion.div
          className="w-32 h-32 rounded-full"
          style={{
            background: "linear-gradient(135deg, #FEF08A 0%, #D1FAE5 50%, #E0E7FF 100%)",
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.6, 0.9, 0.6],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute inset-0 w-32 h-32 rounded-full"
          style={{
            background: "linear-gradient(135deg, #E0E7FF 0%, #FEF08A 50%, #D1FAE5 100%)",
          }}
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Loading Text */}
      <div className="text-center">
        <h2 className="text-[#1F2937] mb-3">그림에 생명을 불어넣는 중이에요</h2>
        <p className="text-[#6B7280] text-sm max-w-xs mx-auto leading-relaxed">
          AI가 2D 그림을 3D 모델로 변환하고 있어요. 잠시만 기다려주세요.
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
