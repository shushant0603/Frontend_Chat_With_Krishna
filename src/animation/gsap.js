// gsap.js
import { gsap } from 'gsap';

export const animateHomeElements = () => {
  gsap.fromTo(
    '.left-image',
    { autoAlpha: 0, x: -250 },
    { autoAlpha: 1, x: 0, duration: 3.5, ease: 'power2.out' }
  );

  gsap.fromTo(
    '.right-image',
    { autoAlpha: 0, x: 250 },
    { autoAlpha: 1, x: 0, duration: 3.5, ease: 'power2.out' }
  );
};
