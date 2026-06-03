import React from "react";
import { useInView } from "react-intersection-observer";

// Avvolge i contenuti e li anima (fade + slide) quando entrano nella viewport
function Reveal({ children, delay = 0, as: Tag = "div", style = {}, ...rest }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 });
  return (
    <Tag
      ref={ref}
      className={`pdg-reveal ${inView ? "is-visible" : ""}`}
      style={{ transitionDelay: `${delay}ms`, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export default Reveal;
