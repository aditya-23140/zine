"use client";

import { motion, type MotionValue, useTransform } from "framer-motion";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import type { Spread } from "@/data/spreads";
import { cn } from "@/lib/utils";

interface ZineSpreadProps {
  index: number;
  spread: Spread;
  total: number;
  scrollYProgress: MotionValue<number>;
  onZoomImage: (src: string) => void;
  isActive: boolean;
}

export default function ZineSpread({
  index,
  spread,
  total,
  scrollYProgress,
  onZoomImage,
}: ZineSpreadProps) {
  const [flipped, setFlipped] = useState(false);
  const [opacityValue, setOpacityValue] = useState(0);

  // Calculate start and end points for this spread
  const start = index * (1 / total);
  const end = start + 1 / total;

  // Check if this is one of the last two sections
  const isLastTwo = index >= total - 2;

  // For regular sections, use the standard opacity transform
  const regularOpacity = useTransform(
    scrollYProgress,
    [start + 0.05, start + 0.2],
    [0, 1]
  );

  // For the last two sections, use custom timing
  const lastTwoOpacity = useTransform(
    scrollYProgress,
    // Adjust the timing to ensure they complete properly
    // Start earlier and complete faster
    [
      Math.max(0, start - 0.05), // Start earlier
      Math.min(1, start + 0.15), // Complete faster
    ],
    [0, 1]
  );

  // Use the appropriate opacity transform based on section position
  useEffect(() => {
    const unsubscribe = (isLastTwo ? lastTwoOpacity : regularOpacity).onChange(
      (value) => {
        setOpacityValue(value);
      }
    );
    return unsubscribe;
  }, [isLastTwo, lastTwoOpacity, regularOpacity]);

  // const pageRotation = useTransform(
  //   scrollYProgress,
  //   [start, end],
  //   [0, flipped ? 180 : 0]
  // );

  const handleFlip = () => {
    setFlipped(!flipped);
  };

  return (
    <motion.section
      className="sticky top-0 h-screen w-screen flex items-center justify-center"
      style={{ opacity: opacityValue }}
    >
      <div className="relative w-full h-full overflow-hidden">
        {/* Parallax background layer */}
        <motion.div
          className="absolute inset-0 bg-center bg-cover"
          style={{
            backgroundImage: `url(${spread.backgroundImage})`,
            // Adjust parallax effect for last two sections
            y: useTransform(
              scrollYProgress,
              [start, end],
              [0, isLastTwo ? -100 : -200]
            ),
            filter: "brightness(0.8)",
          }}
        />

        {/* Content container */}
        <div className="relative z-10 flex justify-center items-center h-full">
          <div className="perspective-1000 w-full max-w-6xl px-4">
            <motion.div
              className="relative w-full grid grid-cols-1 md:grid-cols-2 gap-8 preserve-3d transition-transform duration-1000"
              style={{
                rotateY: flipped ? 180 : 0,
              }}
            >
              {/* Front side */}
              <motion.div
                className={cn(
                  "bg-white bg-opacity-90 backdrop-blur p-8 shadow-2xl rounded-xl backface-hidden",
                  flipped && "invisible"
                )}
                initial={{ x: -200, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ amount: 0.3 }}
                transition={{ duration: 1 }}
              >
                <h2 className="text-3xl font-semibold mb-4">{spread.title}</h2>
                <div
                  className="prose"
                  dangerouslySetInnerHTML={{ __html: spread.content }}
                />

                <div className="mt-6 flex gap-3">
                  <Button
                    className="bg-[#ec4e39] hover:bg-[#d43d29] text-white"
                    onClick={handleFlip}
                  >
                    Flip Page
                  </Button>
                  {spread.hasInteractiveElement && (
                    <Button
                      variant="outline"
                      onClick={() => spread.interactiveAction?.()}
                    >
                      {spread.interactiveButtonText}
                    </Button>
                  )}
                </div>
              </motion.div>

              {/* Back side */}
              <motion.div
                className={cn(
                  "bg-white bg-opacity-90 backdrop-blur p-8 shadow-2xl rounded-xl backface-hidden absolute inset-0 rotate-y-180",
                  !flipped && "invisible"
                )}
              >
                <h2 className="text-3xl font-semibold mb-4">
                  {spread.backTitle || "Additional Notes"}
                </h2>
                <div
                  className="prose"
                  dangerouslySetInnerHTML={{
                    __html:
                      spread.backContent || "No additional content available.",
                  }}
                />

                <Button
                  className="mt-6 bg-[#ec4e39] hover:bg-[#d43d29] text-white"
                  onClick={handleFlip}
                >
                  Flip Back
                </Button>
              </motion.div>

              {/* Image */}
              <motion.div
                className="relative"
                initial={{ scale: 1.3, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ amount: 0.3 }}
                transition={{ duration: isLastTwo ? 0.8 : 1.2 }} // Faster animation for last two
              >
                <img
                  src={spread.image || "/placeholder.svg"}
                  alt={spread.title}
                  loading="lazy"
                  className="rounded-lg shadow-xl object-cover h-80 w-full cursor-pointer transform transition-transform hover:scale-105"
                  onClick={() => onZoomImage(spread.image)}
                />
                <div className="absolute bottom-4 right-4 flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="bg-white bg-opacity-70 backdrop-blur"
                    onClick={() => onZoomImage(spread.image)}
                  >
                    Zoom
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Page number */}
        <div className="absolute bottom-8 right-8 z-20">
          <span className="text-white text-xl font-serif bg-black bg-opacity-50 px-4 py-2 rounded-full">
            {index + 1} / {total}
          </span>
        </div>
      </div>
    </motion.section>
  );
}
