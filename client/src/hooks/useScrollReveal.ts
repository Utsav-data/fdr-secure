import { useEffect } from 'react';

/**
 * High-End "Handmade" Reveal Hook
 * Uses native IntersectionObserver to animate elements with the `.scroll-reveal` class
 * when they enter the viewport, matching award-winning institutional websites.
 *
 * @param dependencies Optional reactive dependency array to re-attach observer upon DOM updates
 */
export function useScrollReveal(dependencies: React.DependencyList = []) {
  useEffect(() => {
    // Check for browser support
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      // Fallback: immediately show all elements if IntersectionObserver is unavailable
      const elements = document.querySelectorAll('.scroll-reveal');
      elements.forEach((el) => el.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Unobserve after revealing to maintain performance
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: '-40px',
      }
    );

    const elements = document.querySelectorAll('.scroll-reveal:not(.visible)');
    elements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, dependencies);
}

export default useScrollReveal;
