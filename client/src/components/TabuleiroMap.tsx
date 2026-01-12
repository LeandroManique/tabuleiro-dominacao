import { motion } from "framer-motion";
import { Check, Lock, Sparkles } from "lucide-react";

interface House {
  id: number;
  title: string;
  objective: string;
}

interface TabuleiroMapProps {
  houses: House[];
  currentHouseId: number;
  onHouseClick: (houseId: number) => void;
}

export default function TabuleiroMap({ houses, currentHouseId, onHouseClick }: TabuleiroMapProps) {
  const getHouseStatus = (houseId: number) => {
    if (houseId < currentHouseId) return "completed";
    if (houseId === currentHouseId) return "current";
    return "locked";
  };

  const getHouseColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500 border-green-600";
      case "current":
        return "bg-yellow-500 border-yellow-600 animate-pulse";
      case "locked":
        return "bg-gray-400 border-gray-500";
      default:
        return "bg-gray-400";
    }
  };

  // Layout em espiral para criar efeito de jornada
  const getPosition = (index: number) => {
    const angle = (index * 360) / 20;
    const radius = 150 + Math.floor(index / 5) * 50;
    const x = Math.cos((angle * Math.PI) / 180) * radius;
    const y = Math.sin((angle * Math.PI) / 180) * radius;
    return { x, y };
  };

  return (
    <div className="relative w-full h-[800px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Grid de fundo */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px]" />
      
      {/* Título */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-10">
        <h1 className="text-4xl font-bold text-white text-center">
          O Tabuleiro da Dominação
        </h1>
        <p className="text-purple-300 text-center mt-2">
          Sua jornada para dominar o TikTok
        </p>
      </div>

      {/* Container do tabuleiro */}
      <div className="relative w-full h-full flex items-center justify-center">
        {houses.map((house, index) => {
          const status = getHouseStatus(house.id);
          const position = getPosition(index);
          const isClickable = status === "current";

          return (
            <motion.div
              key={house.id}
              className="absolute"
              style={{
                left: `calc(50% + ${position.x}px)`,
                top: `calc(50% + ${position.y}px)`,
                transform: "translate(-50%, -50%)",
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              {/* Linha conectando casas */}
              {index > 0 && (
                <div
                  className="absolute w-1 bg-purple-500/30"
                  style={{
                    height: "50px",
                    top: "-50px",
                    left: "50%",
                    transform: "translateX(-50%)",
                  }}
                />
              )}

              {/* Casa */}
              <motion.button
                onClick={() => isClickable && onHouseClick(house.id)}
                disabled={!isClickable}
                className={`
                  relative w-24 h-24 rounded-xl border-4 
                  ${getHouseColor(status)}
                  ${isClickable ? "cursor-pointer hover:scale-110" : "cursor-not-allowed"}
                  transition-all duration-300 shadow-2xl
                  flex flex-col items-center justify-center
                `}
                whileHover={isClickable ? { scale: 1.1 } : {}}
                whileTap={isClickable ? { scale: 0.95 } : {}}
              >
                {/* Ícone de status */}
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                  {status === "completed" && <Check className="w-5 h-5 text-green-600" />}
                  {status === "current" && <Sparkles className="w-5 h-5 text-yellow-600" />}
                  {status === "locked" && <Lock className="w-5 h-5 text-gray-600" />}
                </div>

                {/* Número da casa */}
                <span className="text-3xl font-bold text-white drop-shadow-lg">
                  {house.id}
                </span>

                {/* Tooltip com título */}
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <div className="bg-black/90 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap max-w-xs">
                    {house.title}
                  </div>
                </div>
              </motion.button>

              {/* Label da casa (sempre visível) */}
              <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 text-center">
                <p className="text-white text-xs font-semibold whitespace-nowrap">
                  Casa {house.id}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Legenda */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-6 bg-black/50 px-6 py-3 rounded-full backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-green-500" />
          <span className="text-white text-sm">Completa</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-yellow-500 animate-pulse" />
          <span className="text-white text-sm">Atual</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-gray-400" />
          <span className="text-white text-sm">Bloqueada</span>
        </div>
      </div>
    </div>
  );
}
