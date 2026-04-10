import { useRef, useCallback, useState, useEffect } from 'react';

function parseHSL(hslStr) {
  const match = hslStr.match(/([\d.]+)\s*([\d.]+)%?\s*([\d.]+)%?/);
  if (!match) return { h: 40, s: 80, l: 80 };
  return { h: parseFloat(match[1]), s: parseFloat(match[2]), l: parseFloat(match[3]) };
}

function buildBoxShadow(glowColor, intensity) {
  const { h, s, l } = parseHSL(glowColor);
  const base = `${h}deg ${s}% ${l}%`;
  const layers = [
    [0, 0, 0, 1, 100, true], [0, 0, 1, 0, 60, true], [0, 0, 3, 0, 50, true],
    [0, 0, 6, 0, 40, true], [0, 0, 15, 0, 30, true], [0, 0, 25, 2, 20, true],
    [0, 0, 50, 2, 10, true],
    [0, 0, 1, 0, 60, false], [0, 0, 3, 0, 50, false], [0, 0, 6, 0, 40, false],
    [0, 0, 15, 0, 30, false], [0, 0, 25, 2, 20, false], [0, 0, 50, 2, 10, false],
  ];
  return layers.map(([x, y, blur, spread, alpha, inset]) => {
    const a = Math.min(alpha * intensity, 100);
    return `${inset ? 'inset ' : ''}${x}px ${y}px ${blur}px ${spread}px hsl(${base} / ${a}%)`;
  }).join(', ');
}

function easeOutCubic(x) { return 1 - Math.pow(1 - x, 3); }
function easeInCubic(x) { return x * x * x; }

const GRADIENT_POSITIONS = ['80% 55%', '69% 34%', '8% 6%', '41% 38%', '86% 85%', '82% 18%', '51% 4%'];
const COLOR_MAP = [0, 1, 2, 0, 1, 2, 1];

function buildMeshGradients(colors) {
  const gradients = [];
  for (let i = 0; i < 7; i++) {
    const c = colors[Math.min(COLOR_MAP[i], colors.length - 1)];
    gradients.push(`radial-gradient(at ${GRADIENT_POSITIONS[i]}, ${c} 0px, transparent 50%)`);
  }
  gradients.push(`linear-gradient(${colors[0]} 0 100%)`);
  return gradients;
}

/**
 * Applies computed glow styles directly to DOM elements (no React re-renders).
 */
function applyGlowStyles({ borderRef, fillRef, outerRef, angleDeg, borderOpacity, glowOpacity, fillOpacity, coneSpread, isVisible }) {
  const transition = isVisible ? 'opacity 0.25s ease-out' : 'opacity 0.75s ease-in-out';
  const borderMask = `conic-gradient(from ${angleDeg} at center, black ${coneSpread}%, transparent ${coneSpread + 15}%, transparent ${100 - coneSpread - 15}%, black ${100 - coneSpread}%)`;
  const fillCone = `conic-gradient(from ${angleDeg} at center, transparent 5%, black 15%, black 85%, transparent 95%)`;
  const outerMask = `conic-gradient(from ${angleDeg} at center, black 2.5%, transparent 10%, transparent 90%, black 97.5%)`;

  if (borderRef.current) {
    const s = borderRef.current.style;
    s.opacity = borderOpacity;
    s.maskImage = borderMask;
    s.webkitMaskImage = borderMask;
    s.transition = transition;
  }
  if (fillRef.current) {
    const s = fillRef.current.style;
    const fillMask = [
      'linear-gradient(to bottom, black, black)',
      'radial-gradient(ellipse at 50% 50%, black 40%, transparent 65%)',
      'radial-gradient(ellipse at 66% 66%, black 5%, transparent 40%)',
      'radial-gradient(ellipse at 33% 33%, black 5%, transparent 40%)',
      'radial-gradient(ellipse at 66% 33%, black 5%, transparent 40%)',
      'radial-gradient(ellipse at 33% 66%, black 5%, transparent 40%)',
      fillCone,
    ].join(', ');
    s.opacity = borderOpacity * fillOpacity;
    s.maskImage = fillMask;
    s.webkitMaskImage = fillMask;
    s.transition = transition;
  }
  if (outerRef.current) {
    const s = outerRef.current.style;
    s.opacity = glowOpacity;
    s.maskImage = outerMask;
    s.webkitMaskImage = outerMask;
    s.transition = transition;
  }
}

