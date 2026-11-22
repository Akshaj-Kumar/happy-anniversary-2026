import React, { useEffect, useState } from 'react';

export default function HeartAnimation({ count = 20, color = '#B5122A' }) {
  const [hearts, setHearts] = useState([]);

  useEffect(() => {
    const generated = [];
    for (let i = 0; i < count; i++) {
      generated.push({
        id: i,
        left: Math.random() * 96 + 2, // 2% to 98%
        size: Math.random() * 16 + 12, // 12px to 28px
        duration: Math.random() * 6 + 6, // 6s to 12s
        delay: Math.random() * 5, // 0s to 5s
        opacity: Math.random() * 0.45 + 0.25,
      });
    }
    setHearts(generated);
  }, [count]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map((h) => (
        <span
          key={h.id}
          style={{
            left: `${h.left}%`,
            width: `${h.size}px`,
            height: `${h.size}px`,
            animation: `floatBackgroundHeart ${h.duration}s linear infinite`,
            animationDelay: `${h.delay}s`,
            opacity: h.opacity,
            color: color,
          }}
          className="absolute select-none text-romantic-red"
        >
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-full h-full drop-shadow-[0_2px_4px_rgba(181,18,42,0.2)]"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </span>
      ))}
    </div>
  );
}
