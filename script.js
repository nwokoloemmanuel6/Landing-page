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

    // ── Trigger 2: Inactivity (35 seconds without movement/scrolling)
    var INACTIVITY_DELAY = 35000;
    var inactivityTimer;

    function resetInactivityTimer() {
      if (hasShown) return;
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(showPopup, INACTIVITY_DELAY);
    }

    ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart'].forEach(function (evt) {
      document.addEventListener(evt, resetInactivityTimer, { passive: true });
    });

    resetInactivityTimer(); // Start the timer

    // ── Trigger 3: Scroll Depth (70% of page)
    function checkScrollDepth() {
      if (hasShown) return;
      var scrollPos = window.scrollY || window.pageYOffset;
      var windowHeight = window.innerHeight || document.documentElement.clientHeight;
      var documentHeight = Math.max(
        document.body.scrollHeight, document.documentElement.scrollHeight,
        document.body.offsetHeight, document.documentElement.offsetHeight,
        document.body.clientHeight, document.documentElement.clientHeight
      );

      var scrollPercentage = (scrollPos + windowHeight) / documentHeight;
      if (scrollPercentage > 0.7) {
        showPopup();
        window.removeEventListener('scroll', checkScrollDepth);
      }
    }
    window.addEventListener('scroll', checkScrollDepth, { passive: true });

    // ── Close handlers
    function handleClose() {
      hidePopup();
      // As requested: if user closes it, don't show it again. (Session storage already handles this page load, 
      // but long term we could use localStorage if needed. Sticking to sessionStorage matches current behavior.)
    }

    closeBtn.addEventListener('click', handleClose);

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) handleClose();
    });

    ctaBtn.addEventListener('click', function () {
      handleClose();
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') handleClose();
    });
  }

  // ── Dynamic Hero Content ─────────────────────────────────
  function initDynamicHero() {
    const params = new URLSearchParams(window.location.search);
    const type = params.get('type');
    if (!type) return;

    const copies = {
      worker: {
        pre: "FOR WORKING PROFESSIONALS WHO DON’T HAVE TIME TO WASTE…",
        hook: "What If You Didn’t Need 6 Free Hours a Day to Break Into Cloud?",
        sub: "A structured, mentor-led 12-month path built for busy professionals — so you stay consistent without burnout."
      },
      tutorial: {
        pre: "FOR ASPIRING CLOUD ENGINEERS STUCK IN TUTORIAL MODE...",
        hook: "Still Learning Cloud… But Not Getting Paid For It?",
        sub: "Turn scattered tutorials into a structured path to build projects, get certified, and get hired."
      },
      burned: {
        pre: "FOR PEOPLE WHO’VE TRIED BEFORE AND DON’T WANT TO BE DISAPPOINTED AGAIN...",
        hook: "This Isn’t Another Course You Start and Quit.",
        sub: "A mentor-led system with built-in accountability — so you never get stuck or quit halfway."
      },
      watcher: {
        pre: "FOR THE ONES WHO’VE BEEN WATCHING FROM THE SIDELINES...",
        hook: "What If This Is The Year You Actually Finish?",
        sub: "A 12-month mentorship that turns beginners into certified, hireable cloud engineers."
      }
    };

    const content = copies[type];
    if (content) {
      const preEl = document.querySelector('.hero__pre-headline');
      const hookEl = document.querySelector('.hero__headline');
      const subEl = document.querySelector('.hero__subheadline');

      if (preEl) preEl.textContent = content.pre;
      if (hookEl) hookEl.textContent = content.hook;
      if (subEl) subEl.textContent = content.sub;
    }
  }

  // ── Init ────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', function () {
    initDynamicHero();
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

    // Initialize WhatsApp Redirect
    initWhatsAppRedirect();
  });

  function initWhatsAppRedirect() {
    var ctaButtons = document.querySelectorAll('.open-modal, a[href="#payment-modal"], .cta-pulse-btn, .btn--primary, a[href="#apply"]');
    var overlay = document.getElementById('whatsapp-redirect-overlay');

    // Replace with the actual WhatsApp number (include country code, omit the +)
    // E.g., '2348000000000'
    var whatsappNumber = '2349079778199';
    var preconfiguredMessage = "Hi Cloud Top G Admissions Team! I'm ready to start my application process for Cohort 2026. Please guide me through the admission process.";
    var encodedMessage = encodeURIComponent(preconfiguredMessage);
    var whatsappUrl = 'https://wa.me/' + whatsappNumber + '?text=' + encodedMessage;

    ctaButtons.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        if (overlay) {
          overlay.classList.add('active');

          setTimeout(function () {
            window.location.href = whatsappUrl;

            // Remove active state after returning to page (e.g. going back in browser)
            setTimeout(function () {
              overlay.classList.remove('active');
            }, 1000);
          }, 2000); // 2 second delay for the cool loading vibe
        } else {
          window.location.href = whatsappUrl;
        }
      });
    });
  }

})();
