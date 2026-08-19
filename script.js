/* =====================================================
   voidfx portfolio — interactions
   1. Smooth custom cursor with trailing follower
   2. Scroll-based reveal animations
   3. Scroll progress bar
   4. Pop-up modal for skill logos
===================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. Smooth cursor + trail ---------- */
  const cursor = document.getElementById('custom-cursor');
  const trail  = document.getElementById('cursor-trail');
  const isTouch = window.matchMedia('(pointer: coarse)').matches;

  if (cursor && trail && !isTouch) {
    let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
    let cursorX = mouseX, cursorY = mouseY;
    let trailX = mouseX, trailY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.opacity = '0.95';
      trail.style.opacity = '0.5';
    });

    // Smooth follow loop (lerp easing for buttery movement)
    function animateCursor() {
      cursorX += (mouseX - cursorX) * 0.35; // fast follower
      cursorY += (mouseY - cursorY) * 0.35;
      trailX  += (mouseX - trailX) * 0.12;  // slow trailing follower
      trailY  += (mouseY - trailY) * 0.12;

      cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;
      trail.style.transform  = `translate(${trailX}px, ${trailY}px) translate(-50%, -50%)`;

      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Grow cursor on interactive elements
    const hoverTargets = 'a, button, .skill-badge, .portfolio-item, .connect-btn, img';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(hoverTargets)) {
        cursor.classList.add('cursor-large');
        trail.classList.add('trail-large');
      }
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(hoverTargets)) {
        cursor.classList.remove('cursor-large');
        trail.classList.remove('trail-large');
      }
    });

    // Click ripple feedback
    document.addEventListener('mousedown', () => cursor.classList.add('cursor-click'));
    document.addEventListener('mouseup', () => cursor.classList.remove('cursor-click'));

    document.addEventListener('mouseleave', () => {
      cursor.style.opacity = '0';
      trail.style.opacity = '0';
    });
  } else if (cursor && trail) {
    cursor.style.display = 'none';
    trail.style.display = 'none';
  }

  /* ---------- 2. Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // slight stagger for elements revealing together (e.g. skill badges)
        entry.target.style.transitionDelay = `${(i % 6) * 60}ms`;
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------- 3. Scroll progress bar ---------- */
  const progressBar = document.getElementById('scroll-progress');
  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progressBar) progressBar.style.width = pct + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  /* ---------- 4. Skill logo pop-up modal ---------- */
  const skillBadges = document.querySelectorAll('.skill-badge');
  let modalEl = null;

  function openSkillModal(name, src) {
    closeSkillModal();
    modalEl = document.createElement('div');
    modalEl.className = 'logo-modal';
    modalEl.innerHTML = `
      <div class="card pop-in">
        <img src="${src}" alt="${name} logo">
        <h3>${name}</h3>
        <p>Part of my everyday editing & creative toolkit.</p>
        <button class="close">Close</button>
      </div>
    `;
    document.body.appendChild(modalEl);
    document.body.style.overflow = 'hidden';

    modalEl.addEventListener('click', (e) => {
      if (e.target === modalEl || e.target.classList.contains('close')) {
        closeSkillModal();
      }
    });
  }

  function closeSkillModal() {
    if (modalEl) {
      modalEl.remove();
      modalEl = null;
      document.body.style.overflow = '';
    }
  }

  skillBadges.forEach(badge => {
    badge.addEventListener('click', () => {
      const img = badge.querySelector('img');
      const name = badge.querySelector('span')?.textContent || 'Skill';
      // little pop kick on the badge itself
      badge.classList.remove('pop');
      void badge.offsetWidth; // restart animation
      badge.classList.add('pop');
      openSkillModal(name, img.src);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSkillModal();
  });

});
