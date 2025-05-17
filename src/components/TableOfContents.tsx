"use client";

import { FC } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export interface Spread {
  title: string;
  // add any other fields your spreads have, e.g. `pageNumber`, `thumbnail`, etc.
}

interface TableOfContentsProps {
  spreads: Spread[];
  onClose: () => void;
  onSelectSpread: (index: number) => void;
}

const backdrop = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const panel = {
  hidden: { x: "100%" },
  visible: { x: 0 },
};

const TableOfContents: FC<TableOfContentsProps> = ({
  spreads,
  onClose,
  onSelectSpread,
}) => {
  return (
    <motion.div
      className="fixed inset-0 z-30 bg-black bg-opacity-50 flex justify-end"
      variants={backdrop}
      initial="hidden"
      animate="visible"
      exit="hidden"
      onClick={onClose}
    >
      <motion.div
        className="w-80 bg-white h-full p-6 shadow-lg"
        variants={panel}
        initial="hidden"
        animate="visible"
        exit="hidden"
        transition={{ type: "tween", duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-semibold mb-4">Table of Contents</h2>
        <ul className="space-y-2 overflow-y-auto max-h-full">
          {spreads.map((spread, idx) => (
            <li key={idx}>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => onSelectSpread(idx)}
              >
                {spread.title || `Spread ${idx + 1}`}
              </Button>
            </li>
          ))}
        </ul>
        <div className="mt-6 text-right">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TableOfContents;
