/* ============================================================
   JOURNALISM PORTFOLIO — script.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Masthead date --------------------------------------- */
  const dateEl = document.getElementById('masthead-date');
  if (dateEl) {
    dateEl.textContent = new Date().toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  }

  /* ---- Sticky nav shadow ----------------------------------- */
  const nav       = document.getElementById('track-nav');
  const sentinel  = document.getElementById('nav-sentinel');

  if (nav && sentinel) {
    new IntersectionObserver(
      ([e]) => nav.classList.toggle('is-stuck', !e.isIntersecting),
      { threshold: 0 }
    ).observe(sentinel);
  }

  /* ---- Track nav: scroll to section ----------------------- */
  document.querySelectorAll('.track-btn, .footer-track-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const section = document.getElementById(btn.dataset.target);
      if (!section) return;
      const navH = nav ? nav.offsetHeight : 0;
      window.scrollTo({
        top: section.getBoundingClientRect().top + window.scrollY - navH - 16,
        behavior: 'smooth'
      });
    });
  });

  /* ---- Track nav: active state on scroll ------------------ */
  const trackSections = document.querySelectorAll('.track-section');
  const topTrackBtns  = document.querySelectorAll('.track-btn');

  new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          topTrackBtns.forEach(b =>
            b.classList.toggle('active', b.dataset.target === entry.target.id)
          );
        }
      });
    },
    { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
  ).observe !== undefined && (() => {
    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            topTrackBtns.forEach(b =>
              b.classList.toggle('active', b.dataset.target === entry.target.id)
            );
          }
        });
      },
      { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
    );
    trackSections.forEach(s => obs.observe(s));
  })();

  /* ---- Skill filter --------------------------------------- */
  const tagBtns    = document.querySelectorAll('.tag-btn');
  const clearBtn   = document.getElementById('filter-clear');
  const main       = document.getElementById('portfolio-main');
  const flatGrid   = document.getElementById('flat-grid');
  const flatEmpty  = document.getElementById('flat-empty');

  // Collect all project cards (pudding + stacked) in DOM order
  const allCards = Array.from(
    document.querySelectorAll('.project-card, .stacked-card')
  );

  let activeSkills = new Set();

  function applyFilter() {
    const filtering = activeSkills.size > 0;

    clearBtn.classList.toggle('visible', filtering);
    main.classList.toggle('is-filtered', filtering);
    flatGrid.classList.toggle('visible', false);
    flatEmpty.classList.toggle('visible', false);

    if (!filtering) {
      // Restore: move any cloned cards back, show all originals
      flatGrid.innerHTML = '';
      allCards.forEach(card => card.classList.remove('hidden'));
      return;
    }

    // Find matching cards
    const matches = allCards.filter(card => {
      const cardSkills = (card.dataset.skills || '')
        .split(',').map(s => s.trim());
      return [...activeSkills].every(skill => cardSkills.includes(skill));
    });

    // Populate flat grid with clones of matching cards
    flatGrid.innerHTML = '';
    matches.forEach(card => {
      flatGrid.appendChild(card.cloneNode(true));
    });

    if (matches.length === 0) {
      flatEmpty.classList.add('visible');
    } else {
      flatGrid.classList.add('visible');
    }
  }

  tagBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const skill = btn.dataset.skill;
      if (activeSkills.has(skill)) {
        activeSkills.delete(skill);
        btn.classList.remove('active');
      } else {
        activeSkills.add(skill);
        btn.classList.add('active');
      }
      applyFilter();
    });
  });

  clearBtn.addEventListener('click', () => {
    activeSkills.clear();
    tagBtns.forEach(b => b.classList.remove('active'));
    applyFilter();
  });

});
