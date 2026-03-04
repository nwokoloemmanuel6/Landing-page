/* ═══════════════════════════════════════════════════════════
   CLOUD TOP G — LANDING PAGE INTERACTIONS
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ── Accordion Toggle (Offer & Bonus cards) ──────────────
  function initAccordions() {
    const toggles = document.querySelectorAll('[data-toggle]');
    toggles.forEach(function (toggle) {
      toggle.addEventListener('click', function () {
        const card = toggle.closest('[data-system]');
        if (!card) return;
        card.classList.toggle('open');
      });
    });
  }

  // ── FAQ Accordion Toggle ─────────────────────────────────
  function initFaqAccordion() {
    const faqButtons = document.querySelectorAll('.faq-question');

    faqButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        const item = button.closest('.faq-item');
        const answer = item.querySelector('.faq-item__answer');
        if (!item || !answer) return;

        const isActive = item.classList.contains('active');

        // Close all other active FAQs first for a clean single-open experience
        document.querySelectorAll('.faq-item.active').forEach(function (activeItem) {
          if (activeItem !== item) {
            activeItem.classList.remove('active');
            const activeAnswer = activeItem.querySelector('.faq-item__answer');
            if (activeAnswer) {
              activeAnswer.style.maxHeight = null;
            }
          }
        });

        // Toggle current FAQ
        if (!isActive) {
          item.classList.add('active');
          answer.style.maxHeight = answer.scrollHeight + "px";
        } else {
          item.classList.remove('active');
          answer.style.maxHeight = null;
        }
      });
    });
  }

  // ── Scroll-triggered Fade In ────────────────────────────
  function initFadeIn() {
    const els = document.querySelectorAll('.fade-in');
    if (!els.length) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    els.forEach(function (el) {
      observer.observe(el);
    });
  }

  // ── Sticky Mobile CTA ──────────────────────────────────
  function initStickyCta() {
    var sticky = document.getElementById('stickyCta');
    if (!sticky) return;

    var hero = document.getElementById('hero');
    if (!hero) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            sticky.classList.remove('visible');
          } else {
            sticky.classList.add('visible');
          }
        });
      },
      { threshold: 0 }
    );

    observer.observe(hero);
  }

  // ── Smooth anchor scroll ────────────────────────────────
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var target = document.querySelector(link.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  // ── Exit-Intent + Timed Popup ────────────────────────────
  function initPopup() {
    var overlay = document.getElementById('popupOverlay');
    var closeBtn = document.getElementById('popupClose');
    var ctaBtn = document.getElementById('popupCta');
    if (!overlay) return;

    var POPUP_DELAY = 7000;       // 7 seconds for timed trigger
    var hasShown = false;

    // Skip if already shown this session
    if (sessionStorage.getItem('ctg_popup_shown')) return;

    function showPopup() {
      if (hasShown) return;
      hasShown = true;
      sessionStorage.setItem('ctg_popup_shown', '1');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function hidePopup() {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }

    // ── Trigger 1: Exit-Intent (desktop — mouse leaves viewport top)
    document.addEventListener('mouseout', function (e) {
      if (e.clientY <= 0) {
        showPopup();
      }
    });

    // ── Trigger 2: Timed fallback (mobile + slow readers)
    setTimeout(showPopup, POPUP_DELAY);

    // ── Close handlers
    closeBtn.addEventListener('click', hidePopup);

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) hidePopup();
    });

    ctaBtn.addEventListener('click', function () {
      hidePopup();
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') hidePopup();
    });
  }

  // ── Init ────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', function () {
    initAccordions();
    initFaqAccordion();
    initFadeIn();
    initStickyCta();
    initSmoothScroll();
    initPopup();

    // Inject live date into urgency banner
    var dateEl = document.getElementById('urgencyDate');
    if (dateEl) {
      var months = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
      var now = new Date();
      dateEl.textContent = months[now.getMonth()] + ' ' + now.getDate();
    }
  });
})();
