/* ===========================
   HAMBURGER MENU TOGGLE
=========================== */
(function () {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const navItems = navLinks ? navLinks.querySelectorAll('.nav-item') : [];

  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  // Close menu when a nav link is clicked (useful for single-page anchors)
  navItems.forEach((item) => {
    item.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
})();

/* ===========================
   IMAGE SLIDER LOGIC
=========================== */
(function () {
  const track = document.getElementById('sliderTrack');
  const slides = track.querySelectorAll('.slide');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  const TOTAL = slides.length;
  const AUTO_INTERVAL = 4000;   // ms between auto-advances
  const TRANSITION_MS = 600;    // must match CSS transition duration

  let current = 0;
  let autoTimer = null;
  let isAnimating = false;

  /* Move to a specific slide index */
  function goTo(index) {
    if (isAnimating) return;
    isAnimating = true;

    current = (index + TOTAL) % TOTAL;
    track.style.transform = `translateX(-${current * 100}%)`;

    setTimeout(() => { isAnimating = false; }, TRANSITION_MS);
  }

  /* Auto-play */
  function startAuto() {
    autoTimer = setInterval(() => goTo(current + 1), AUTO_INTERVAL);
  }

  function resetAuto() {
    clearInterval(autoTimer);
    startAuto();
  }

  /* Button listeners */
  prevBtn.addEventListener('click', () => {
    goTo(current - 1);
    resetAuto();
  });

  nextBtn.addEventListener('click', () => {
    goTo(current + 1);
    resetAuto();
  });

  /* Keyboard navigation */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { goTo(current - 1); resetAuto(); }
    if (e.key === 'ArrowRight') { goTo(current + 1); resetAuto(); }
  });

  /* Touch / swipe support */
  let touchStartX = 0;
  track.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? goTo(current + 1) : goTo(current - 1);
      resetAuto();
    }
  }, { passive: true });

  /* Kick off auto-play */
  startAuto();
})();
