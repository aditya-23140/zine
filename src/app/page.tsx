"use client";

import {
  useScroll,
  useTransform,
  motion,
  AnimatePresence,
} from "framer-motion";
import { useRef, useState, useEffect } from "react";
import CursorMask from "@/components/CursorMask";
import ZineSpread from "@/components/ZineSpread";
import TableOfContents from "@/components/TableOfContents";
import ZoomableImage from "@/components/ZoomableImage";
import { Button } from "@/components/ui/button";
import { spreads } from "@/data/spreads";
import { ErrorBoundary } from "react-error-boundary";

// Add this function before the Home component
function ErrorFallback({ error, resetErrorBoundary:any }) {
  return (
    <div className="flex items-center justify-center h-screen bg-red-50 p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          Something went wrong
        </h2>
        <p className="mb-4 text-gray-700">{error.message}</p>
        <Button onClick={resetErrorBoundary}>Try again</Button>
      </div>
    </div>
  );
}

export default function Home() {
  const containerRef = useRef<HTMLElement>(null);
  const [showToc, setShowToc] = useState(false);
  const [cursorShape, setCursorShape] = useState<"circle" | "square" | "star">(
    "circle"
  );
  const [currentSpreadIndex, setCurrentSpreadIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomImageSrc, setZoomImageSrc] = useState("");
  const [activeSection, setActiveSection] = useState(0);

  const total = spreads.length;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
  const rotate = useTransform(scrollYProgress, [0, 1], ["0deg", "8deg"]);

  // Page indicator position
  const current = useTransform(scrollYProgress, [0, 1], [1, total + 1]);

  // Update current spread index based on scroll position
  useEffect(() => {
    const unsubscribe = current.on("change", (value) => {
      setCurrentSpreadIndex(Math.floor(value) - 1);
    });
    return () => unsubscribe();
  }, [current]);

  // Update active section based on scroll position with improved timing for last sections
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight =
        document.documentElement.scrollHeight - windowHeight;

      // Get scroll percentage (0 to 1)
      const scrollPercentage = Math.min(scrollPosition / documentHeight, 1);

      // Calculate which section should be active
      let newActiveSection;

      // Special handling for last sections (last 20% of scroll)
      if (scrollPercentage > 0.8) {
        // For the last 20% of the scroll, distribute the last 2 sections evenly
        const lastSectionsPercentage = (scrollPercentage - 0.8) / 0.2;

        // Calculate which of the last 2 sections should be active
        if (lastSectionsPercentage < 0.5) {
          newActiveSection = total - 1; // Second-to-last section
        } else {
          newActiveSection = total; // Last section
        }
      } else {
        // For other sections, use regular positioning
        // We have total - 1 sections in the first 80% of scroll (excluding the last 2)
        const regularSectionHeight = 0.8 / (total - 1);
        newActiveSection = Math.floor(scrollPercentage / regularSectionHeight);
      }

      // Clamp to valid range and adjust for 0-based index
      newActiveSection = Math.max(0, Math.min(newActiveSection, total));

      setActiveSection(newActiveSection);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initialize on mount

    return () => window.removeEventListener("scroll", handleScroll);
  }, [total]);

  const handleZoomImage = (src: string) => {
    setZoomImageSrc(src);
    setIsZoomed(true);
  };

  const scrollToSpread = (index: number) => {
    let targetPercentage;

    // Special handling for last 2 sections
    if (index >= total - 1) {
      // For the last 2 sections, position in the last 20% of scroll
      const lastSectionIndex = index - (total - 2); // 0 or 1 for the last two
      targetPercentage = 0.8 + ((lastSectionIndex + 0.5) / 2) * 0.2;
    } else {
      // For other sections, distribute in the first 80% of scroll
      const regularSectionHeight = 0.8 / (total - 1);
      targetPercentage = (index + 0.5) * regularSectionHeight;
    }

    const documentHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const targetPosition = targetPercentage * documentHeight;

    window.scrollTo({
      top: targetPosition,
      behavior: "smooth",
    });

    setShowToc(false);
  };

  const changeCursorShape = (shape: "circle" | "square" | "star") => {
    setCursorShape(shape);
  };

  return (
    <>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <CursorMask shape={cursorShape} />

        {/* Fixed navigation */}
        <nav className="fixed top-4 right-4 z-20 flex flex-col gap-2">
          {Array.from({ length: total + 1 }).map((_, i) => (
            <motion.span
              key={i}
              className={`block w-3 h-3 rounded-full cursor-pointer transition-all duration-300 ${
                activeSection === i ? "bg-[#ec4e39]" : "bg-gray-400"
              }`}
              style={{
                transform: activeSection === i ? "scale(1.2)" : "scale(1)",
              }}
              onClick={() => scrollToSpread(i)}
            />
          ))}
        </nav>

        {/* Fixed controls */}
        <div className="fixed bottom-4 left-4 z-20 flex gap-2">
          <Button
            variant="outline"
            className="bg-white bg-opacity-80 backdrop-blur"
            onClick={() => setShowToc(!showToc)}
          >
            Table of Contents
          </Button>
          <div className="flex gap-1">
            <Button
              variant="outline"
              className="bg-white bg-opacity-80 backdrop-blur p-2"
              onClick={() => changeCursorShape("circle")}
            >
              ⭕
            </Button>
            <Button
              variant="outline"
              className="bg-white bg-opacity-80 backdrop-blur p-2"
              onClick={() => changeCursorShape("square")}
            >
              ⬜
            </Button>
            <Button
              variant="outline"
              className="bg-white bg-opacity-80 backdrop-blur p-2"
              onClick={() => changeCursorShape("star")}
            >
              ⭐
            </Button>
          </div>
        </div>

        {/* Table of Contents Overlay */}
        <AnimatePresence>
          {showToc && (
            <TableOfContents
              spreads={spreads}
              onClose={() => setShowToc(false)}
              onSelectSpread={scrollToSpread}
            />
          )}
        </AnimatePresence>

        {/* Zoom Overlay */}
        <AnimatePresence>
          {isZoomed && (
            <ZoomableImage
              src={zoomImageSrc}
              onClose={() => setIsZoomed(false)}
            />
          )}
        </AnimatePresence>

        <main
          ref={containerRef}
          className="bg-[#fdf6e3] text-[#1a1a1a] w-full h-[600vh] relative overflow-x-hidden"
        >
          <motion.section
            className="sticky top-0 h-screen w-screen flex items-center justify-center px-6"
            style={{ scale, rotate }}
          >
            <div className="text-center max-w-4xl">
              <h1 className="text-[64px] md:text-[84px] font-bold tracking-tight leading-[1.1] mb-6">
                Interactive Zine Viewer
              </h1>
              <p className="text-xl opacity-80 mb-8">
                Scroll to explore or use the navigation controls
              </p>
              <div className="flex justify-center gap-4">
                <Button
                  className="bg-[#ec4e39] hover:bg-[#d43d29] text-white"
                  onClick={() => scrollToSpread(1)}
                >
                  Start Reading
                </Button>
                <Button variant="outline" onClick={() => setShowToc(true)}>
                  View Contents
                </Button>
              </div>
            </div>
          </motion.section>

          {spreads.map((spread, idx) => (
            <ZineSpread
              key={idx}
              index={idx}
              spread={spread}
              total={total}
              scrollYProgress={scrollYProgress}
              onZoomImage={handleZoomImage}
              isActive={currentSpreadIndex === idx}
            />
          ))}
        </main>
      </ErrorBoundary>
    </>
  );
}
