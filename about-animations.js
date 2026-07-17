// js/about-animations.js - GSAP animations for premium About page

// Ensure GSAP and ScrollTrigger are loaded before this script
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  // Hero title animation
  gsap.from('.hero-title', {
    opacity: 0,
    y: -50,
    duration: 1.2,
    ease: 'power3.out'
  });

  // Hero subtitle and button
  gsap.from('.hero-subtitle, .cta-btn', {
    opacity: 0,
    y: 30,
    stagger: 0.2,
    duration: 0.9,
    ease: 'power3.out'
  });

  // Cards animations with scroll trigger
  gsap.utils.toArray('.card').forEach(card => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      opacity: 0,
      y: 40,
      duration: 0.8,
      ease: 'power2.out'
    });
  });

  // Timeline items animation
  gsap.utils.toArray('.timeline-item').forEach(item => {
    gsap.from(item, {
      scrollTrigger: {
        trigger: item,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      },
      opacity: 0,
      x: -60,
      duration: 0.9,
      ease: 'power2.out'
    });
  });

  // Team member fade
  gsap.utils.toArray('.member').forEach(member => {
    gsap.from(member, {
      scrollTrigger: {
        trigger: member,
        start: 'top 90%',
        toggleActions: 'play none none reverse'
      },
      opacity: 0,
      scale: 0.8,
      duration: 0.7,
      ease: 'back.out(1.7)'
    });
  });

  // CTA section bounce
  gsap.from('.cta-section', {
    scrollTrigger: {
      trigger: '.cta-section',
      start: 'top 80%'
    },
    opacity: 0,
    y: 30,
    duration: 1,
    ease: 'bounce.out'
  });
}
