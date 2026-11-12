'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';

const PRODUCTS = [
  {
    name: 'Rosé Atelier',
    category: 'Blush Beauty Gift Set',
    fullName: 'Rosé Atelier Blush Beauty Gift Set',
    image: '/images/hero-rotator-rose.png',
    alt: 'Rosé Atelier blush beauty gift set luxury folding carton'
  },
  {
    name: 'Aurelle Ritual',
    category: 'Open Blue Ivory Skincare Kit',
    fullName: 'Open Blue Ivory Skincare Kit',
    image: '/images/hero-rotator-aurelle.png',
    alt: 'Open blue ivory skincare kit presentation box with bottles and creams'
  },
  {
    name: 'Grove Collection',
    category: 'Kraft Takeaway Carton Collection',
    fullName: 'Grove Kraft Takeaway Carton Collection',
    image: '/images/hero-rotator-grove.png',
    alt: 'Grove kraft takeaway carton collection food and bakery boxes'
  },
  {
    name: 'Vitalis Healthcare',
    category: 'Premium Folding Carton Collection',
    fullName: 'Premium Vitalis Folding Carton Collection',
    image: '/images/hero-rotator-vitalis.png',
    alt: 'Premium Vitalis folding carton collection medicine and wellness packaging'
  }
];

export default function HeroRotator() {
  const [selected, setSelected] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const sceneRef = useRef(null);
  const productRefs = useRef([]);
  const marbleTopRef = useRef(null);
  const marbleRimRef = useRef(null);
  const stateRef = useRef({
    selected: 0,
    current: 0,
    target: 0,
    frame: 0,
    timer: null,
    startX: null,
    isHovered: false,
    manualPaused: false
  });

  const draw = useCallback(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    const w = scene.clientWidth;
    const h = scene.clientHeight;
    if (!w || !h) return;
    const isMobile = w < 600;
    const { current } = stateRef.current;

    productRefs.current.forEach((el, i) => {
      if (!el) return;
      const a = ((i * 90 + current) * Math.PI) / 180;
      const depth = Math.cos(a);
      const depthFactor = Math.max(0, Math.min(1, (depth + 1) / 2)); // 0 in back, 1 in front

      // Horizontal elliptical spread across the scene
      const x = Math.sin(a) * w * (isMobile ? 0.18 : 0.24);

      // Uplift the rest part of the circle:
      // Front active item (depth=1) sits forward & grounded on the marble pedestal;
      // sides (depth=0) and back (depth=-1) are uplifted vertically in a 3D elevated amphitheater curve
      const y = (depth * (isMobile ? 0.05 : 0.12) - (1 - depth) * (isMobile ? 0.07 : 0.095)) * h;

      // Base size in CSS is set to the enlarged front active target
      // On mobile, front active item scales up to 1.25x so it stands tall inside the spherical backdrop
      // Side and back items scale down smoothly
      const scale = isMobile
        ? 0.34 + Math.pow(depthFactor, 1.30) * 0.62
        : 0.34 + Math.pow(depthFactor, 1.45) * 0.58;

      const tilt = Math.sin(a) * -4;

      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(${scale.toFixed(3)}) rotate(${tilt.toFixed(2)}deg)`;
      el.style.zIndex = Math.round((depth + 1) * 50) + 1;
      el.style.opacity = (0.45 + Math.pow(depthFactor, 0.75) * 0.55).toFixed(3);

      // Camera depth of field:
      // Front active item is 100% sharp and in crisp focus (0px blur),
      // rest of images receding into the background are blurred progressively (up to 8.5px)
      const blurPx = Math.pow(1 - depthFactor, 1.25) * 8.5;
      el.style.filter = blurPx > 0.15 ? `blur(${blurPx.toFixed(1)}px)` : 'none';
    });

    // Rotate 3D marble platform in synchronization with carousel rotation
    if (marbleTopRef.current) {
      marbleTopRef.current.setAttribute(
        'transform',
        `translate(300, 70) scale(1, 0.2) rotate(${current.toFixed(2)})`
      );
    }
    if (marbleRimRef.current) {
      const rimShift = ((current * 1.5) % 300);
      marbleRimRef.current.setAttribute(
        'transform',
        `translate(${rimShift.toFixed(1)}, 0)`
      );
    }
  }, []);

  const tick = useCallback(() => {
    const s = stateRef.current;
    s.current += (s.target - s.current) * 0.075;
    draw();
    if (Math.abs(s.target - s.current) > 0.015) {
      s.frame = requestAnimationFrame(tick);
    } else {
      s.current = s.target;
      draw();
      s.frame = 0;
    }
  }, [draw]);

  const step = useCallback(
    (delta) => {
      const s = stateRef.current;
      s.selected = ((s.selected + delta) % 4 + 4) % 4;
      s.target -= delta * 90;
      setSelected(s.selected);

      if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        if (s.frame) cancelAnimationFrame(s.frame);
        s.frame = 0;
        s.current = s.target;
        draw();
      } else if (!s.frame) {
        s.frame = requestAnimationFrame(tick);
      }
    },
    [draw, tick]
  );

  const resetTimer = useCallback(() => {
    const s = stateRef.current;
    if (s.timer) clearInterval(s.timer);
    if (!s.manualPaused) {
      s.timer = setInterval(() => {
        if (!s.isHovered && !s.manualPaused) {
          step(1);
        }
      }, 3000);
    }
  }, [step]);

  const go = useCallback(
    (i) => {
      const s = stateRef.current;
      let delta = i - s.selected;
      if (delta > 2) delta -= 4;
      if (delta < -2) delta += 4;
      step(delta);
      resetTimer();
    },
    [step, resetTimer]
  );

  const handleNext = useCallback(() => {
    step(1);
    resetTimer();
  }, [step, resetTimer]);

  const handlePrev = useCallback(() => {
    step(-1);
    resetTimer();
  }, [step, resetTimer]);

  const toggleAuto = useCallback(() => {
    const s = stateRef.current;
    if (s.manualPaused) {
      s.manualPaused = false;
      setIsPlaying(true);
      resetTimer();
    } else {
      s.manualPaused = true;
      if (s.timer) clearInterval(s.timer);
      s.timer = null;
      setIsPlaying(false);
    }
  }, [resetTimer]);

  useEffect(() => {
    draw();
    const rId = requestAnimationFrame(() => draw());

    const scene = sceneRef.current;
    if (!scene) return undefined;

    const observer = new ResizeObserver(() => draw());
    observer.observe(scene);
    window.addEventListener('resize', draw);

    const s = stateRef.current;
    s.manualPaused = false;
    s.timer = setInterval(() => {
      if (!s.isHovered && !s.manualPaused) {
        step(1);
      }
    }, 3000);

    return () => {
      cancelAnimationFrame(rId);
      observer.disconnect();
      window.removeEventListener('resize', draw);
      if (s.timer) clearInterval(s.timer);
      if (s.frame) cancelAnimationFrame(s.frame);
    };
  }, [draw, step]);

  function handlePointerDown(e) {
    stateRef.current.startX = e.clientX;
    stateRef.current.isHovered = true;
  }

  function handlePointerUp(e) {
    const startX = stateRef.current.startX;
    if (startX !== null && Math.abs(e.clientX - startX) > 35) {
      step(e.clientX < startX ? 1 : -1);
      resetTimer();
    }
    stateRef.current.startX = null;
    stateRef.current.isHovered = false;
  }

  function handlePointerCancel() {
    stateRef.current.startX = null;
    stateRef.current.isHovered = false;
  }

  function handleMouseEnter() {
    stateRef.current.isHovered = true;
  }

  function handleMouseLeave() {
    stateRef.current.isHovered = false;
  }

  function handleKeyDown(e) {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleNext();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handlePrev();
    }
  }

  const currentProduct = PRODUCTS[selected] || PRODUCTS[0];
  const countDisplay = `0${selected + 1} / 04`;

  return (
    <div
      className="rotator-widget"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="sr-only" aria-live="polite">
        Showing {currentProduct.fullName} ({selected + 1} of 4)
      </div>

      <section
        ref={sceneRef}
        className="rotator-scene"
        aria-label="Circular packaging carousel"
        aria-roledescription="carousel"
        tabIndex={0}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onKeyDown={handleKeyDown}
      >
        {/* Spherical Studio Background Circle in Theme Dark Color */}
        <div className="rotator-backdrop-circle" />

        {/* 3D Rotating Dark Marble Pedestal Platform */}
        <div className="rotator-pedestal-wrap">
          <svg
            viewBox="0 0 600 200"
            className="rotator-pedestal-svg"
            aria-hidden="true"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <radialGradient id="pedFloorShadow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#030e0a" stopOpacity="0.75" />
                <stop offset="45%" stopColor="#030e0a" stopOpacity="0.30" />
                <stop offset="75%" stopColor="#030e0a" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#030e0a" stopOpacity="0" />
              </radialGradient>

              <linearGradient id="pedRimLighting" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#061812" />
                <stop offset="18%" stopColor="#144335" />
                <stop offset="34%" stopColor="#1e5c49" />
                <stop offset="55%" stopColor="#123d30" />
                <stop offset="82%" stopColor="#09241c" />
                <stop offset="100%" stopColor="#04130e" />
              </linearGradient>

              <linearGradient id="pedTopBevel" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.05)" />
                <stop offset="25%" stopColor="rgba(255,255,255,0.48)" />
                <stop offset="45%" stopColor="rgba(255,255,255,0.65)" />
                <stop offset="70%" stopColor="rgba(255,255,255,0.22)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.05)" />
              </linearGradient>

              <clipPath id="pedTopClip">
                <ellipse cx="300" cy="70" rx="270" ry="54" />
              </clipPath>

              <clipPath id="pedRimClip">
                <path d="M 30,70 A 270,54 0 0,0 570,70 L 570,108 A 270,54 0 0,1 30,108 Z" />
              </clipPath>

              <radialGradient id="pedTopSpecular" cx="42%" cy="40%" r="50%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.28)" />
                <stop offset="45%" stopColor="rgba(255,255,255,0.08)" />
                <stop offset="85%" stopColor="rgba(255,255,255,0)" />
              </radialGradient>
            </defs>

            {/* Floor Contact Shadow */}
            <ellipse cx="300" cy="120" rx="285" ry="48" fill="url(#pedFloorShadow)" />

            {/* Cylindrical Rim Base */}
            <path
              d="M 30,70 A 270,54 0 0,0 570,70 L 570,108 A 270,54 0 0,1 30,108 Z"
              fill="url(#pedRimLighting)"
            />

            {/* Rim Marble Grain */}
            <g clipPath="url(#pedRimClip)">
              <g ref={marbleRimRef}>
                {[-300, 0, 300].map((shift) => (
                  <g key={shift} transform={`translate(${shift}, 0)`}>
                    <path d="M 120,60 Q 130,85 125,115" stroke="rgba(215,240,230,0.28)" strokeWidth="1.8" fill="none" />
                    <path d="M 125,80 Q 140,95 145,115" stroke="#d4af37" strokeWidth="1" strokeOpacity="0.3" fill="none" />
                    <path d="M 240,60 Q 235,90 248,115" stroke="rgba(255,255,255,0.22)" strokeWidth="2.2" fill="none" />
                    <path d="M 380,60 Q 395,85 390,115" stroke="rgba(215,240,230,0.25)" strokeWidth="1.5" fill="none" />
                    <path d="M 390,75 Q 405,95 410,115" stroke="#d4af37" strokeWidth="1" strokeOpacity="0.25" fill="none" />
                    <path d="M 500,60 Q 490,88 505,115" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" fill="none" />
                  </g>
                ))}
              </g>
            </g>

            {/* Rim Bottom Bevel Line */}
            <path
              d="M 30,108 A 270,54 0 0,0 570,108"
              stroke="#04120d"
              strokeWidth="1.5"
              fill="none"
            />

            {/* Top Elliptical Surface with Rotating Marble */}
            <g clipPath="url(#pedTopClip)">
              <rect x="0" y="0" width="600" height="150" fill="#0d2b22" />

              <g ref={marbleTopRef} transform="translate(300, 70) scale(1, 0.2) rotate(0)">
                <circle cx="0" cy="0" r="275" fill="#0e3126" />
                <path d="M -260,-80 Q -140,-120 0,-40 T 250,-10" stroke="rgba(230,248,240,0.38)" strokeWidth="3" fill="none" />
                <path d="M -240,-40 Q -100,-80 20,-10 T 260,60" stroke="rgba(255,255,255,0.28)" strokeWidth="2" fill="none" />
                <path d="M -210,60 Q -80,20 60,80 T 240,140" stroke="rgba(220,245,235,0.35)" strokeWidth="2.5" fill="none" />
                <path d="M -180,-140 Q -60,-60 80,-120 T 220,-80" stroke="#d4af37" strokeWidth="1.5" strokeOpacity="0.38" fill="none" />
                <path d="M -120,30 Q 10,70 120,20 T 210,-20" stroke="#d4af37" strokeWidth="1.2" strokeOpacity="0.32" fill="none" />
                <path d="M -250,110 Q -120,130 30,110 T 200,180" stroke="#d4af37" strokeWidth="1.4" strokeOpacity="0.35" fill="none" />
                <path d="M -70,-20 Q -40,-70 10,-40 T 80,-80" stroke="rgba(255,255,255,0.4)" strokeWidth="1" fill="none" />
                <path d="M -150,10 Q -90,-20 -30,10 T 50,40" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" fill="none" />
                <path d="M 60,-30 Q 110,-70 160,-40" stroke="rgba(230,245,240,0.35)" strokeWidth="1" fill="none" />
                <ellipse cx="-80" cy="-60" rx="90" ry="40" fill="#144334" opacity="0.4" />
                <ellipse cx="90" cy="50" rx="110" ry="50" fill="#184c3c" opacity="0.35" />
                <ellipse cx="20" cy="-100" rx="70" ry="30" fill="#1a5241" opacity="0.3" />
              </g>

              <ellipse cx="280" cy="62" rx="240" ry="44" fill="url(#pedTopSpecular)" />
            </g>

            {/* Top Rim Bevel Stroke */}
            <path
              d="M 30,70 A 270,54 0 0,0 570,70"
              stroke="url(#pedTopBevel)"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M 30,70 A 270,54 0 0,1 570,70"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="1"
              fill="none"
            />
          </svg>
        </div>

        <div className="rotator-orbit">
          {PRODUCTS.map((p, i) => (
            <button
              key={p.fullName}
              ref={(el) => {
                productRefs.current[i] = el;
              }}
              type="button"
              className="rotator-product"
              style={{
                opacity: i === 0 ? 1 : 0.5,
                zIndex: i === 0 ? 101 : (i === 2 ? 1 : 51)
              }}
              aria-label={`Bring ${p.fullName} to front`}
              onClick={() => go(i)}
            >
              <img
                src={p.image}
                alt={p.alt}
                loading="eager"
                decoding="async"
                fetchPriority={i === 0 ? 'high' : 'auto'}
                draggable="false"
              />
            </button>
          ))}
        </div>
      </section>

      <div className="rotator-controls">
        <div className="rotator-dots" aria-label="Choose product">
          {PRODUCTS.map((p, i) => (
            <button
              key={p.fullName}
              type="button"
              className={i === selected ? 'active' : ''}
              aria-label={`Show ${p.fullName}`}
              aria-current={i === selected ? 'true' : 'false'}
              onClick={() => go(i)}
            />
          ))}
        </div>

        <div className="rotator-navigation">
          <span className="rotator-count">{countDisplay}</span>
          <button
            type="button"
            className="rotator-arrow"
            aria-label="Rotate to previous product"
            onClick={handlePrev}
          >
            ←
          </button>
          <button
            type="button"
            className="rotator-arrow"
            aria-label="Rotate to next product"
            onClick={handleNext}
          >
            →
          </button>
        </div>
      </div>

      <div className="rotator-footer">
        <span>Use arrows or swipe to rotate</span>
        <span>·</span>
        <button
          type="button"
          onClick={toggleAuto}
          aria-pressed={isPlaying}
        >
          {isPlaying ? 'Pause rotation' : 'Play rotation'}
        </button>
      </div>
    </div>
  );
}
