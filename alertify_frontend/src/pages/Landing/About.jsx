import { motion } from "framer-motion";

export default function About() {
  return (
    <div className="pt-10 pb-32 px-10 relative z-30">

      <div className="max-w-6xl mx-auto">

        {/* 🧠 HEADER */}
        <div className="mb-16">
          <p className="text-xs text-blue-400 tracking-widest mb-3">
            SYSTEM OVERVIEW
          </p>

          <h2 className="text-4xl font-semibold leading-tight max-w-2xl">
            Alertify doesn’t rely on rules.
            <br />
            <span className="text-blue-400">
              It understands behavior.
            </span>
          </h2>
        </div>

        {/* 🔥 GRID (more structured now) */}
        <div className="grid grid-cols-3 gap-10">

          {/* 🧠 BLOCK 1 */}
          <motion.div
            className="border border-white/5 p-6 rounded-xl bg-white/[0.02]"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <p className="text-sm text-blue-400 mb-2">01</p>
            <h3 className="text-lg font-medium mb-3">
              Continuous Tracking
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Every interaction is monitored — clicks, movement,
              and session flow are recorded in real time.
            </p>
          </motion.div>

          {/* 🧠 BLOCK 2 */}
          <motion.div
            className="border border-white/5 p-6 rounded-xl bg-white/[0.02]"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-sm text-blue-400 mb-2">02</p>
            <h3 className="text-lg font-medium mb-3">
              Pattern Analysis
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Behavior is evaluated dynamically to establish
              what “normal” looks like for each session.
            </p>
          </motion.div>

          {/* 🧠 BLOCK 3 */}
          <motion.div
            className="border border-white/5 p-6 rounded-xl bg-white/[0.02]"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <p className="text-sm text-blue-400 mb-2">03</p>
            <h3 className="text-lg font-medium mb-3">
              Anomaly Detection
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              When deviations occur, the system flags anomalies
              instantly — before threats escalate.
            </p>
          </motion.div>

        </div>

        {/* 👁️ SYSTEM LINE (connects everything visually) */}
        <div className="mt-16 relative">

          <div className="h-[1px] bg-white/10 w-full" />

          <motion.div
            className="absolute top-0 left-0 h-[1px] bg-blue-500"
            animate={{ width: ["0%", "100%"] }}
            transition={{ duration: 4, repeat: Infinity }}
          />

        </div>

      </div>
    </div>
  );
}