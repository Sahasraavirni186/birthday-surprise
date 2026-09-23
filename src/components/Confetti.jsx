import { useEffect, useRef } from "react";
import "./Confetti.css";

const CONFETTI_COLORS = [
  "#ffb7c5",
  "#ffdee9",
  "#dcaffc",
  "#a8edea",
  "#ffd166",
  "#fff",
  "#c79bf5",
  "#fcbad8",
];

const Confetti = ({ isActive = false, particleCount = 120 }) => {
  const canvasRef = useRef(null);
  const animationIdRef = useRef(null);
  const particlesRef = useRef([]);

  useEffect(() => {
    if (!isActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();

    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * -window.innerHeight,
      size: Math.random() * 7 + 3,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      speed: Math.random() * 2.5 + 0.8,
      drift: (Math.random() - 0.5) * 2,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.12,
      shape: Math.random() < 0.8 ? "rect" : "round",
      gravity: 0.05 + Math.random() * 0.08,
    }));

    let time = 0;

    const animate = () => {
      time += 0.016;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((p) => {
        p.speed += p.gravity;
        p.y += p.speed;
        p.x += p.drift;
        p.rotation += p.rotationSpeed;

        if (p.y > window.innerHeight + 30) {
          p.y = -30;
          p.x = Math.random() * window.innerWidth;
          p.speed = Math.random() * 2 + 0.5;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;

        const alpha = Math.min(1, 0.5 + Math.sin(time * 3 + p.x * 0.01) * 0.3);
        ctx.globalAlpha = alpha;

        if (p.shape === "rect") {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size + 2);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });

      animationIdRef.current = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => resize();
    window.addEventListener("resize", handleResize);

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      window.removeEventListener("resize", handleResize);
    };
  }, [isActive, particleCount]);

  if (!isActive) return null;

  return (
    <canvas
      ref={canvasRef}
      className="confetti-canvas"
      aria-hidden="true"
    />
  );
};

export default Confetti;
