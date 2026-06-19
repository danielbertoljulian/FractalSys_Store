"use client";

import { useState } from "react";

export default function AudioControls() {
  const [active, setActive] = useState(false);
  const [volume, setVolume] = useState(55);

  const activate = () => {
    window.dispatchEvent(new Event("fractal-audio-start"));
    setActive(true);
  };

  const deactivate = () => {
    window.dispatchEvent(new Event("fractal-audio-stop"));
    setActive(false);
  };

  const onVolumeChange = (v: number) => {
    setVolume(v);
    window.dispatchEvent(new CustomEvent("fractal-audio-volume", { detail: v / 100 }));
  };

  return (
    <div className="flex items-center gap-3">
      {!active ? (
        <button
          type="button"
          onClick={activate}
          className="px-4 md:px-3 py-2 md:py-1.5 rounded-full border border-cyan-400/70 text-sm md:text-xs text-cyan-300 bg-cyan-500/10 animate-pulse shadow-[0_0_14px_#06B6D4] hover:bg-cyan-500/20"
        >
          Ativar Áudio
        </button>
      ) : (
        <button
          type="button"
          onClick={deactivate}
          className="px-4 md:px-3 py-2 md:py-1.5 rounded-full border border-cyan-400/70 text-sm md:text-xs text-cyan-300 bg-cyan-500/10 shadow-[0_0_10px_#06B6D4] hover:bg-cyan-500/20"
        >
          Desligar Áudio
        </button>
      )}

      <input
        type="range"
        min={0}
        max={100}
        value={volume}
        onChange={(e) => onVolumeChange(Number(e.target.value))}
        className="w-32 md:w-24 accent-cyan-500 bg-zinc-800 rounded-lg cursor-pointer"
        aria-label="Volume"
      />
    </div>
  );
}