const BorderGlow = ({
  children,
  className = '',
  edgeSensitivity = 30,
  glowColor = '40 80 80',
  backgroundColor = '#060010',
  borderRadius = 28,
  glowRadius = 40,
  glowIntensity = 1.0,
  coneSpread = 25,
  animated = false,
  colors = ['#c084fc', '#f472b6', '#38bdf8'],
  fillOpacity = 0.5,
}) => {
  const cardRef = useRef(null);
  const borderRef = useRef(null);
  const fillRef = useRef(null);
  const outerRef = useRef(null);

  // Use refs for animation values instead of state to avoid re-renders
  const angleRef = useRef(45);
  const proximityRef = useRef(0);
  const isVisibleRef = useRef(false);

  const [isHovered, setIsHovered] = useState(false);

  const colorSensitivity = edgeSensitivity + 20;

  const computeAndApply = useCallback((angle, proximity, visible) => {
    const bOp = visible
      ? Math.max(0, (proximity * 100 - colorSensitivity) / (100 - colorSensitivity))
      : 0;
    const gOp = visible
      ? Math.max(0, (proximity * 100 - edgeSensitivity) / (100 - edgeSensitivity))
      : 0;
    applyGlowStyles({
      borderRef, fillRef, outerRef,
      angleDeg: `${angle.toFixed(3)}deg`,
      borderOpacity: bOp,
      glowOpacity: gOp,
      fillOpacity,
      coneSpread,
      isVisible: visible,
    });
  }, [colorSensitivity, edgeSensitivity, fillOpacity, coneSpread]);

  const getCenterOfElement = useCallback((el) => {
    const { width, height } = el.getBoundingClientRect();
    return [width / 2, height / 2];
  }, []);

  const handlePointerMove = useCallback((e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const [cx, cy] = getCenterOfElement(card);

    // Edge proximity
    const dx = x - cx;
    const dy = y - cy;
    let kx = Infinity, ky = Infinity;
    if (dx !== 0) kx = cx / Math.abs(dx);
    if (dy !== 0) ky = cy / Math.abs(dy);
    const proximity = Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);

    // Cursor angle
    const radians = Math.atan2(dy, dx);
    let degrees = radians * (180 / Math.PI) + 90;
    if (degrees < 0) degrees += 360;

    angleRef.current = degrees;
    proximityRef.current = proximity;
    computeAndApply(degrees, proximity, true);
  }, [getCenterOfElement, computeAndApply]);

  const handlePointerEnter = useCallback(() => {
    setIsHovered(true);
    isVisibleRef.current = true;
  }, []);

  const handlePointerLeave = useCallback(() => {
    setIsHovered(false);
    isVisibleRef.current = false;
    // Fade out
    computeAndApply(angleRef.current, proximityRef.current, false);
  }, [computeAndApply]);

  // Intro animation — runs entirely via refs + RAF, zero React re-renders
  useEffect(() => {
    if (!animated) return;

    const angleStart = 110;
    const angleEnd = 465;
    const totalDuration = 4000; // ms
    let angle = angleStart;
    let proximity = 0;
    let startTime = null;
    let rafId;

    function tick(now) {
      if (!startTime) startTime = now;
      const elapsed = now - startTime;

      // Phase 1: 0-500ms — fade in proximity
      if (elapsed < 500) {
        proximity = easeOutCubic(elapsed / 500);
      }
      // Phase 2: 0-1500ms — slow angle sweep (first half)
      if (elapsed < 1500) {
        const t = easeInCubic(Math.min(elapsed / 1500, 1));
        angle = angleStart + (angleEnd - angleStart) * (t * 0.5);
      }
      // Phase 3: 1500-3750ms — fast angle sweep (second half)
      else if (elapsed < 3750) {
        const t2 = easeOutCubic((elapsed - 1500) / 2250);
        angle = angleStart + (angleEnd - angleStart) * (0.5 + t2 * 0.5);
      }
      // Phase 4: 2500-4000ms — fade out proximity
      if (elapsed >= 2500 && elapsed < totalDuration) {
        proximity = easeInCubic(1 - (elapsed - 2500) / 1500);
      }
      if (elapsed >= totalDuration) {
        proximity = 0;
        computeAndApply(angle, 0, false);
        return; // done
      }

      angleRef.current = angle;
      proximityRef.current = proximity;
      computeAndApply(angle, proximity, true);
      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => { if (rafId) cancelAnimationFrame(rafId); };
  }, [animated, computeAndApply]);

  // Pre-compute static values
  const meshGradients = buildMeshGradients(colors);
  const borderBg = meshGradients.map(g => `${g} border-box`);
  const fillBg = meshGradients.map(g => `${g} padding-box`);
  const boxShadowStr = buildBoxShadow(glowColor, glowIntensity);

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      className={`relative grid isolate border border-white/15 ${className}`}
      style={{
        background: backgroundColor,
        borderRadius: `${borderRadius}px`,
        transform: 'translate3d(0, 0, 0.01px)',
        willChange: 'auto',
        boxShadow: 'rgba(0,0,0,0.1) 0 1px 2px, rgba(0,0,0,0.1) 0 2px 4px, rgba(0,0,0,0.1) 0 4px 8px, rgba(0,0,0,0.1) 0 8px 16px, rgba(0,0,0,0.1) 0 16px 32px, rgba(0,0,0,0.1) 0 32px 64px',
      }}
    >
      {/* mesh gradient border */}
      <div
        ref={borderRef}
        className="absolute inset-0 rounded-[inherit] -z-[1]"
        style={{
          border: '1px solid transparent',
          background: [
            `linear-gradient(${backgroundColor} 0 100%) padding-box`,
            'linear-gradient(rgb(255 255 255 / 0%) 0% 100%) border-box',
            ...borderBg,
          ].join(', '),
          opacity: 0,
        }}
      />

      {/* mesh gradient fill near edges */}
      <div
        ref={fillRef}
        className="absolute inset-0 rounded-[inherit] -z-[1]"
        style={{
          border: '1px solid transparent',
          background: fillBg.join(', '),
          maskComposite: 'subtract, add, add, add, add, add',
          WebkitMaskComposite: 'source-out, source-over, source-over, source-over, source-over, source-over',
          opacity: 0,
          mixBlendMode: 'soft-light',
        }}
      />

      {/* outer glow */}
      <span
        ref={outerRef}
        className="absolute pointer-events-none z-[1] rounded-[inherit]"
        style={{
          inset: `${-glowRadius}px`,
          opacity: 0,
          mixBlendMode: 'plus-lighter',
        }}
      >
        <span
          className="absolute rounded-[inherit]"
          style={{
            inset: `${glowRadius}px`,
            boxShadow: boxShadowStr,
          }}
        />
      </span>

      <div className="flex flex-col relative overflow-visible z-[1] dark text-white" style={{ colorScheme: 'dark' }}>
        {children}
      </div>
    </div>
  );
};

export default BorderGlow;
