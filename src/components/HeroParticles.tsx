"use client";

import { useEffect, useRef } from "react";

export default function HeroParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const off = document.createElement("canvas");
    const offCtx = off.getContext("2d");
    if (!offCtx) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    type Particle = { x: number; y: number; vx: number; vy: number; r: number; col: string };
    let cx = 0, cy = 0, mobile = false;
    const offsetY = -0.02;
    const getOffsetX = () => mobile ? -0.24 : -0.26;

    const getAnchorFromLayout = (): { cxPct: number; cyPct: number } => {
      const img = parent.querySelector("img") as HTMLElement | null;
      if (img && canvas.width > 0 && canvas.height > 0) {
        let el: HTMLElement | null = img;
        let imgOffsetLeft = 0, imgOffsetTop = 0;
        while (el && el !== parent) {
          imgOffsetLeft += el.offsetLeft;
          imgOffsetTop += el.offsetTop;
          el = (el.offsetParent as HTMLElement | null);
        }
        const cxPct = (imgOffsetLeft + img.offsetWidth * 0.5) / canvas.width;
        const cyPct = (imgOffsetTop + img.offsetHeight * 0.5) / canvas.height;
        return { cxPct, cyPct };
      }
      return { cxPct: 0.5, cyPct: 0.5 };
    };

    const groups = [
      { pct: 0.022, count: 4, speed: 4.0, lineColor: "6, 182, 212", delay: 0 },
      { pct: 0.045, count: 6, speed: 4.0, lineColor: "255, 0, 255", delay: 70 },
    ];

    const particles: { nodes: Particle[]; maxRadius: number; pct: number; lineColor: string; delay: number; active: boolean }[] = [];

    canvas.width = parent.offsetWidth;
    canvas.height = parent.offsetHeight;
    mobile = window.innerWidth < 768;
    {
      const { cxPct, cyPct } = getAnchorFromLayout();
      cx = canvas.width * (cxPct + getOffsetX());
      cy = canvas.height * (cyPct + offsetY);
    }

    const onResize = () => {
      const oldCx = cx, oldCy = cy;
      canvas.width = parent.offsetWidth;
      canvas.height = parent.offsetHeight;
      off.width = canvas.width;
      off.height = canvas.height;
      mobile = window.innerWidth < 768;

      const { cxPct, cyPct } = getAnchorFromLayout();
      cx = canvas.width * (cxPct + getOffsetX());
      cy = canvas.height * (cyPct + offsetY);

      for (const g of particles) {
        for (const n of g.nodes) { n.x += cx - oldCx; n.y += cy - oldCy; }
        g.maxRadius = Math.round(canvas.width * g.pct);
      }
    };
    requestAnimationFrame(() => { onResize(); });

    for (const g of groups) {
      const nodes: Particle[] = [];
      for (let i = 0; i < g.count; i++) {
        nodes.push({
          x: cx,
          y: cy,
          vx: (Math.random() - 0.5) * g.speed,
          vy: (Math.random() - 0.5) * g.speed,
          r: Math.random() * 0.6 + 0.2,
          col: (i + 1) % 2 === 0 ? "#06B6D4" : "#FF00FF",
        });
      }
      particles.push({ nodes, maxRadius: Math.round(canvas.width * g.pct), pct: g.pct, lineColor: g.lineColor, delay: g.delay, active: false });
    }

    let frame = 0;
    let animId: number;

    const draw = () => {
      offCtx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;

      for (const group of particles) {
        if (frame < group.delay) continue;
        group.active = true;

        for (const n of group.nodes) {
          n.x += n.vx;
          n.y += n.vy;
          const dx = n.x - cx;
          const dy = n.y - cy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > group.maxRadius) {
            const angle = Math.atan2(dy, dx);
            n.x = cx + Math.cos(angle) * group.maxRadius;
            n.y = cy + Math.sin(angle) * group.maxRadius;
            n.vx *= -1;
            n.vy *= -1;
          }
        }

        const connectionDist = 200;
        for (let i = 0; i < group.nodes.length; i++) {
          for (let j = i + 1; j < group.nodes.length; j++) {
            const dx = group.nodes[i].x - group.nodes[j].x;
            const dy = group.nodes[i].y - group.nodes[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < connectionDist) {
              const alpha = (1 - dist / connectionDist) * 0.9;
              const isParticles2 = particles.indexOf(group) === 1;
              const lineColor = isParticles2 ? (i % 2 === 0 ? "255, 0, 255" : "6, 182, 212") : group.lineColor;
              offCtx.beginPath();
              offCtx.moveTo(group.nodes[i].x, group.nodes[i].y);
              offCtx.lineTo(group.nodes[j].x, group.nodes[j].y);
              offCtx.strokeStyle = `rgba(${lineColor}, ${alpha})`;
              offCtx.lineWidth = 1.5;
              offCtx.stroke();
            }
          }
        }
      }

      if (particles.length === 2 && particles[0].active && particles[1].active) {
        const g0 = particles[0].nodes;
        const g1 = particles[1].nodes;
        const crossDist = 250;
        for (let i = 0; i < g0.length; i++) {
          for (let j = 0; j < g1.length; j++) {
            const dx = g0[i].x - g1[j].x;
            const dy = g0[i].y - g1[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < crossDist) {
              const alpha = (1 - dist / crossDist) * 0.5;
              const col = (i + j) % 2 === 0 ? "6, 182, 212" : "255, 0, 255";
              offCtx.beginPath();
              offCtx.moveTo(g0[i].x, g0[i].y);
              offCtx.lineTo(g1[j].x, g1[j].y);
              offCtx.strokeStyle = `rgba(${col}, ${alpha})`;
              offCtx.lineWidth = 1;
              offCtx.stroke();
            }
          }
        }
      }

      for (const group of particles) {
        if (frame < group.delay) continue;
        for (const n of group.nodes) {
          if (!Number.isFinite(n.x) || !Number.isFinite(n.y) || !Number.isFinite(n.r)) continue;
          
          const gradient = offCtx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 3);
          gradient.addColorStop(0, n.col);
          gradient.addColorStop(0.5, n.col + "88");
          gradient.addColorStop(1, "transparent");
          offCtx.fillStyle = gradient;
          offCtx.beginPath();
          offCtx.arc(n.x, n.y, n.r * 3, 0, Math.PI * 2);
          offCtx.fill();

          offCtx.fillStyle = n.col;
          offCtx.beginPath();
          offCtx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
          offCtx.fill();
        }
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const intensity = mobile ? 0.08 : 0.12;
      const range = mobile ? 6 : 10;
      for (let y = 0; y < canvas.height; y++) {
        const dx = Math.floor((Math.random() - 0.5) * range * intensity * 2);
        ctx.drawImage(off, 0, y, canvas.width, 1, dx, y, canvas.width, 1);
      }

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);

    const obs = new ResizeObserver(onResize);
    obs.observe(parent);

    return () => {
      cancelAnimationFrame(animId);
      obs.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-20"
    />
  );
}
