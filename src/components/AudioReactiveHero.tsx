"use client";

import { useEffect, useRef, useState } from "react";
import FuzzyImage from "@/components/FuzzyImage";
import HeroParticles from "@/components/HeroParticles";

type Props = {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
};

export default function AudioReactiveHero({ src, alt, width, height, className = "" }: Props) {
  const [baseIntensity, setBaseIntensity] = useState(0.14);
  const [hoverIntensity, setHoverIntensity] = useState(0.35);
  const [dynamicIntensity, setDynamicIntensity] = useState(0.16);
  const [fuzzRange, setFuzzRange] = useState(24);
  const [active, setActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
      if (ctxRef.current && ctxRef.current.state !== "closed") {
        void ctxRef.current.close();
      }
    };
  }, []);

  const startAudioReactive = async () => {
    try {
      setError(null);

      const audio = new Audio("/audio/site-theme.mp3");
      audio.loop = true;
      audio.crossOrigin = "anonymous";
      audio.volume = 0.55;

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.82;

      const source = ctx.createMediaElementSource(audio);
      source.connect(analyser);
      analyser.connect(ctx.destination);

      await ctx.resume();
      await audio.play();

      audioRef.current = audio;
      ctxRef.current = ctx;
      analyserRef.current = analyser;
      setActive(true);

      const buffer = new Uint8Array(analyser.frequencyBinCount);

      const tick = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(buffer);

        const bass = buffer.slice(0, 8);
        const mids = buffer.slice(8, 48);

        const avgBass = bass.reduce((a, b) => a + b, 0) / bass.length;
        const avgMids = mids.reduce((a, b) => a + b, 0) / mids.length;

        const normBass = Math.min(0.001, avgBass / 200);
        const normMids = Math.min(0.001, avgMids / 160);

        setDynamicIntensity(0.38 + normBass * 0.50);
        setFuzzRange(12 + Math.round(normBass * 0.02));
        setBaseIntensity(2 + normBass * 0.2);
        setHoverIntensity(1 + normMids * 0.618);

        rafRef.current = requestAnimationFrame(tick);
      };

      rafRef.current = requestAnimationFrame(tick);
    } catch {
      setError("Não foi possível iniciar áudio. Verifique /public/audio/site-theme.mp3");
    }
  };

  const stopAudioReactive = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = 0;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setActive(false);
  };

  useEffect(() => {
    const onStart = () => {
      if (!active) void startAudioReactive();
    };

    const onStop = () => {
      stopAudioReactive();
    };

    const onVolume = (event: Event) => {
      const custom = event as CustomEvent<number>;
      const volume = typeof custom.detail === "number" ? custom.detail : null;
      if (audioRef.current && volume !== null) {
        audioRef.current.volume = Math.max(0, Math.min(1, volume));
      }
    };

    window.addEventListener("fractal-audio-start", onStart);
    window.addEventListener("fractal-audio-stop", onStop);
    window.addEventListener("fractal-audio-volume", onVolume as EventListener);

    return () => {
      window.removeEventListener("fractal-audio-start", onStart);
      window.removeEventListener("fractal-audio-stop", onStop);
      window.removeEventListener("fractal-audio-volume", onVolume as EventListener);
    };
  }, [active]);

  return (
    <div className={`relative w-full flex justify-center ${className}`}>
      <div 
        className="relative z-10 w-full max-w-[270px] md:max-w-none" 
        style={{ width: `${width}px`, height: 'auto' }}
      >
        <FuzzyImage
          src={src}
          alt={alt}
          width={width}
          height={height}
          baseIntensity={baseIntensity}
          hoverIntensity={hoverIntensity}
          dynamicIntensity={dynamicIntensity}
          fuzzRange={fuzzRange}
          enableHover
          className="w-full h-auto origin-center"
        />
        <HeroParticles />
      </div>

      {error && <p className="absolute left-1/2 -translate-x-1/2 -bottom-5 z-30 text-[11px] text-red-500">{error}</p>}
    </div>
  );
}
