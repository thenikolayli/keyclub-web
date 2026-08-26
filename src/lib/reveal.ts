import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import type { Action } from "svelte/action";

gsap.registerPlugin(ScrollTrigger);

interface RevealParams {
  y?: number;
  duration?: number;
  start?: string;
}

export const reveal: Action<HTMLElement, RevealParams | undefined> = (node, params = {}) => {
  const { y = 40, duration = 0.6, start = "top 85%" } = params;

  const tween = gsap.from(node, {
    opacity: 0,
    y,
    duration,
    ease: "power2.out",
    scrollTrigger: { trigger: node, start },
  });

  return {
    update() {
      tween.scrollTrigger?.kill();
      tween.kill();
    },
    destroy() {
      tween.scrollTrigger?.kill();
      tween.kill();
    },
  };
};
