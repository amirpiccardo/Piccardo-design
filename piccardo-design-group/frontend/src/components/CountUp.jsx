import React, { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";

// Anima un numero da 0 al valore target quando entra nella viewport.
// Supporta suffissi/prefissi (es. "30+", "100%").
function CountUp({ value, duration = 1600 }) {
  const match = String(value).match(/^(\D*)(\d+)(\D*)$/);
  const prefix = match ? match[1] : "";
  const target = match ? parseInt(match[2], 10) : 0;
  const suffix = match ? match[3] : String(value);

  const [display, setDisplay] = useState(0);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.4 });
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      setDisplay(Math.round(eased * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, target, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

export default CountUp;
