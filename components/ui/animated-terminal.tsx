"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";

interface TerminalLine {
  type: "command" | "output" | "success" | "info" | "comment";
  text: string;
  delay?: number;
}

interface AnimatedTerminalProps {
  lines: TerminalLine[];
  typingSpeed?: number;
  className?: string;
  title?: string;
}

const lineColors: Record<string, string> = {
  command: "text-emerald-400",
  output: "text-gray-400",
  success: "text-emerald-300",
  info: "text-blue-400",
  comment: "text-gray-600",
};

const linePrefix: Record<string, string> = {
  command: "$ ",
  output: "  ",
  success: "✓ ",
  info: "→ ",
  comment: "# ",
};

export function AnimatedTerminal({
  lines,
  typingSpeed = 30,
  className = "",
  title = "terminal",
}: AnimatedTerminalProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [currentText, setCurrentText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isInView) return;

    let timeout: NodeJS.Timeout;

    const typeLine = (lineIndex: number, charIndex: number) => {
      if (lineIndex >= lines.length) return;

      const line = lines[lineIndex];

      if (line.type === "command") {
        setIsTyping(true);
        if (charIndex <= line.text.length) {
          setCurrentText(line.text.slice(0, charIndex));
          timeout = setTimeout(
            () => typeLine(lineIndex, charIndex + 1),
            typingSpeed + Math.random() * 20
          );
        } else {
          setIsTyping(false);
          setVisibleLines(lineIndex + 1);
          setCurrentText("");
          const delay = line.delay || 400;
          timeout = setTimeout(() => typeLine(lineIndex + 1, 0), delay);
        }
      } else {
        setVisibleLines(lineIndex + 1);
        const delay = line.delay || 150;
        timeout = setTimeout(() => typeLine(lineIndex + 1, 0), delay);
      }
    };

    timeout = setTimeout(() => typeLine(0, 0), 800);
    return () => clearTimeout(timeout);
  }, [isInView, lines, typingSpeed]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [visibleLines, currentText]);

  return (
    <div ref={ref} className={`rounded-2xl overflow-hidden ${className}`}>
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-3 bg-[#0A0A10] border-b border-white/[0.04]">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#FF5F57]/80" />
          <div className="w-3 h-3 rounded-full bg-[#FEBC2E]/80" />
          <div className="w-3 h-3 rounded-full bg-[#28C840]/80" />
        </div>
        <span className="flex-1 text-center text-[11px] text-gray-600 font-mono">
          {title}
        </span>
      </div>

      {/* Terminal body */}
      <div
        ref={scrollRef}
        className="bg-[#06060A] p-5 font-mono text-[13px] leading-relaxed min-h-[280px] max-h-[360px] overflow-y-auto"
      >
        {lines.slice(0, visibleLines).map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={`${lineColors[line.type]} whitespace-pre-wrap`}
          >
            <span className="opacity-50">{linePrefix[line.type]}</span>
            {line.text}
          </motion.div>
        ))}

        {/* Currently typing line */}
        {isTyping && visibleLines < lines.length && (
          <div className={lineColors[lines[visibleLines]?.type || "command"]}>
            <span className="opacity-50">
              {linePrefix[lines[visibleLines]?.type || "command"]}
            </span>
            {currentText}
            <span className="inline-block w-[7px] h-[14px] bg-emerald-400 ml-px animate-blink" />
          </div>
        )}

        {/* Idle cursor */}
        {!isTyping && visibleLines >= lines.length && (
          <div className="text-emerald-400 mt-1">
            <span className="opacity-50">$ </span>
            <span className="inline-block w-[7px] h-[14px] bg-emerald-400 animate-blink" />
          </div>
        )}
      </div>
    </div>
  );
}
