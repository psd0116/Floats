import { Link } from "react-router";
import { Camera, Eye } from "lucide-react";
import { artworks } from "../data/mockData";
import { motion } from "motion/react";

export function Home() {
  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Header */}
      <header className="px-6 py-6 bg-white">
        <h1 className="text-[#1F2937] mb-1">Art Archive</h1>
        <p className="text-[#6B7280] text-sm">오늘의 바다는 어떤가요?</p>
      </header>

      {/* Virtual Aquarium Hero Section */}
      <section className="relative h-[280px] mx-6 mt-6 rounded-[24px] overflow-hidden bg-gradient-to-b from-[#DBEAFE] to-[#BAE6FD] shadow-sm">
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Floating Fish Animation */}
          <div className="relative w-full h-full">
            {artworks.slice(0, 3).map((art, index) => (
              <motion.div
                key={art.id}
                className="absolute"
                style={{
                  left: `${20 + index * 30}%`,
                  top: `${30 + index * 15}%`,
                }}
                animate={{
                  y: [0, -15, 0],
                  x: [0, 10, 0],
                }}
                transition={{
                  duration: 3 + index,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <div 
                  className="w-16 h-16 rounded-[16px] shadow-lg"
                  style={{
                    backgroundColor: art.color,
                    opacity: 0.8,
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Gentle Waves */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white/30 to-transparent" />
      </section>

      {/* Timeline Section */}
      <section className="px-6 py-8">
        <h2 className="text-[#1F2937] mb-6">작품 타임라인</h2>
        
        <div className="space-y-4">
          {artworks.map((art, index) => (
            <motion.div
              key={art.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={`/detail/${art.id}`}>
                <div className="bg-white rounded-[24px] p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex gap-4">
                    {/* Thumbnail */}
                    <div 
                      className="w-20 h-20 rounded-[16px] flex-shrink-0 overflow-hidden"
                      style={{ backgroundColor: art.color }}
                    >
                      <img 
                        src={art.thumbnail} 
                        alt={art.title}
                        className="w-full h-full object-cover opacity-60"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[#1F2937] mb-1">{art.title}</h3>
                      <p className="text-[#9CA3AF] text-sm mb-2">{art.date}</p>
                      <div className="flex gap-2 flex-wrap">
                        {art.tags.map((tag) => (
                          <span 
                            key={tag}
                            className="text-xs px-3 py-1 rounded-full bg-[#F3F4F6] text-[#6B7280]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* View Button */}
                    <button className="flex-shrink-0 w-12 h-12 rounded-full bg-[#F3F4F6] flex items-center justify-center hover:bg-[#E5E7EB] transition-colors">
                      <Eye className="w-5 h-5 text-[#6B7280]" />
                    </button>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Floating Action Button */}
      <Link to="/upload">
        <motion.button
          className="fixed bottom-8 right-6 w-16 h-16 rounded-full shadow-lg flex items-center justify-center"
          style={{ backgroundColor: "#FEF08A" }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Camera className="w-7 h-7 text-[#1F2937]" />
        </motion.button>
      </Link>
    </div>
  );
}
