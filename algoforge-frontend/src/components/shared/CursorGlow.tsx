import { useEffect, useRef } from "react";

export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let tx = 0, ty = 0, x = 0, y = 0;

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };
    window.addEventListener("mousemove", onMove);

    const loop = () => {
      x += (tx - x) * 0.12;
      y += (ty - y) * 0.12;
      if (el) el.style.transform = `translate3d(${x - 220}px, ${y - 220}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-0 hidden h-[440px] w-[440px] rounded-full opacity-[0.06] blur-[90px] lg:block"
      style={{
        background:
          "radial-gradient(circle, #FF7A3D 0%, #45D9C7 60%, transparent 75%)",
      }}
    />
  );
}
