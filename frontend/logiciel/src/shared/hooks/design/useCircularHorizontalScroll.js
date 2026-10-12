import { useHorizontalOverflow } from "./useHorizontalOverflow";

export function useCircularHorizontalScroll(deps = [], step = 300) {
  const { ref, hasOverflow } = useHorizontalOverflow(deps);

  const scrollRight = () => {
    const el = ref.current;
    if (!el) return;

    const atEnd =
      el.scrollLeft + el.clientWidth >= el.scrollWidth - 5;

    if (atEnd) {
      el.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      el.scrollBy({ left: step, behavior: "smooth" });
    }
  };

  const scrollLeft = () => {
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
  };

  return {
    ref,
    hasOverflow,
    scrollLeft,
    scrollRight
  };
}
