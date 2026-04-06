import React, { useEffect, useRef, useCallback } from 'react';
import './FinalCTA.css';

export default function FinalCTA() {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const particlesRef = useRef([]);

  // Cursor-following flame particles
  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;
    const ctx = canvas.getContext('2d');
    let animationId;

    const resize = () => {
      const rect = section.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener('resize', resize);

    const w = () => canvas.offsetWidth;
    const h = () => canvas.offsetHeight;

    class FlameParticle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 3;
        this.vy = -(Math.random() * 4 + 2);
        this.size = Math.random() * 12 + 4;
        this.life = 1.0;
        this.decay = Math.random() * 0.025 + 0.01;
        this.hue = 20 + Math.random() * 30; // orange to yellow
        this.wobble = Math.random() * 0.1;
        this.wobbleSpeed = Math.random() * 0.05 + 0.02;
        this.age = 0;
      }
      update() {
        this.age++;
        this.x += this.vx + Math.sin(this.age * this.wobbleSpeed) * this.wobble;
        this.vy *= 0.98;
        this.y += this.vy;
        this.vx *= 0.99;
        this.life -= this.decay;
        this.size *= 0.985;
      }
      draw(ctx) {
        if (this.life <= 0) return;
        const alpha = this.life * 0.7;
        const lightness = 50 + (1 - this.life) * 30;

        // Core flame
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue}, 100%, ${lightness}%, ${alpha})`;
        ctx.fill();

        // Middle glow
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue}, 100%, ${lightness}%, ${alpha * 0.3})`;
        ctx.fill();

        // Outer glow
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 4, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue}, 80%, 30%, ${alpha * 0.08})`;
        ctx.fill();
      }
    }

    // Ember particles (smaller, longer lasting)
    class Ember {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 5;
        this.vy = -(Math.random() * 6 + 3);
        this.size = Math.random() * 2.5 + 0.5;
        this.life = 1.0;
        this.decay = Math.random() * 0.008 + 0.005;
        this.gravity = 0.02;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.vx *= 0.99;
        this.life -= this.decay;
      }
      draw(ctx) {
        if (this.life <= 0) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 180, 50, ${this.life * 0.8})`;
        ctx.fill();
        // tiny glow
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 130, 20, ${this.life * 0.15})`;
        ctx.fill();
      }
    }

    const particles = particlesRef.current;

    const handleMouseMove = (e) => {
      const rect = section.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;

      // Spawn flame particles on mouse move
      for (let i = 0; i < 3; i++) {
        particles.push(new FlameParticle(
          mouseRef.current.x + (Math.random() - 0.5) * 10,
          mouseRef.current.y + (Math.random() - 0.5) * 10
        ));
      }
      // Spawn embers occasionally
      if (Math.random() > 0.6) {
        particles.push(new Ember(mouseRef.current.x, mouseRef.current.y));
      }
    };

    section.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      ctx.clearRect(0, 0, w(), h());

      // Add compositing for fire glow
      ctx.globalCompositeOperation = 'lighter';

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        p.draw(ctx);
        if (p.life <= 0 || p.size <= 0.3) {
          particles.splice(i, 1);
        }
      }

      ctx.globalCompositeOperation = 'source-over';

      // Limit particle count
      while (particles.length > 500) {
        particles.shift();
      }

      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      section.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
      },
      { threshold: 0.15 }
    );
    const el = sectionRef.current;
    if (el) observer.observe(el);
    return () => { if (el) observer.unobserve(el); };
  }, []);

  return (
    <section className="final-cta" ref={sectionRef}>
      <canvas ref={canvasRef} className="flame-canvas" />

      <div className="cta-content">
        <h2 className="cta-heading">
          <span>Trading is a war of mind</span>
          <span>vs market</span>
        </h2>
        <p className="cta-desc">
          An AI-native terminal that takes you from opportunity to conviction to review,
          with the clarity to know exactly why you're making every move.
        </p>

        {/* Pixel art silhouette - CSS only */}
        <div className="silhouette-container">
          <div className="silhouette-glow" />
          <div className="silhouette">
            <svg viewBox="0 0 200 300" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Head */}
              <rect x="88" y="10" width="24" height="24" fill="#1a0e0a"/>
              {/* Neck */}
              <rect x="94" y="34" width="12" height="10" fill="#1a0e0a"/>
              {/* Shoulders */}
              <rect x="70" y="44" width="60" height="8" fill="#1a0e0a"/>
              {/* Torso */}
              <rect x="78" y="52" width="44" height="60" fill="#1a0e0a"/>
              {/* Arms */}
              <rect x="62" y="52" width="16" height="50" fill="#1a0e0a"/>
              <rect x="122" y="52" width="16" height="50" fill="#1a0e0a"/>
              {/* Legs */}
              <rect x="80" y="112" width="18" height="70" fill="#1a0e0a"/>
              <rect x="102" y="112" width="18" height="70" fill="#1a0e0a"/>
              {/* Feet */}
              <rect x="74" y="182" width="24" height="8" fill="#1a0e0a"/>
              <rect x="102" y="182" width="24" height="8" fill="#1a0e0a"/>
            </svg>
          </div>

          {/* Dithered border effect */}
          <div className="dither-border" />
        </div>

        <div className="join-hunt-area">
          <p className="join-text">Join the Hunt</p>
          <p className="join-subtitle">Move your cursor to ignite 🔥</p>
        </div>
      </div>
    </section>
  );
}
