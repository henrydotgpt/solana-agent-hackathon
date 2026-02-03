"use client";

import React from "react";

export function GradientMesh() {
  return (
    <div className="gradient-mesh" aria-hidden="true">
      <div className="gradient-orb gradient-orb-1" />
      <div className="gradient-orb gradient-orb-2" />
      <div className="gradient-orb gradient-orb-3" />
      <div className="gradient-orb gradient-orb-4" />
    </div>
  );
}

export function SectionGlow({
  color = "green",
  position = "center",
  size = "lg",
  className = "",
}: {
  color?: "green" | "purple" | "blue";
  position?: "center" | "left" | "right" | "top" | "bottom";
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const colorMap = {
    green: "rgba(20, 241, 149, 0.06)",
    purple: "rgba(153, 69, 255, 0.06)",
    blue: "rgba(59, 130, 246, 0.06)",
  };

  const sizeMap = {
    sm: "w-[300px] h-[300px]",
    md: "w-[500px] h-[500px]",
    lg: "w-[700px] h-[700px]",
  };

  const posMap = {
    center: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
    left: "top-1/2 left-0 -translate-y-1/2 -translate-x-1/3",
    right: "top-1/2 right-0 -translate-y-1/2 translate-x-1/3",
    top: "top-0 left-1/2 -translate-x-1/2 -translate-y-1/3",
    bottom: "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/3",
  };

  return (
    <div
      className={`absolute ${sizeMap[size]} ${posMap[position]} rounded-full blur-[150px] pointer-events-none ${className}`}
      style={{ background: `radial-gradient(circle, ${colorMap[color]}, transparent 70%)` }}
      aria-hidden="true"
    />
  );
}
