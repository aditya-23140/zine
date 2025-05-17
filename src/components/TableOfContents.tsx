"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface CursorMaskProps {
  shape?: "circle" | "square" | "star";
}

export default function CursorMask({ shape = "circle" }: CursorMaskProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    window.addEventListener("mousemove", updateMousePosition);

    // Hide cursor mask when mouse leaves window
    const handleMouseLeave = () => setIsVisible(false);
    window.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isVisible]);

  const getShapePath = () => {
    switch (shape) {
      case "square":
        return "M-50,-50 L50,-50 L50,50 L-50,50 Z";
      case "star":
        return "M0,-50 L13.8,-15.5 L50,-15.5 L19.1,5.9 L30.9,40.5 L0,20 L-30.9,40.5 L-19.1,5.9 L-50,-15.5 L-13.8,-15.5 Z";
      case "circle":
      default:
        return "";
    }
  };

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-50"
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.2 }}
    >
      <svg width="100%" height="100%" className="absolute inset-0">
        <defs>
          <mask id="cursor-mask">
            <rect width="100%" height="100%" fill="white" />
            {shape === "circle" ? (
              <circle
                cx={mousePosition.x}
                cy={mousePosition.y}
                r="100"
                fill="black"
              />
            ) : (
              <path
                d={getShapePath()}
                transform={`translate(${mousePosition.x}, ${mousePosition.y})`}
                fill="black"
              />
            )}
          </mask>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="rgba(0, 0, 0, 0.15)"
          mask="url(#cursor-mask)"
        />
      </svg>
    </motion.div>
  );
}
