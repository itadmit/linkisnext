"use client";

import { useEffect, useState } from "react";

interface AnimatedBackgroundProps {
  color: string;
  variant?: "gradient" | "particles" | "waves" | "geometric" | "none";
}

export function AnimatedBackground({ color, variant = "gradient" }: AnimatedBackgroundProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Convert hex to RGB for manipulation
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 26, g: 26, b: 46 };
  };

  const rgb = hexToRgb(color);
  const lighterColor = `rgba(${Math.min(rgb.r + 30, 255)}, ${Math.min(rgb.g + 30, 255)}, ${Math.min(rgb.b + 30, 255)}, 0.5)`;
  const darkerColor = `rgba(${Math.max(rgb.r - 20, 0)}, ${Math.max(rgb.g - 20, 0)}, ${Math.max(rgb.b - 20, 0)}, 1)`;

  if (variant === "none") return null;

  if (variant === "particles") {
    return (
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-float"
            style={{
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              backgroundColor: lighterColor,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 10}s`,
            }}
          />
        ))}
      </div>
    );
  }

  if (variant === "waves") {
    return (
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <svg
          className="absolute bottom-0 w-full h-64"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill={lighterColor}
            className="animate-wave"
            d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
          <path
            fill={darkerColor}
            className="animate-wave-slow"
            d="M0,256L48,261.3C96,267,192,277,288,266.7C384,256,480,224,576,213.3C672,203,768,213,864,224C960,235,1056,245,1152,234.7C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>
    );
  }

  if (variant === "geometric") {
    return (
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30">
        <div
          className="absolute w-96 h-96 rounded-full blur-3xl animate-pulse"
          style={{
            backgroundColor: lighterColor,
            top: "-10%",
            right: "-10%",
          }}
        />
        <div
          className="absolute w-64 h-64 rounded-full blur-3xl animate-pulse"
          style={{
            backgroundColor: lighterColor,
            bottom: "10%",
            left: "-5%",
            animationDelay: "1s",
          }}
        />
        <div
          className="absolute w-48 h-48 rounded-full blur-2xl animate-pulse"
          style={{
            backgroundColor: lighterColor,
            top: "40%",
            right: "20%",
            animationDelay: "2s",
          }}
        />
      </div>
    );
  }

  // Default gradient
  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{
        background: `radial-gradient(ellipse at top, ${lighterColor}, transparent 50%),
                     radial-gradient(ellipse at bottom, ${darkerColor}, transparent 50%)`,
      }}
    />
  );
}

