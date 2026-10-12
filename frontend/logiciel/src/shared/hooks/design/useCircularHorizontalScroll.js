import { useCallback } from "react";
import { useHorizontalOverflow } from "./useHorizontalOverflow";

export function useCircularHorizontalScroll(itemCount = 0, step = 300) {
  const { ref, hasOverflow } = useHorizontalOverflow(itemCount);

  const scrollRight = useCallback(() => {
    const el = ref.current;
    if (!el) return;

    const atEnd =
      el.scrollLeft + el.clientWidth >= el.scrollWidth - 5;

    if (atEnd) {
      el.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      el.scrollBy({ left: step, behavior: "smooth" });
    }
  }, [ref, step]);

  const scrollLeft = useCallback(() => {
    const el = ref.current;
    if (!el) return;

    const atStart = el.scrollLeft <= 0;

    if (atStart) {
      el.scrollTo({
        left: el.scrollWidth,
        behavior: "smooth"
      });
    } else {
      el.scrollBy({ left: -step, behavior: "smooth" });
    }
  }, [ref, step]);

  return {
    ref,
    hasOverflow,
    scrollLeft,
    scrollRight
  };
}
