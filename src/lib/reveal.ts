import type { Action } from "svelte/action";

interface RevealParams {
  y?: number;
  duration?: number;
  start?: string;
}

// Reveal action for Svelte that uses GSAP.
export const reveal: Action<HTMLElement, RevealParams | undefined> = (node, params = {}) => {
  let tween: gsap.core.Tween | undefined;

  // Dynamic import since GSAP is a client-side library
  (async () => {
    const { default: gsap } = await import("gsap");
    const { ScrollTrigger } = await import("gsap/ScrollTrigger");
    gsap.registerPlugin(ScrollTrigger);

    const { y = 40, duration = 0.6, start = "top 85%" } = params;

    tween = gsap.from(node, {
      opacity: 0,
      y,
      duration,
      ease: "power2.out",
      scrollTrigger: { trigger: node, start },
    });
  })();

  return {
    destroy() {
      tween?.scrollTrigger?.kill();
      tween?.kill();
    },
  };
};
