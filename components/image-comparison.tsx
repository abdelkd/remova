'use client';

import React, { useState, useRef, useEffect, DragEventHandler } from 'react';
import Image from 'next/image';
import * as Slider from '@radix-ui/react-slider';
import { cn } from '@/lib/utils';

interface ImageComparisonProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
}

const ImageComparison = ({
  beforeImage,
  afterImage,
  beforeLabel = "Before",
  afterLabel = "After",
  className = ""
}: ImageComparisonProps) => {
  const [position, setPosition] = useState(50);
  const [isLoaded, setIsLoaded] = useState(false);
  const sliderRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sliderRef.current) return;
    const parent = sliderRef.current?.parentElement as HTMLSpanElement;
    if (!parent) return;
    parent.classList.add('top-1/2');
  }, []);

  const handleDragStart: DragEventHandler<HTMLImageElement> = (e) => {
    e.preventDefault();
  };

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full max-w-3xl mx-auto select-none opacity-0 transition-opacity duration-300",
        isLoaded && "opacity-100",
        className
      )}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
        <div className="absolute inset-0 z-10">
          <Image
            src={beforeImage}
            alt="Before"
            className="absolute top-0 left-0 w-full h-full object-cover"
            onDragStart={handleDragStart}
            width={1200}
            height={675}
            priority
            onLoad={handleImageLoad}
          />
        </div>

        <div
          className="absolute inset-0 overflow-hidden z-20"
          style={{ width: `${position}%` }}
        >
          <div className="absolute inset-0">
            <Image
              src={afterImage}
              alt="After"
              className="absolute top-0 left-0 w-full h-full object-cover"
              onDragStart={handleDragStart}
              width={1200}
              height={675}
              priority
            />
          </div>
        </div>

        <Slider.Root
          className="absolute inset-0 z-30"
          value={[position]}
          onValueChange={([value]) => setPosition(value)}
          max={100}
          step={0.1}
        >
          <Slider.Track className="relative w-full h-full">
            <Slider.Range className="absolute inset-0 bg-transparent" />
          </Slider.Track>
          <Slider.Thumb
            ref={sliderRef}
            className="absolute top-0 bottom-0 w-0.5 bg-white focus:outline-none group"
          >
            <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8">
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

        <div className="absolute top-4 left-4 px-2 py-1 bg-black/50 text-white text-sm rounded z-40">
          {beforeLabel}
        </div>
        <div className="absolute top-4 right-4 px-2 py-1 bg-black/50 text-white text-sm rounded z-40">
          {afterLabel}
        </div>
      </div>
    </div>
  );
};

export default ImageComparison;
