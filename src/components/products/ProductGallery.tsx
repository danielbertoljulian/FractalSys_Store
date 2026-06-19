"use client"

import { useState } from "react"
import Image from "next/image"

const PLACEHOLDER = "/products/placeholder.svg"

interface ProductGalleryProps {
  images: string[]
  name: string
}

export default function ProductGallery({ images, name }: ProductGalleryProps) {
  const [selectedIdx, setSelectedIdx] = useState(0)
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({})

  const handleError = (idx: number) => {
    setImgErrors((prev) => ({ ...prev, [idx]: true }))
  }

  const getSrc = (img: string, idx: number) => {
    return imgErrors[idx] ? PLACEHOLDER : img
  }

  if (images.length === 0) {
    return (
      <div className="aspect-square rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600">
        Em Breve
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800">
        <Image
          src={getSrc(images[selectedIdx], selectedIdx)}
          alt={`${name} - Imagem ${selectedIdx + 1}`}
          fill
          className="object-contain p-8"
          priority
          onError={() => handleError(selectedIdx)}
        />
      </div>
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto scrollbar-hide">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIdx(idx)}
              className={`relative w-20 h-20 shrink-0 rounded-xl overflow-hidden border-2 transition-colors ${
                idx === selectedIdx
                  ? "border-accent-cyan"
                  : "border-zinc-800 hover:border-zinc-600"
              }`}
            >
              <Image
                src={getSrc(img, idx)}
                alt={`${name} thumbnail ${idx + 1}`}
                fill
                className="object-contain p-2"
                onError={() => handleError(idx)}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
