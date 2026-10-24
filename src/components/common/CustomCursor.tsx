import React, { useEffect, useRef } from 'react';

/**
 * Ultra-high-performance Custom Cursor
 * Uses direct DOM transform updates in a single requestAnimationFrame loop.
 * Zero React state updates or re-renders during mouse movement (60fps to 120fps fluid).
 */
export const CustomCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const haloRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Only enable on desktop with fine pointer
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let mouseX = -100;
    let mouseY = -100;
    let trailX = -100;
    let trailY = -100;
    let isHovering = false;
    let isVisible = false;
    let animationId: number;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        isVisible = true;
        if (dotRef.current) dotRef.current.style.opacity = '1';
        if (haloRef.current) haloRef.current.style.opacity = '1';
      }

      const target = e.target as HTMLElement;
      const clickable = target && target.closest ? target.closest('button, a, input, [role="button"], .clickable') : null;
      isHovering = !!clickable;
    };

    const handleMouseLeave = () => {
      isVisible = false;
      if (dotRef.current) dotRef.current.style.opacity = '0';
      if (haloRef.current) haloRef.current.style.opacity = '0';
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.body.addEventListener('mouseleave', handleMouseLeave);

    const renderLoop = () => {
      // Smooth lerp for trailing halo
      trailX += (mouseX - trailX) * 0.2;
      trailY += (mouseY - trailY) * 0.2;

      if (dotRef.current) {
        const dotScale = isHovering ? 1.6 : 1.0;
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%) scale(${dotScale})`;
      }

      if (haloRef.current) {
        const haloScale = isHovering ? 1.4 : 1.0;
        const bg = isHovering ? 'rgba(142, 22, 36, 0.12)' : 'transparent';
        const borderColor = isHovering ? '#8E1624' : 'rgba(142, 22, 36, 0.35)';
        haloRef.current.style.transform = `translate3d(${trailX}px, ${trailY}px, 0) translate(-50%, -50%) scale(${haloScale})`;
        haloRef.current.style.backgroundColor = bg;
        haloRef.current.style.borderColor = borderColor;
      }

      animationId = requestAnimationFrame(renderLoop);
    };

    animationId = requestAnimationFrame(renderLoop);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <>
      {/* Central precise deep crimson dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-[#8E1624] pointer-events-none z-[100] opacity-0 transition-opacity duration-200 shadow-[0_0_6px_rgba(142,22,36,0.35)]"
        style={{ willChange: 'transform' }}
      />
      {/* Trailing soft halo */}
      <div
        ref={haloRef}
        className="fixed top-0 left-0 w-7 h-7 rounded-full border border-[#8E1624]/35 pointer-events-none z-[99] opacity-0 transition-opacity duration-200"
        style={{ willChange: 'transform' }}
      />
    </>
  );
};
