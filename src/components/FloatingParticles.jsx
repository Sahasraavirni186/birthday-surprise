import { useEffect, useRef } from "react";
import "./FloatingParticles.css";

const FloatingParticles = ({ count = 80 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationId;
    let particles = [];
    let time = 0;

    const init = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
    };

    init();

    particles = Array.from({ length: count }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 2.5 + 0.5,
      speed: Math.random() * 0.4 + 0.05,
      drift: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.6 + 0.2,
      phase: Math.random() * Math.PI * 2,
      type:
        Math.random() < 0.12
          ? "heart"
          : Math.random() < 0.25
            ? "sparkle"
            : "star",
    }));

    const drawHeart = (x, y, size) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-size, -size, -size * 1.5, 0, 0, size * 2);
      ctx.bezierCurveTo(size * 1.5, 0, size, -size, 0, 0);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    const animate = () => {
      time += 0.016;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        const twinkle = Math.sin(time * p.phase + p.phase) * 0.15;
        const alpha = Math.max(0, p.opacity + twinkle);
        ctx.globalAlpha = alpha;

        if (p.type === "heart") {
          ctx.fillStyle = "#ffb7c5";
          drawHeart(p.x, p.y, p.size);
        } else if (p.type === "sparkle") {
          ctx.fillStyle = "#e0f7ff";
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 1.4, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        p.y -= p.speed;
        p.x += p.drift * 0.3;
        if (p.y < -10) {
          p.y = window.innerHeight + 10;
          p.x = Math.random() * window.innerWidth;
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      init();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, [count]);

  const isReduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <canvas
      ref={canvasRef}
      className="floating-particles"
      aria-hidden={!isReduced ? "true" : undefined}
    />
  );
};

export default FloatingParticles;
