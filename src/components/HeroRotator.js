'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';

const PRODUCTS = [
  {
    name: 'Rosé Atelier',
    category: 'Blush Beauty Gift Set',
    fullName: 'Rosé Atelier Blush Beauty Gift Set',
    image: '/images/hero-rotator-rose.webp',
    alt: 'Rosé Atelier blush beauty gift set luxury folding carton'
  },
  {
    name: 'Aurelle Ritual',
    category: 'Open Blue Ivory Skincare Kit',
    fullName: 'Open Blue Ivory Skincare Kit',
    image: '/images/hero-rotator-aurelle.webp',
    alt: 'Open blue ivory skincare kit presentation box with bottles and creams'
  },
  {
    name: 'Grove Collection',
    category: 'Kraft Takeaway Carton Collection',
    fullName: 'Grove Kraft Takeaway Carton Collection',
    image: '/images/hero-rotator-grove.webp',
    alt: 'Grove kraft takeaway carton collection food and bakery boxes'
  },
  {
    name: 'Vitalis Healthcare',
    category: 'Premium Folding Carton Collection',
    fullName: 'Premium Vitalis Folding Carton Collection',
    image: '/images/hero-rotator-vitalis.webp',
    alt: 'Premium Vitalis folding carton collection medicine and wellness packaging'
  }
];

export default function HeroRotator() {
  const [selected, setSelected] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [imagesReady, setImagesReady] = useState(false);

  const sceneRef = useRef(null);
  const productRefs = useRef([]);
  const stateRef = useRef({
    selected: 0,
    current: 0,
    target: 0,
    frame: 0,
    timer: null,
    startX: null,
    isHovered: false,
    manualPaused: false,
    imagesReady: false
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
      // Front active item (depth=1) sits forward and low;
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
      if (!s.imagesReady) return;
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

    return () => {
      cancelAnimationFrame(rId);
      observer.disconnect();
      window.removeEventListener('resize', draw);
      if (s.timer) clearInterval(s.timer);
      if (s.frame) cancelAnimationFrame(s.frame);
    };
  }, [draw]);

  useEffect(() => {
    let cancelled = false;
    const load = (src) => new Promise((resolve) => {
      const img = new Image();
      const done = () => resolve();
      img.onload = () => {
        if (img.decode) img.decode().then(done).catch(done);
        else done();
      };
      img.onerror = done;
      img.src = src;
    });

    Promise.all(PRODUCTS.map((item) => load(item.image))).then(() => {
      if (cancelled) return;
      stateRef.current.imagesReady = true;
      setImagesReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!imagesReady) return undefined;
    const frame = requestAnimationFrame(() => draw());
    const s = stateRef.current;
    if (s.timer) clearInterval(s.timer);
    if (s.manualPaused) {
      return () => cancelAnimationFrame(frame);
    }
    s.timer = setInterval(() => {
      if (!s.isHovered && !s.manualPaused) step(1);
    }, 3000);
    return () => {
      cancelAnimationFrame(frame);
      if (s.timer) clearInterval(s.timer);
    };
  }, [imagesReady, step, draw]);

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
                  fetchPriority="high"
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
