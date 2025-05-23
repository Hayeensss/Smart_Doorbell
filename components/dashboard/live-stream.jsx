"use client";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Maximize, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { useState } from "react";

export default function LiveStream() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  return (
    <div className="relative aspect-video bg-black">
      <div className="absolute inset-0 flex items-center justify-center">
        <iframe
          src="https://video.arthurlian.com/video_feed"
          title="Live stream"
          className="w-full h-full object-cover"
          allowFullScreen
          width="1280"
          height="720"
        />
      </div>

      {/* Stream overlay with controls */}
      <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity bg-gradient-to-b from-black/30 via-transparent to-black/70">
        <div className="absolute top-4 left-4 bg-black/60 text-white px-2 py-1 rounded text-sm flex items-center">
          <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
          LIVE
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <Slider
            defaultValue={[75]}
            max={100}
            step={1}
            className="w-full mb-4"
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? (
                  <VolumeX className="h-5 w-5" />
                ) : (
                  <Volume2 className="h-5 w-5" />
                )}
              </Button>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
            >
              <Maximize className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
