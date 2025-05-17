"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X, ZoomIn, ZoomOut, RotateCw } from "lucide-react";

interface ZoomableImageProps {
  src: string;
  onClose: () => void;
}

export default function ZoomableImage({ src, onClose }: ZoomableImageProps) {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  // const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [imageError, setImageError] = useState(false);

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.5, 5));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.5, 0.5));
  };

  const handleRotate = () => {
    setRotation((prev) => prev + 90);
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleImageError = () => {
    console.error("Failed to load image:", src);
    setImageError(true);
  };

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !isDragging) {
          onClose();
        }
      }}
    >
      <div className="absolute top-4 right-4 flex gap-2">
        <Button variant="outline" size="icon" onClick={handleZoomIn}>
          <ZoomIn className="h-5 w-5" />
        </Button>
        <Button variant="outline" size="icon" onClick={handleZoomOut}>
          <ZoomOut className="h-5 w-5" />
        </Button>
        <Button variant="outline" size="icon" onClick={handleRotate}>
          <RotateCw className="h-5 w-5" />
        </Button>
        <Button variant="outline" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div
        ref={containerRef}
        className="w-full h-full flex items-center justify-center overflow-hidden"
      >
        <motion.img
          src={src}
          alt="Zoomed view"
          className="max-w-full max-h-full object-contain cursor-grab active:cursor-grabbing"
          style={{
            rotate: rotation,
          }}
          drag
          dragConstraints={containerRef}
          dragElastic={0.1}
          dragMomentum={false}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onError={handleImageError}
          whileTap={{ cursor: "grabbing" }}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{
            scale: scale,
            opacity: 1,
          }}
          transition={{
            type: "spring",
            damping: 25,
            stiffness: 120,
          }}
        />
      </div>

      {imageError && (
        <div className="bg-white p-6 rounded-lg text-center">
          <p className="text-red-500 mb-2">Failed to load image</p>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      )}

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
        Drag to pan • Scroll or use buttons to zoom • Click outside to close
      </div>
    </motion.div>
  );
}
