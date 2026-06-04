import React, { useRef, useEffect } from "react";

// Immagine con effetto parallax: scorre più lenta della pagina creando profondità.
function ParallaxImage({ src, alt, height = "clamp(320px, 60vh, 640px)", intensity = 0.18, style = {}, overlay = null, children }) {
  const wrapRef = useRef(null);
  const imgRef = useRef(null);

  useEffect(() => {
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    let raf = null;
    const update = () => {
      raf = null;
      const wrap = wrapRef.current;
      const img = imgRef.current;
      if (!wrap || !img) return;
      const r = wrap.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return; // fuori viewport
      const center = r.top + r.height / 2 - window.innerHeight / 2;
      img.style.transform = `translate3d(0, ${center * intensity}px, 0) scale(1.18)`;
    };
    const onScroll = () => {
      if (raf == null) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [intensity]);

  return (
    <div ref={wrapRef} style={{ position: "relative", width: "100%", height, overflow: "hidden", ...style }}>
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading="lazy"
        style={{ width: "100%", height: "100%", objectFit: "cover", willChange: "transform" }}
      />
      {overlay}
      {children}
    </div>
  );
}

export default ParallaxImage;
