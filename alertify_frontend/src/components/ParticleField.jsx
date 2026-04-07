import { useEffect, useRef } from "react";

export default function DataStream() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let streams = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 40; i++) {
      streams.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        length: Math.random() * 100 + 50,
        speed: Math.random() * 1 + 0.5,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      streams.forEach((s) => {
        s.y += s.speed;

        if (s.y > canvas.height) {
          s.y = -s.length;
          s.x = Math.random() * canvas.width;
        }

        const gradient = ctx.createLinearGradient(
          s.x,
          s.y,
          s.x,
          s.y + s.length
        );

        gradient.addColorStop(0, "rgba(59,130,246,0)");
        gradient.addColorStop(1, "rgba(59,130,246,0.6)");

        ctx.beginPath();
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1;
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x, s.y + s.length);
        ctx.stroke();
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
}