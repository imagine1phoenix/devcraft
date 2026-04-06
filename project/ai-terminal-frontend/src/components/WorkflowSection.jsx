import React, { useEffect, useRef } from 'react';
import './WorkflowSection.css';

export default function WorkflowSection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.15 }
    );
    const el = sectionRef.current;
    if (el) observer.observe(el);
    return () => { if (el) observer.unobserve(el); };
  }, []);

  const phases = [
    {
      title: 'Pre Trade',
      subtitle: 'Surface opportunities. Validate conviction.',
      items: ['Market research', 'Asset research', 'Trade Validation'],
    },
    {
      title: 'During Trade',
      subtitle: 'Monitor what matters. React to shifts.',
      items: ['Execution', 'Position management', 'Risk Monitoring'],
    },
    {
      title: 'Post Trade',
      subtitle: 'Learn. Improve. Evolve.',
      items: ['Trade review', 'Behavioural pattern analysis', 'Skill development'],
    },
  ];

  return (
    <section className="workflow-section" id="product" ref={sectionRef}>
      <div className="workflow-inner">
        <h2 className="workflow-heading">
          <span>Your complete trading workflow.</span>
          <span>One platform.</span>
        </h2>

        {/* Tree connector SVG */}
        <div className="tree-connector">
          <svg viewBox="0 0 600 80" fill="none" preserveAspectRatio="xMidYMid meet">
            <path d="M300 0 L300 30" stroke="var(--accent-orange)" strokeWidth="1.5" />
            <path d="M300 30 L100 70" stroke="var(--accent-orange)" strokeWidth="1" opacity="0.6"/>
            <path d="M300 30 L300 70" stroke="var(--accent-orange)" strokeWidth="1" opacity="0.6"/>
            <path d="M300 30 L500 70" stroke="var(--accent-orange)" strokeWidth="1" opacity="0.6"/>
            <circle cx="300" cy="30" r="4" fill="var(--accent-orange)" />
          </svg>
        </div>

        {/* Phase cards */}
        <div className="phase-grid">
          {phases.map((phase, i) => (
            <div key={i} className="phase-card" style={{ animationDelay: `${i * 0.15}s` }}>
              <h3 className="phase-title">
                <span className="phase-pre">{phase.title.split(' ')[0]} </span>
                <em>{phase.title.split(' ').slice(1).join(' ')}</em>
              </h3>
              <p className="phase-subtitle">{phase.subtitle}</p>
              <ul className="phase-items">
                {phase.items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <a href="#learn" className="learn-btn">Learn more</a>
      </div>

      {/* Grid background effect */}
      <div className="grid-bg" />
    </section>
  );
}
