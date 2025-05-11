"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { cn } from "@/lib/utils";

export function MediaGallery({ media, onSelectVideo }) {
  const { images = [], videos = [] } = media || { images: [], videos: [] };
  const allMedia = [...images, ...videos];
  
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef(null);

  if (allMedia.length === 0) {
    return null;
  }

  const handlePrevious = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : allMedia.length - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev < allMedia.length - 1 ? prev + 1 : 0));
  };

  const isVideo = (index) => {
    return index >= images.length;
  };

  const getMediaUrl = (index) => {
    if (isVideo(index)) {
      return videos[index - images.length].url;
    }
    return images[index].url;
  };

  const handleThumbnailClick = (index) => {
    setActiveIndex(index);
    if (isVideo(index) && onSelectVideo) {
      onSelectVideo(videos[index - images.length]);
    }
  };

  const activeMedia = allMedia[activeIndex];
  const activeUrl = getMediaUrl(activeIndex);
  const activeIsVideo = isVideo(activeIndex);

  return (
    <div className="space-y-2">
      {/* Main display area */}
      <div className="relative aspect-video bg-white rounded-md overflow-hidden">
        {activeIsVideo ? (
          <div 
            className="w-full h-full flex items-center justify-center cursor-pointer"
            onClick={() => onSelectVideo?.(videos[activeIndex - images.length])}
          >
            <video
              src={activeUrl}
              className="max-h-full max-w-full"
              preload="metadata"
              onLoadedMetadata={(e) => {
                e.target.currentTime = 1;
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Button
                size="icon"
                variant="secondary"
                className="rounded-full h-12 w-12"
              >
                <Play className="h-6 w-6" />
              </Button>
            </div>
          </div>
        ) : (
          <img
            src={activeUrl}
            alt="Media preview"
            className="w-full h-full object-contain"
          />
        )}

        {/* Navigation arrows */}
        {allMedia.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 rounded-full"
              onClick={handlePrevious}
            >
              <ChevronLeft className="h-6 w-6 text-white" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 rounded-full"
              onClick={handleNext}
            >
              <ChevronRight className="h-6 w-6 text-white" />
            </Button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {allMedia.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto py-2" ref={scrollRef}>
          {images.map((image, index) => (
            <button
              key={`image-${image.id}`}
              onClick={() => handleThumbnailClick(index)}
              className={cn(
                "flex-shrink-0 w-16 h-16 rounded overflow-hidden border-2",
                activeIndex === index ? "border-primary" : "border-transparent"
              )}
            >
              <img
                src={image.url}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
          {videos.map((video, index) => (
            <button
              key={`video-${video.id}`}
              onClick={() => handleThumbnailClick(index + images.length)}
              className={cn(
                "flex-shrink-0 w-16 h-16 rounded overflow-hidden border-2 relative",
                activeIndex === index + images.length
                  ? "border-primary"
                  : "border-transparent"
              )}
            >
              <video
                src={video.url}
                className="w-full h-full object-cover"
                preload="metadata"
                onLoadedMetadata={(e) => {
                  e.target.currentTime = 1;
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <Play className="h-4 w-4 text-white" />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 