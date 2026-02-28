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
   IMAGE SLIDER — INFINITE RIGHT-ONLY LOOP
=========================== */
(function () {
  const track = document.getElementById('sliderTrack');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  if (!track || !prevBtn || !nextBtn) return;

  const TRANSITION_MS = 600;   // must match CSS transition duration
  const AUTO_INTERVAL = 4000;  // ms between auto-advances

  /* ---- Build infinite clone strip ----
     Layout: [clone of last] [slide0] [slide1] [slide2] [clone of first]
     We start at visual index 1 (the real slide0).             */
  const realSlides = Array.from(track.querySelectorAll('.slide'));
  const TOTAL = realSlides.length;

  // Prepend clone of last slide
  const cloneFirst = realSlides[0].cloneNode(true);
  const cloneLast = realSlides[TOTAL - 1].cloneNode(true);
  track.insertBefore(cloneLast, track.firstChild);
  track.appendChild(cloneFirst);

  // All slides now (including clones)
  const allSlides = track.querySelectorAll('.slide');

  // current = index into allSlides; starts at 1 (first real slide)
  let current = 1;
  let isAnimating = false;
  let autoTimer = null;

  /* Immediately jump (no transition) to a position */
  function jumpTo(index) {
    track.style.transition = 'none';
    track.style.transform = `translateX(-${index * 100}%)`;
    current = index;
    // Force reflow so the instant jump takes effect before next transition
    track.getBoundingClientRect();
  }

  /* Animated move */
  function slideTo(index) {
    if (isAnimating) return;
    isAnimating = true;

    track.style.transition = `transform ${TRANSITION_MS}ms cubic-bezier(0.77,0,0.18,1)`;
    track.style.transform = `translateX(-${index * 100}%)`;
    current = index;
  }

  /* After each transition ends, silently jump if we hit a clone */
  track.addEventListener('transitionend', () => {
    isAnimating = false;

    if (current === 0) {
      // We slid to the cloneLast — jump to the real last slide
      jumpTo(TOTAL);
    } else if (current === TOTAL + 1) {
      // We slid to the cloneFirst — jump to the real first slide
      jumpTo(1);
    }
  });

  /* Advance right */
  function next() { slideTo(current + 1); }
  /* Go left */
  function prev() { slideTo(current - 1); }

  /* Auto-play (always right) */
  function startAuto() { autoTimer = setInterval(next, AUTO_INTERVAL); }
  function resetAuto() { clearInterval(autoTimer); startAuto(); }

  /* Initialise position (no animation) */
  jumpTo(1);

  /* Button listeners */
  nextBtn.addEventListener('click', () => { next(); resetAuto(); });
  prevBtn.addEventListener('click', () => { prev(); resetAuto(); });

  /* Keyboard */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { next(); resetAuto(); }
    if (e.key === 'ArrowLeft') { prev(); resetAuto(); }
  });

  /* Touch / swipe */
  let touchStartX = 0;
  track.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? next() : prev();
      resetAuto();
    }
  }, { passive: true });

  /* Kick off */
  startAuto();
})();

