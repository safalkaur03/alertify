import { motion, useMotionValue, useSpring } from "framer-motion";

export default function MagneticButton({ children }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 150 });
  const springY = useSpring(y, { stiffness: 150 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);

    x.set(dx * 0.2);
    y.set(dy * 0.2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.1 }}
      className="px-8 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 transition shadow-lg shadow-blue-500/40"
    >
      {children}
    </motion.button>
  );
}