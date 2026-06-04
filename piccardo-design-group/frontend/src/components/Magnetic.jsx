import React, { useRef } from "react";

// Hover elegante: il bottone resta nella sua posizione e reagisce con un
// leggero ingrandimento + ombra al passaggio del cursore (niente "inseguimento").
function Magnetic({ children, style = {}, ...rest }) {
  const ref = useRef(null);

  const reduce =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const onEnter = () => {
    if (reduce || !ref.current) return;
    ref.current.style.transform = "scale(1.04)";
    ref.current.style.filter = "drop-shadow(0 6px 16px rgba(0,0,0,0.18))";
  };
  const onLeave = () => {
    if (!ref.current) return;
    ref.current.style.transform = "scale(1)";
    ref.current.style.filter = "none";
  };

  return (
    <span
      ref={ref}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{ display: "inline-block", transition: "transform 0.25s ease, filter 0.25s ease", ...style }}
      {...rest}
    >
      {children}
    </span>
  );
}

export default Magnetic;
