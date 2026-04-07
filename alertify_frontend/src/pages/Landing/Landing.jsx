import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import Hero from "./Hero";
import Visualization from "./Visualization";
import About from "./About";

export default function Landing() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 18, damping: 22 });
  const springY = useSpring(mouseY, { stiffness: 18, damping: 22 });

  
  const [anomaly, setAnomaly] = useState(12);
  const [logs, setLogs] = useState([
    "initializing system...",
    "scanning environment...",
  ]);
  const [idleStage, setIdleStage] = useState(0);
  const [cooldown, setCooldown] = useState(false);

  let timeout1, timeout2;

const handleMouseMove = (e) => {
  mouseX.set(e.clientX);
  mouseY.set(e.clientY);

  setIdleStage(0);

  clearTimeout(timeout1);
  clearTimeout(timeout2);

  timeout1 = setTimeout(() => {
    setIdleStage(1); // subtle stage
  }, 5000);

  timeout2 = setTimeout(() => {
    if (!cooldown) {
    setIdleStage(2);
    setCooldown(true);

    setTimeout(() => setCooldown(false), 5000); 
  }
  
  }, 10000);
};

  // 🔴 fake anomaly fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setAnomaly((prev) => {
        let next = prev + (Math.random() * 6 - 3);
        return Math.max(5, Math.min(95, Math.round(next)));
      });
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  // 🧠 fake AI logs typing
  useEffect(() => {
    const messages = [
      "user presence detected",
      "tracking cursor movement...",
      "analyzing interaction speed...",
      "pattern stability: normal",
      "cross-checking anomalies...",
    ];
    let i = 0;

    const interval = setInterval(() => {
      setLogs((prev) => [...prev.slice(-4), messages[i]]);
      i = (i + 1) % messages.length;
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
  const handleScroll = () => {
    setIdleStage(0);

    clearTimeout(timeout1.current);
    clearTimeout(timeout2.current);

    timeout1.current = setTimeout(() => {
      setIdleStage(1);
    }, 5000);

    timeout2.current = setTimeout(() => {
      setIdleStage(2);
    }, 10000);
  };

  window.addEventListener("scroll", handleScroll);

  return () => window.removeEventListener("scroll", handleScroll);
}, []);

  // 👁️ idle reaction (CREEPY VERSION)
  

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative min-h-screen bg-[#05080F] text-white overflow-x-hidden"
    >

    {idleStage === 1 && (
  <motion.p
    className="fixed top-6 left-1/2 -translate-x-1/2 text-blue-400 text-xs tracking-widest z-40"
    initial={{ opacity: 0 }}
    animate={{ opacity: 0.6 }}
  >
    monitoring inactivity...
  </motion.p>
)}
      {/* 🌌 DEPTH BACKGROUND */}
      <motion.div
        className="absolute inset-0 opacity-[0.08]"
        animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        style={{
          backgroundImage: `
            radial-gradient(circle at 10% 20%, rgba(0,120,255,0.15), transparent 40%),
            radial-gradient(circle at 90% 80%, rgba(0,120,255,0.1), transparent 40%)
          `
        }}
      />

      {/* 👁️ TRACKING SPOTLIGHT */}
      <motion.div
        style={{ left: springX, top: springY }}
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 2.5, repeat: Infinity }}
        className="fixed w-[500px] h-[500px] pointer-events-none -translate-x-1/2 -translate-y-1/2 z-20"
      >
        <div className="w-full h-full bg-blue-500/10 rounded-full blur-3xl" />
      </motion.div>

      <Hero anomaly={anomaly} logs={logs} />
      <About />
      <Visualization />

      

      {/* 👁️ IDLE OVERLAY */}
    
      {idleStage === 2 && (
  <motion.div
    className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >
    <motion.div
      className="text-center"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
    >
      <p className="text-blue-400 text-sm tracking-widest">
        ACTIVITY LOST
      </p>

      <p className="text-white text-2xl mt-2 font-semibold">
        still there?
      </p>

      {/* 👇 THIS is your animation line */}
      <motion.div
        className="mt-6 h-[2px] bg-blue-500"
        animate={{ width: ["0%", "100%", "0%"] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.div>
  </motion.div>
)}
    </div>
  );
}