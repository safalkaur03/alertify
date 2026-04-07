import { useEffect, useRef } from "react";

export default function CursorTrail() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let points = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    const handleMove = (e) => {
      points.push({ x: e.clientX, y: e.clientY, life: 1 });
    };

    window.addEventListener("mousemove", handleMove);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      points.forEach((p, i) => {
        p.life -= 0.02;

        if (p.life <= 0) {
          points.splice(i, 1);
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, 8 * p.life, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(59,130,246,${p.life})`;
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 pointer-events-none z-50"
    />
  );
}