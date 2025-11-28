import { useEffect, useRef } from 'react';

export type LightRaysProps = {
  raysOrigin?: 'top-center' | 'center';
  raysColor?: string;
  raysSpeed?: number;
  lightSpread?: number;
  rayLength?: number;
  followMouse?: boolean;
  mouseInfluence?: number;
  noiseAmount?: number;
  distortion?: number;
  className?: string;
};

export default function LightRays({
  raysOrigin = 'top-center',
  raysColor = '#BD95A4',
  raysSpeed = 1,
  lightSpread = 0.8,
  rayLength = 1.2,
  followMouse = true,
  mouseInfluence = 0.12,
  // noiseAmount,
  // distortion,
  className,
}: LightRaysProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!followMouse) return;
    const el = rootRef.current;
    if (!el) return;

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      const strength = mouseInfluence;
      el.style.setProperty('--rays-translate-x', `${x * strength * 100}px`);
      el.style.setProperty('--rays-translate-y', `${y * strength * 60}px`);
    };

    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [followMouse, mouseInfluence]);

  const duration = 40 / Math.max(raysSpeed, 0.1);

  const style: React.CSSProperties = {
    // @ts-expect-error CSS custom properties
    '--rays-color': raysColor,
    // @ts-expect-error CSS custom properties
    '--rays-speed': `${duration}s`,
    // @ts-expect-error CSS custom properties
    '--rays-spread': lightSpread,
    // @ts-expect-error CSS custom properties
    '--rays-length': rayLength,
    // defaults for mouse offset
    // @ts-expect-error CSS custom properties
    '--rays-translate-x': '0px',
    // @ts-expect-error CSS custom properties
    '--rays-translate-y': '0px',
  };

  const originClass =
    raysOrigin === 'top-center' ? 'light-rays--top-center' : 'light-rays--center';

  const cls = ['light-rays', originClass, className].filter(Boolean).join(' ');

  return (
    <div ref={rootRef} className={cls} style={style} aria-hidden="true">
      <div className="light-rays__layer" />
      <div className="light-rays__layer light-rays__layer--slow" />
    </div>
  );
}
