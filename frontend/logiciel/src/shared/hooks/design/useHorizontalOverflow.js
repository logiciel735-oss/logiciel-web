import { useEffect, useRef, useState } from "react";

const measure = (el) => el.scrollWidth > el.clientWidth;

export function useHorizontalOverflow(itemCount = 0) {
  const ref = useRef(null);
  const [hasOverflow, setHasOverflow] = useState(false);

  // Se vuelve a medir cuando cambia la cantidad de elementos.
  useEffect(() => {
    if (ref.current) setHasOverflow(measure(ref.current));
  }, [itemCount]);

  useEffect(() => {
    const onResize = () => {
      if (ref.current) setHasOverflow(measure(ref.current));
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return { ref, hasOverflow };
}
