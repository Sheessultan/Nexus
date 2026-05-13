'use client';

import { useEffect, useRef } from 'react';

const STEP = 24;
const MAX_COLS = 64;

type Drop = { x: number; y: number; speed: number; tick: number; ch: string };

/** Sparse falling 0/1 — fixed layer, pointer-events none, low visual weight. */
export default function DigitalRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const surface = canvasRef.current;
    if (!surface) return;
    const ctx = surface.getContext('2d', { alpha: true });
    if (!ctx) return;

    const g = ctx;
    const drops: Drop[] = [];
    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;

    function buildDrops() {
      drops.length = 0;
      let col = 0;
      for (let x = 0; x < w && col < MAX_COLS; x += STEP) {
        col++;
        drops.push({
          x: x + (Math.random() - 0.5) * 8,
          y: Math.random() * h,
          speed: 0.4 + Math.random() * 1.1,
          tick: Math.floor(Math.random() * 100),
          ch: Math.random() > 0.5 ? '1' : '0',
        });
      }
    }

    function resize() {
      const node = canvasRef.current;
      if (!node) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      node.width = Math.floor(w * dpr);
      node.height = Math.floor(h * dpr);
      node.style.width = `${w}px`;
      node.style.height = `${h}px`;
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildDrops();
    }

    function tick() {
      if (document.hidden) {
        raf = requestAnimationFrame(tick);
        return;
      }
      g.fillStyle = 'rgba(0, 0, 0, 0.14)';
      g.fillRect(0, 0, w, h);

      g.font = '500 11px ui-monospace, monospace';
      g.textBaseline = 'top';

      for (const d of drops) {
        d.tick += 1;
        d.y += d.speed;
        if (d.tick % 22 === 0) d.ch = d.ch === '0' ? '1' : '0';
        if (d.y > h + 12) d.y = -20 - Math.random() * h * 0.4;

        const cyan = (d.x | 0) % 2 === 0;
        g.fillStyle = cyan ? 'rgba(34, 211, 238, 0.85)' : 'rgba(74, 222, 128, 0.85)';
        g.globalAlpha = 0.045 + ((d.x % STEP) / STEP) * 0.04;
        g.fillText(d.ch, d.x, d.y);
      }
      g.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    }

    resize();
    const onResize = () => resize();
    window.addEventListener('resize', onResize);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 opacity-40 md:opacity-35"
    />
  );
}
