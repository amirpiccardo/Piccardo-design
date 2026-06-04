import React, { useRef } from "react";

// Avvolge un elemento e lo fa "attrarre" leggermente verso il cursore al passaggio.
// Effetto premium da studio di design. Disattivato su touch / reduced-motion.
function Magnetic({ children, strength = 0.35, style = {}, ...rest }) {
  const ref = useRef(null);

  const reduce =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const onMove = (e) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    ref.current.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
  };

  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "translate(0, 0)";
  };

  return (
    <span
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ display: "inline-block", transition: "transform 0.25s cubic-bezier(0.22,1,0.36,1)", ...style }}
      {...rest}
    >
      {children}
    </span>
  );
}

export default Magnetic;
