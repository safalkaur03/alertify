import { motion } from "framer-motion";

export default function Hero({ anomaly ,logs}) {
  return (
    <div className="h-screen flex flex-col justify-center items-center text-center relative z-30">

      {/* ⚡ TITLE */}
      <motion.h1
        className="text-7xl font-bold tracking-tight"
        animate={{ opacity: [1, 0.95, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        ALERTIFY
      </motion.h1>

      {/* 📊 ANOMALY SCORE */}
      <div className="mt-6 text-sm text-gray-400">
        anomaly score
      </div>

      <motion.div className="w-[300px] h-[6px] bg-white/10 mt-2 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-blue-500"
          animate={{ width: `${anomaly}%` }}
          transition={{ duration: 1 }}
        />
      </motion.div>

      <p className="mt-2 text-blue-400 text-sm">{anomaly}%</p>

      {/* 🔘 CTA */}
      <div className="mt-10">
        <button className="relative px-8 py-3 border border-blue-500/30 bg-blue-500/10 backdrop-blur-md rounded-lg overflow-hidden hover:bg-blue-500/20 transition">

          <span className="relative z-10">Enter System</span>

          <motion.div
            className="absolute inset-0 bg-blue-500/20"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        </button>
      </div>

      {/* 🖥️ LIVE LOGS */}
      <div className="absolute bottom-10 left-10 text-xs font-mono text-green-400 opacity-70 space-y-1">
        {logs.map((log, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {log}
          </motion.p>
        ))}
      </div>

    </div>
  );
}