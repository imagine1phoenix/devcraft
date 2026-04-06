import React, { useEffect, useRef } from 'react';
import './BeastSection.css';

export default function BeastSection() {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);

  // Light rays canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let time = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener('resize', resize);

    const w = () => canvas.offsetWidth;
    const h = () => canvas.offsetHeight;

    const drawRays = () => {
      ctx.clearRect(0, 0, w(), h());
      const cx = w() / 2;
      const bottom = h();
      const rayCount = 40;

      for (let i = 0; i < rayCount; i++) {
        const angle = ((i / rayCount) * Math.PI * 0.8) - Math.PI * 0.4;
        const sway = Math.sin(time * 0.005 + i * 0.3) * 0.03;
        const finalAngle = angle + sway;

        const length = h() * 1.2;
        const endX = cx + Math.sin(finalAngle) * length;
        const endY = bottom - Math.cos(finalAngle) * length;

        const gradient = ctx.createLinearGradient(cx, bottom, endX, endY);
        const hue = 25 + (i / rayCount) * 30;
        const brightness = 50 + Math.sin(time * 0.01 + i) * 10;

        gradient.addColorStop(0, `hsla(${hue}, 100%, ${brightness}%, 0.6)`);
        gradient.addColorStop(0.4, `hsla(${hue}, 90%, ${brightness - 10}%, 0.2)`);
        gradient.addColorStop(1, `hsla(${hue}, 80%, 20%, 0)`);

        ctx.beginPath();
        ctx.moveTo(cx - 2, bottom);
        ctx.lineTo(endX - 10, endY);
        ctx.lineTo(endX + 10, endY);
        ctx.lineTo(cx + 2, bottom);
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      // Central glow
      const glow = ctx.createRadialGradient(cx, bottom, 0, cx, bottom, h() * 0.5);
      glow.addColorStop(0, 'rgba(255, 160, 40, 0.4)');
      glow.addColorStop(0.3, 'rgba(232, 102, 10, 0.15)');
      glow.addColorStop(1, 'transparent');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w(), h());

      time++;
      animationId = requestAnimationFrame(drawRays);
    };

    drawRays();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
      },
      { threshold: 0.2 }
    );
    const el = sectionRef.current;
    if (el) observer.observe(el);
    return () => { if (el) observer.unobserve(el); };
  }, []);

  return (
    <section className="beast-section" ref={sectionRef}>
      <canvas ref={canvasRef} className="rays-canvas" />
      <h2 className="beast-heading">
        <span>"Beast" is an</span>
        <span>understatement</span>
      </h2>
    </section>
  );
}
