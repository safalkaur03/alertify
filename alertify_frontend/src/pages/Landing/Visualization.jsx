import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Visualization() {
  const [nodes, setNodes] = useState([]);
  const [anomalyIndex, setAnomalyIndex] = useState(null);
  

  // initialize nodes with velocity
  useEffect(() => {
    const initial = Array.from({ length: 20 }).map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      vx: Math.random() * 0.6 - 0.3,
      vy: Math.random() * 0.6 - 0.3,
    }));
    setNodes(initial);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setNodes((prev) => {
        let maxSpeed = 0;
        let anomalyIdx = null;

        const updated = prev.map((n, i) => {
          // slightly change velocity (simulate behavior)
          let vx = n.vx + (Math.random() * 0.2 - 0.1);
          let vy = n.vy + (Math.random() * 0.2 - 0.1);

          // clamp movement
          vx = Math.max(-1, Math.min(1, vx));
          vy = Math.max(-1, Math.min(1, vy));

          const speed = Math.abs(vx) + Math.abs(vy);

          if (speed > maxSpeed) {
            maxSpeed = speed;
            anomalyIdx = i;
          }

          return {
            x: (n.x + vx + 100) % 100,
            y: (n.y + vy + 100) % 100,
            vx,
            vy,
          };
        });

        setAnomalyIndex(anomalyIdx);
        return updated;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-center px-10 relative z-30">

      {/* 🧠 TITLE */}
      <div className="mb-6">
        <h2 className="text-4xl font-semibold">SESSION BEHAVIOR MONITORING</h2>
        <p className="text-gray-400 mt-2">
          real-time tracking of user interaction patterns
        </p>
      </div>

      {/* 👁️ FIELD */}
      <div className="relative w-full h-[420px] rounded-xl border border-white/5 bg-white/[0.02] overflow-hidden">

        {/* connections */}
        <svg className="absolute inset-0 w-full h-full">
          {nodes.map((n1, i) =>
            nodes.map((n2, j) => {
              const dx = n1.x - n2.x;
              const dy = n1.y - n2.y;
              const dist = Math.sqrt(dx * dx + dy * dy);

              if (i < j && dist < 20) {
                return (
                  <line
                    key={`${i}-${j}`}
                    x1={`${n1.x}%`}
                    y1={`${n1.y}%`}
                    x2={`${n2.x}%`}
                    y2={`${n2.y}%`}
                    stroke="rgba(100,150,255,0.15)"
                  />
                );
              }
              return null;
            })
          )}
        </svg>

        {/* nodes */}
        {nodes.map((node, i) => (
          <motion.div
  className={`absolute w-2 h-2 rounded-full ${
    i === anomalyIndex ? "bg-red-500" : "bg-blue-400"
  }`}
  animate={{
    left: `${node.x}%`,
    top: `${node.y}%`,
    x: "-50%",
    y: "-50%",
    scale: i === anomalyIndex ? 1.8 : 1,
  }}
  transition={{ duration: 0.1, linear: true }}
/>
        ))}

        {/* anomaly focus */}
        {anomalyIndex !== null && nodes[anomalyIndex] && (
          <motion.div
  className="absolute w-12 h-12 border border-red-500 rounded-full shadow-[0_0_20px_rgba(239,68,68,0.6)]"
  animate={{
    left: `${nodes[anomalyIndex].x}%`,
    top: `${nodes[anomalyIndex].y}%`,
    x: "-50%",
    y: "-50%",
    scale: [1, 1.3, 1],
  }}
  transition={{ type:"tween",duration: 0.15, ease:"linear" }}
/>
        )}
      </div>

      {/* ⚠️ CONTEXT TEXT */}
      <div className="mt-6 flex justify-between text-sm text-gray-400">
        <p>tracking active sessions...</p>
        <p className="text-red-400">
          {anomalyIndex !== null ? "irregular behavior detected" : "stable"}
        </p>
      </div>
    </div>
  );
}