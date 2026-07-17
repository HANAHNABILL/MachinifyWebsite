// js/about.js - Initialize particle background and scroll-reveal animations
// Ensure shared particle system is loaded before this script.

document.addEventListener('DOMContentLoaded', function () {
  // Initialize particle canvas for About page
  if (document.getElementById('aboutParticleCanvas')) {
    initParticleCanvas('aboutParticleCanvas');
  }

  // Scroll-reveal using IntersectionObserver
  const revealElements = document.querySelectorAll('.reveal');
  const observerOptions = {
    threshold: 0.1
  };
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });
});
