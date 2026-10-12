import { useEffect, useRef, useState } from "react";

export function useHorizontalOverflow(deps = []) {
  const ref = useRef(null);
  const [hasOverflow, setHasOverflow] = useState(false);

  useEffect(() => {
    const checkOverflow = () => {
      const el = ref.current;
      if (!el) return;
      setHasOverflow(el.scrollWidth > el.clientWidth);
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);

    return () => window.removeEventListener("resize", checkOverflow);
  }, deps);

  return { ref, hasOverflow };
}
