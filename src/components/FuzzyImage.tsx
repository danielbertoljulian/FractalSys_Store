"use client";

import { useEffect, useRef } from "react";

interface FuzzyImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  baseIntensity?: number;
  hoverIntensity?: number;
  dynamicIntensity?: number;
  enableHover?: boolean;
  fuzzRange?: number;
  fps?: number;
  transitionDuration?: number;
}

export default function FuzzyImage({
  src,
  alt,
  width,
  height,
  className = "",
  baseIntensity = 0.14,
  hoverIntensity = 0.32,
  dynamicIntensity = 0.14,
  enableHover = true,
  fuzzRange = 28,
  fps = 60,
  transitionDuration = 120,
}: FuzzyImageProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !img || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const off = document.createElement("canvas");
    const offCtx = off.getContext("2d");
    if (!offCtx) return;

    let raf = 0;
    let running = true;
    let hovering = false;
    let currentIntensity = baseIntensity;
    let targetIntensity = baseIntensity;
    let lastFrame = 0;
    const frameDuration = 1000 / fps;

    const setSize = () => {
      const rect = wrap.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.round(rect.width));
      const h = Math.max(1, Math.round(rect.height));

      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      off.width = canvas.width;
      off.height = canvas.height;

      offCtx.setTransform(1, 0, 0, 1, 0, 0);
      offCtx.clearRect(0, 0, off.width, off.height);
      offCtx.drawImage(img, 0, 0, off.width, off.height);
    };

    const draw = (ts: number) => {
      if (!running) return;

      if (ts - lastFrame < frameDuration) {
        raf = requestAnimationFrame(draw);
        return;
      }
      lastFrame = ts;

      targetIntensity = typeof dynamicIntensity === "number" ? dynamicIntensity : (hovering ? hoverIntensity : baseIntensity);
      if (transitionDuration > 0) {
        const step = 1 / (transitionDuration / frameDuration);
        if (currentIntensity < targetIntensity) currentIntensity = Math.min(currentIntensity + step, targetIntensity);
        if (currentIntensity > targetIntensity) currentIntensity = Math.max(currentIntensity - step, targetIntensity);
      } else {
        currentIntensity = targetIntensity;
      }

      const w = canvas.width;
      const h = canvas.height;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, w, h);

      ctx.drawImage(off, 0, 0, w, h);

      ctx.globalAlpha = Math.max(0, Math.min(0.9, currentIntensity * 0.9));
      for (let y = 0; y < h; y++) {
        const dx = Math.floor(currentIntensity * (Math.random() - 0.5) * fuzzRange * 2);
        ctx.drawImage(off, 0, y, w, 1, dx, y, w, 1);
      }
      ctx.globalAlpha = 1;

      raf = requestAnimationFrame(draw);
    };

    const onMove = (e: MouseEvent) => {
      if (!enableHover) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      hovering = x >= 0 && x <= rect.width && y >= 0 && y <= rect.height;
    };

    const onLeave = () => {
      hovering = false;
    };

    const onLoad = () => {
      setSize();
      raf = requestAnimationFrame(draw);
    };

    if (img.complete && img.naturalWidth > 0) {
      onLoad();
    } else {
      img.addEventListener("load", onLoad);
    }

    const ro = new ResizeObserver(setSize);
    ro.observe(wrap);

    if (enableHover) {
      canvas.addEventListener("mousemove", onMove, { passive: true });
      canvas.addEventListener("mouseleave", onLeave, { passive: true });
    }

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      img.removeEventListener("load", onLoad);
      if (enableHover) {
        canvas.removeEventListener("mousemove", onMove);
        canvas.removeEventListener("mouseleave", onLeave);
      }
    };
  }, [baseIntensity, hoverIntensity, dynamicIntensity, enableHover, fuzzRange, fps, transitionDuration]);

  return (
    <div
      ref={wrapRef}
      className={`relative w-full ${className}`}
      style={{ aspectRatio: width && height ? `${width} / ${height}` : undefined }}
    >
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="absolute inset-0 block w-full h-full object-contain opacity-0"
      />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-auto" />
    </div>
  );
}
