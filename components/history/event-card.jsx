"use client";

import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, Bell, Radio, Play, Download, ZoomIn } from "lucide-react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { MediaGallery } from "@/components/ui/media-gallery";

const getEventIcon = (type) => {
  switch (type) {
    case "camera":
      return <Camera className="h-4 w-4" />;
    case "doorbell":
      return <Bell className="h-4 w-4" />;
    case "sensor":
      return <Radio className="h-4 w-4" />;
    default:
      return <Camera className="h-4 w-4" />;
  }
};

const getEventBadge = (eventType) => {
  switch (eventType) {
    case "motion":
      return <Badge variant="secondary">Motion</Badge>;
    case "ring":
      return <Badge>Ring</Badge>;
    default:
      return <Badge variant="outline">Event</Badge>;
  }
};

export default function EventCard({ event, isExpanded, onToggleExpand }) {
  if (!event) return null;

  const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const videoRef = useRef(null);

  const handlePlayVideo = (video) => {
    setSelectedVideo(video?.url || event.media?.videos[0]?.url);
    setIsVideoDialogOpen(true);
  };

  const handleVideoDialogClose = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setIsVideoDialogOpen(false);
  };

  // Check if we have media
  const hasMedia = event.media && 
    (event.media.images.length > 0 || event.media.videos.length > 0);

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row">
          {event.thumbnail && (
            <div className="relative sm:w-48 h-32">
              {/* If it's not expanded, just show the thumbnail */}
              {!isExpanded ? (
                <div className="w-full h-full bg-muted">
                  <img
                    src={event.thumbnail}
                    alt={`Event from ${event.deviceName || 'Unknown Device'}`}
                    className="w-full h-full object-cover"
                  />
                  {event.hasRecording && (
                    <div className="absolute right-2 bottom-2 rounded-full bg-black/50 p-1">
                      <Play className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>
              ) : (
                // If expanded, show the full media gallery
                <div className="w-full h-full bg-muted">
                  <img
                    src={event.thumbnail}
                    alt={`Event from ${event.deviceName || 'Unknown Device'}`}
                    className="w-full h-full object-cover"
                  />
                  {event.hasRecording && (
                    <div 
                      className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                      onClick={() => handlePlayVideo()}
                    >
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        className="gap-1"
                      >
                        <Play className="h-4 w-4" />
                        Play
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="p-4 flex-1">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  {getEventIcon(event.deviceType)}
                  <span className="font-medium">{event.deviceName || 'Unknown Device'}</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  {getEventBadge(event.eventType)}
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(event.timestamp), "h:mm a")}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                {event.hasRecording && (
                  <Button variant="ghost" size="icon" title="Download recording">
                    <Download className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggleExpand}
                  aria-expanded={isExpanded}
                >
                  {isExpanded ? "Less" : "More"}
                </Button>
              </div>
            </div>

            {isExpanded && (
              <div className="mt-4 pt-4 border-t">
                <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                  <div>
                    <div className="text-muted-foreground">Device</div>
                    <div>{event.deviceName || 'Unknown Device'}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Event Type</div>
                    <div className="capitalize">{event.eventType}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Date</div>
                    <div>{format(new Date(event.timestamp), "MMM d, yyyy")}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Time</div>
                    <div>{format(new Date(event.timestamp), "h:mm:ss a")}</div>
                  </div>
                </div>

                {/* Display media gallery when expanded */}
                {hasMedia && (
                  <div className="mt-4">
                    <MediaGallery 
                      media={event.media} 
                      onSelectVideo={handlePlayVideo}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Video Dialog */}
          <Dialog open={isVideoDialogOpen} onOpenChange={handleVideoDialogClose}>
            <DialogContent className="max-w-4xl">
              <DialogTitle>
                <VisuallyHidden>
                  Video Recording from {event.deviceName || 'Unknown Device'} at {format(new Date(event.timestamp), "MMM d, yyyy h:mm a")}
                </VisuallyHidden>
              </DialogTitle>
              {selectedVideo && (
                <div className="relative w-full aspect-video">
                  <video
                    ref={videoRef}
                    key={selectedVideo} // Force remount when URL changes
                    className="w-full h-full"
                    controls
                    autoPlay
                    src={selectedVideo}
                  />
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
} 