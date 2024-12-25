'use client';

import React, { DragEventHandler, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import * as Slider from '@radix-ui/react-slider';
import { cn } from '@/lib/utils';

type ImageComparisonProps = {
  beforeImage: string,
  afterImage: string,
  beforeLabel?: string,
  afterLabel?: string,
  className?: string,
}

const ImageComparison = ({
  beforeImage,
  afterImage,
  beforeLabel = "Before",
  afterLabel = "After",
  className = ""
}: ImageComparisonProps) => {
  const [position, setPosition] = useState(50);
  const sliderRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!sliderRef) return;

    const parent = sliderRef.current?.parentElement as HTMLSpanElement;
    if (!parent) return;

    parent.classList.add('top-1/2')
  }, [])

  const handleDragStart: DragEventHandler<HTMLImageElement> = (e) => {
    e.preventDefault();
  };

  return (
    <div className={cn("relative w-full max-w-3xl mx-auto select-none", className)}>
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
        {/* Before Image */}
        <Image
          src={beforeImage}
          alt="Before"
          className="bg-blue-500 absolute top-0 left-0 w-full h-full object-cover"
          onDragStart={handleDragStart}
          width={1200}
          height={675}
        />

        {/* After Image (clipped) */}
        <div
          className="bg-red-500 absolute top-0 left-0 right-0 bottom-0 overflow-hidden"
          style={{ width: `${position}%` }}
        >
          <Image
            src={afterImage}
            alt="After"
            className="absolute top-0 left-0 w-full h-full object-cover"
            onDragStart={handleDragStart}
            width={1200}
            height={675}
          />
        </div>

        {/* Center Slider */}
        <Slider.Root
          className="absolute top-0 bottom-0 w-full h-full"
          value={[position]}
          onValueChange={([value]) => setPosition(value)}
          max={100}
          step={0.1}
        >
          <Slider.Track className="relative w-full h-full">
            <Slider.Range className="absolute top-0 bottom-0 bg-transparent border border-red-500" />
          </Slider.Track>
          <Slider.Thumb ref={sliderRef} className="absolute top-0 bottom-0 w-0.5 bg-white focus:outline-none group">
            <div className="absolute top-1/2 -translate-x-1/2 w-8 h-8">
              <div className="w-full h-full rounded-full bg-white shadow-lg flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-white"
                  >
                    <path
                      d="M10 12L6 8L10 4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </Slider.Thumb>
        </Slider.Root>

        {/* Labels */}
        <div className="absolute top-4 left-4 px-2 py-1 bg-black/50 text-white text-sm rounded">
          {beforeLabel}
        </div>
        <div className="absolute top-4 right-4 px-2 py-1 bg-black/50 text-white text-sm rounded">
          {afterLabel}
        </div>
      </div>
    </div>
  );
};

export default ImageComparison;
