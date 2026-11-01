import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({ children }) {
  useEffect(() => {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    const lenis = new Lenis({
      duration: isTouch ? 0.9 : 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.0, // 1:1 natural touch feel without rubber-banding or jerkiness
    });

    lenis.on('scroll', ScrollTrigger.update);

    const updateTicker = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    // Smooth frame variance absorption (500ms threshold, 33ms lag recovery)
    gsap.ticker.lagSmoothing(500, 33);

    window.__lenis = lenis;

    const params = new URLSearchParams(window.location.search);
    const initialScroll = params.get('scroll');
    if (initialScroll) {
      setTimeout(() => {
        lenis.scrollTo(parseFloat(initialScroll), { immediate: true });
      }, 400);
    }

    return () => {
      window.__lenis = null;
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}

