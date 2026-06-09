/* ============================================================
   TRANSFORMATION HQ — MAIN JS
   ============================================================ */

'use strict';

/* ---- Navbar scroll behaviour ---- */
(function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const onScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Active link highlight */
  const path = window.location.pathname.split('/').pop() || 'home.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href && href === path) {
      link.classList.add('active');
    }
  });
})();

/* ---- Mobile nav toggle ---- */
(function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const mobileNav = document.querySelector('.nav-mobile');
  if (!toggle || !mobileNav) return;

  toggle.addEventListener('click', () => {
    const isOpen = toggle.classList.toggle('open');
    mobileNav.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('open');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
})();

/* ---- Scroll progress bar ---- */
(function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;

  const updateProgress = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = pct + '%';
  };

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
})();

/* ---- Back to top button ---- */
(function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ---- Scroll-reveal (IntersectionObserver) ---- */
(function initReveal() {
  const classes = ['.reveal', '.reveal-left', '.reveal-right', '.reveal-scale'];
  const els = document.querySelectorAll(classes.join(', '));
  if (!els.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  els.forEach(el => observer.observe(el));
})();

/* ---- Animated counter ---- */
function animateCounter(el) {
  const target = parseInt(el.dataset.target || el.textContent, 10);
  const duration = 1800;
  const start = performance.now();

  const update = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(update);
  };

  requestAnimationFrame(update);
}

(function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(c => observer.observe(c));
})();

/* ---- FAQ accordion ---- */
(function initFAQ() {
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');

      /* Close all */
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));

      /* Open clicked if it was closed */
      if (!isOpen) item.classList.add('open');
    });
  });
})();

/* ---- Filter tabs ---- */
(function initFilterTabs() {
  document.querySelectorAll('.filter-tabs').forEach(tabGroup => {
    tabGroup.querySelectorAll('.filter-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        tabGroup.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const filter = tab.dataset.filter;
        const grid = tabGroup.nextElementSibling;
        if (!grid) return;

        grid.querySelectorAll('[data-category]').forEach(item => {
          if (filter === 'all' || item.dataset.category === filter) {
            item.style.display = '';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  });
})();

/* ---- Trainer modal ---- */
(function initTrainerModal() {
  const overlay = document.getElementById('trainer-modal-overlay');
  if (!overlay) return;

  const modalName = overlay.querySelector('#modal-trainer-name');
  const modalSpec = overlay.querySelector('#modal-trainer-specialty');
  const modalBio  = overlay.querySelector('#modal-trainer-bio');
  const modalTags = overlay.querySelector('#modal-trainer-tags');
  const closeBtn  = overlay.querySelector('.modal-close');

  document.querySelectorAll('.trainer-card[data-trainer]').forEach(card => {
    card.addEventListener('click', () => {
      const data = JSON.parse(card.dataset.trainer);
      if (modalName) modalName.textContent = data.name;
      if (modalSpec) modalSpec.textContent = data.specialty;
      if (modalBio)  modalBio.textContent  = data.bio;
      if (modalTags && data.tags) {
        modalTags.innerHTML = data.tags.map(t =>
          `<span class="trainer-tag">${t}</span>`
        ).join('');
      }
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  const close = () => {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();

/* ---- Testimonial auto-slider ---- */
(function initTestimonialSlider() {
  const slider = document.querySelector('.testimonial-slider');
  if (!slider) return;

  const slides = slider.querySelectorAll('.testimonial-slide');
  const dots   = document.querySelectorAll('.slider-dot');
  let current  = 0;
  let timer;

  const goTo = (idx) => {
    slides.forEach((s, i) => s.classList.toggle('active', i === idx));
    dots.forEach((d, i) => d.classList.toggle('active', i === idx));
    current = idx;
  };

  const next = () => goTo((current + 1) % slides.length);

  const startTimer = () => { timer = setInterval(next, 5000); };
  const stopTimer  = () => clearInterval(timer);

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { stopTimer(); goTo(i); startTimer(); });
  });

  if (slides.length) { goTo(0); startTimer(); }

  slider.addEventListener('mouseenter', stopTimer);
  slider.addEventListener('mouseleave', startTimer);
})();

/* ---- Newsletter form ---- */
(function initNewsletterForms() {
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const input = form.querySelector('.newsletter-input');
      const btn   = form.querySelector('.newsletter-btn');
      if (!input || !input.value.trim()) return;

      const orig = btn.innerHTML;
      btn.innerHTML = '✓';
      btn.style.background = '#22c55e';
      input.value = '';

      setTimeout(() => {
        btn.innerHTML = orig;
        btn.style.background = '';
      }, 3000);
    });
  });
})();

/* ---- Blog search ---- */
(function initBlogSearch() {
  const searchInput = document.querySelector('.search-input[data-blog-search]');
  if (!searchInput) return;

  searchInput.addEventListener('input', () => {
    const q = searchInput.value.toLowerCase().trim();
    document.querySelectorAll('.blog-card').forEach(card => {
      const title = card.querySelector('.blog-title')?.textContent.toLowerCase() || '';
      const excerpt = card.querySelector('.blog-excerpt')?.textContent.toLowerCase() || '';
      card.style.display = (title.includes(q) || excerpt.includes(q) || !q) ? '' : 'none';
    });
  });
})();

/* ---- Smooth page links ---- */
(function initSmoothLinks() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();

/* ---- Page load animation ---- */
(function initPageLoad() {
  document.body.style.opacity = '0';
  document.body.style.transform = 'translateY(10px)';
  document.body.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

  window.addEventListener('load', () => {
    requestAnimationFrame(() => {
      document.body.style.opacity = '1';
      document.body.style.transform = 'translateY(0)';
    });
  });
})();
/* ============================================================
   TRANSFORMATION HQ — FORM VALIDATION
   ============================================================ */

'use strict';

/* ---- Validators ---- */
const validators = {
  required: (val) => val.trim().length > 0,
  email:    (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim()),
  phone:    (val) => /^[\d\s\+\-\(\)]{8,15}$/.test(val.trim()),
  age:      (val) => {
    const n = parseInt(val, 10);
    return !isNaN(n) && n >= 10 && n <= 80;
  },
  minLength: (min) => (val) => val.trim().length >= min,
};

/* ---- Show/clear field error ---- */
function showError(field, message) {
  field.classList.add('error');
  field.classList.remove('success');

  let errEl = field.parentElement.querySelector('.field-error');
  if (!errEl) {
    errEl = document.createElement('span');
    errEl.className = 'field-error';
    field.parentElement.appendChild(errEl);
  }
  errEl.textContent = message;
}

function clearError(field) {
  field.classList.remove('error');
  field.classList.add('success');
  const errEl = field.parentElement.querySelector('.field-error');
  if (errEl) errEl.remove();
}

/* ---- Validate a single field ---- */
function validateField(field) {
  const rules = field.dataset.validate ? field.dataset.validate.split('|') : [];
  const value = field.value;
  let valid = true;

  for (const rule of rules) {
    if (rule === 'required' && !validators.required(value)) {
      showError(field, 'This field is required.');
      valid = false;
      break;
    }
    if (rule === 'email' && value && !validators.email(value)) {
      showError(field, 'Please enter a valid email address.');
      valid = false;
      break;
    }
    if (rule === 'phone' && value && !validators.phone(value)) {
      showError(field, 'Please enter a valid phone number.');
      valid = false;
      break;
    }
    if (rule === 'age' && value && !validators.age(value)) {
      showError(field, 'Please enter an age between 10 and 80.');
      valid = false;
      break;
    }
    if (rule.startsWith('min:')) {
      const min = parseInt(rule.split(':')[1], 10);
      if (value && !validators.minLength(min)(value)) {
        showError(field, `Minimum ${min} characters required.`);
        valid = false;
        break;
      }
    }
  }

  if (valid && rules.length) clearError(field);
  return valid;
}

/* ---- Initialise form validation ---- */
function initFormValidation(form) {
  const fields = form.querySelectorAll('[data-validate]');
  const submitBtn = form.querySelector('[type="submit"]');

  /* Live validation on blur */
  fields.forEach(field => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.classList.contains('error')) validateField(field);
    });
  });

  /* Submit handler */
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let allValid = true;

    fields.forEach(field => {
      if (!validateField(field)) allValid = false;
    });

    if (!allValid) {
      const firstError = form.querySelector('.error');
      if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    /* Simulate submit */
    if (submitBtn) {
      const origText = submitBtn.textContent;
      submitBtn.textContent = 'Sending…';
      submitBtn.disabled = true;

      setTimeout(() => {
        handleFormSuccess(form, submitBtn, origText);
      }, 1500);
    }
  });
}

/* ---- Success state ---- */
function handleFormSuccess(form, btn, origText) {
  const successDiv = form.parentElement.querySelector('.success-screen');
  if (successDiv) {
    form.style.display = 'none';
    successDiv.style.display = 'block';
  } else {
    btn.textContent = '✓ Submitted!';
    btn.style.background = '#22c55e';
    btn.style.color = '#fff';

    setTimeout(() => {
      btn.textContent = origText;
      btn.style.background = '';
      btn.style.color = '';
      btn.disabled = false;
      form.reset();
      form.querySelectorAll('.success').forEach(f => f.classList.remove('success'));
    }, 4000);
  }
}

/* ---- Auto-init all validated forms ---- */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('form[data-validate-form]').forEach(initFormValidation);
});

/* ---- Inject validation styles ---- */
(function injectValidationStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .form-input.error,
    .form-select.error,
    .form-textarea.error {
      border-color: #ef4444;
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }
    .form-input.success,
    .form-select.success,
    .form-textarea.success {
      border-color: #22c55e;
    }
    .field-error {
      display: block;
      font-size: 0.75rem;
      color: #ef4444;
      margin-top: 4px;
      font-weight: 500;
    }
    .success-screen {
      display: none;
    }
  `;
  document.head.appendChild(style);
})();
/* ============================================================
   TRANSFORMATION HQ — GALLERY JS
   ============================================================ */

'use strict';

/* ---- Lightbox ---- */
(function initLightbox() {
  const overlay = document.getElementById('lightbox-overlay');
  if (!overlay) return;

  const img    = overlay.querySelector('#lightbox-img');
  const caption = overlay.querySelector('#lightbox-caption');
  const closeBtn = overlay.querySelector('#lightbox-close');
  const prevBtn  = overlay.querySelector('#lightbox-prev');
  const nextBtn  = overlay.querySelector('#lightbox-next');

  let items = [];
  let current = 0;

  function openLightbox(idx) {
    current = idx;
    const item = items[current];
    if (!item) return;

    if (img) {
      img.style.fontSize = '4rem';
      img.textContent = item.emoji || '🏋️';
    }
    if (caption) caption.textContent = item.caption || '';
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  function prevItem() {
    openLightbox((current - 1 + items.length) % items.length);
  }

  function nextItem() {
    openLightbox((current + 1) % items.length);
  }

  document.querySelectorAll('[data-lightbox]').forEach((el, i) => {
    items.push({
      emoji: el.dataset.emoji || '🏋️',
      caption: el.dataset.caption || ''
    });

    el.addEventListener('click', () => openLightbox(i));
    el.style.cursor = 'pointer';
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (prevBtn)  prevBtn.addEventListener('click', prevItem);
  if (nextBtn)  nextBtn.addEventListener('click', nextItem);

  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeLightbox();
  });

  document.addEventListener('keydown', e => {
    if (!overlay.classList.contains('open')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  prevItem();
    if (e.key === 'ArrowRight') nextItem();
  });
})();

/* ---- Gallery masonry / lazy ---- */
(function initGallery() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  if (!galleryItems.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('revealed');
          }, i * 80);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.05, rootMargin: '100px' }
  );

  galleryItems.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'scale(0.9)';
    item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(item);
  });

  /* Handle revealed state */
  const style = document.createElement('style');
  style.textContent = `
    .gallery-item.revealed {
      opacity: 1 !important;
      transform: scale(1) !important;
    }
  `;
  document.head.appendChild(style);
})();

/* ---- Video iframe lazy load ---- */
(function initVideoThumbnails() {
  document.querySelectorAll('.video-thumb-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const container = btn.closest('.video-container');
      if (!container) return;

      const url = btn.dataset.src;
      if (!url) return;

      const iframe = document.createElement('iframe');
      iframe.src = url;
      iframe.width = '100%';
      iframe.height = '100%';
      iframe.style.border = 'none';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen = true;

      container.innerHTML = '';
      container.appendChild(iframe);
    });
  });
})();

/* ---- Before/After slider ---- */
(function initBeforeAfterSliders() {
  document.querySelectorAll('.ba-slider').forEach(slider => {
    const handle = slider.querySelector('.ba-handle');
    if (!handle) return;

    let dragging = false;

    const move = (x) => {
      const rect = slider.getBoundingClientRect();
      const pos = Math.min(Math.max(0, x - rect.left), rect.width);
      const pct = (pos / rect.width) * 100;
      slider.style.setProperty('--ba-pos', pct + '%');
      handle.style.left = pct + '%';
    };

    handle.addEventListener('mousedown', () => { dragging = true; });
    handle.addEventListener('touchstart', () => { dragging = true; }, { passive: true });

    document.addEventListener('mouseup',   () => { dragging = false; });
    document.addEventListener('touchend',  () => { dragging = false; });

    document.addEventListener('mousemove', (e) => { if (dragging) move(e.clientX); });
    document.addEventListener('touchmove', (e) => {
      if (dragging) move(e.touches[0].clientX);
    }, { passive: true });
  });
})();

/* ============================================================
   TRANSFORMATION HQ — ANIMATIONS JS
   ============================================================ */

'use strict';

/* ---- Parallax on scroll ---- */
(function initParallax() {
  const parallaxEls = document.querySelectorAll('[data-parallax]');
  if (!parallaxEls.length) return;

  const onScroll = () => {
    parallaxEls.forEach(el => {
      const speed  = parseFloat(el.dataset.parallax) || 0.3;
      const rect   = el.getBoundingClientRect();
      const center = rect.top + rect.height / 2 - window.innerHeight / 2;
      const offset = center * speed;
      el.style.transform = `translateY(${offset}px)`;
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ---- Cursor glow (desktop only) ---- */
(function initCursorGlow() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const cursor = document.createElement('div');
  cursor.id = 'cursor-glow';
  cursor.style.cssText = `
    position: fixed;
    width: 400px;
    height: 400px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255,208,0,0.04) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
    transform: translate(-50%, -50%);
    transition: opacity 0.3s ease;
    top: 0;
    left: 0;
  `;
  document.body.appendChild(cursor);

  let mouseX = -9999, mouseY = -9999;
  let curX = -9999, curY = -9999;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  const animate = () => {
    curX += (mouseX - curX) * 0.1;
    curY += (mouseY - curY) * 0.1;
    cursor.style.left = curX + 'px';
    cursor.style.top  = curY + 'px';
    requestAnimationFrame(animate);
  };

  requestAnimationFrame(animate);
})();

/* ---- Stagger children on reveal ---- */
(function initStaggerReveal() {
  const staggerGroups = document.querySelectorAll('[data-stagger]');
  if (!staggerGroups.length) return;

  staggerGroups.forEach(group => {
    const children = group.children;
    const delay    = parseFloat(group.dataset.stagger) || 0.1;

    Array.from(children).forEach((child, i) => {
      child.style.transitionDelay = `${i * delay}s`;
      child.classList.add('reveal');
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            Array.from(children).forEach(child => child.classList.add('revealed'));
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(group);
  });
})();

/* ---- Magnetic button effect ---- */
(function initMagnetic() {
  const btns = document.querySelectorAll('.btn-primary, .magnetic');
  if (!btns.length || window.matchMedia('(pointer: coarse)').matches) return;

  btns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top  - rect.height / 2;
      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
})();

/* ---- Number ticker (hero stats) ---- */
(function initHeroNumbers() {
  const els = document.querySelectorAll('[data-count]');
  if (!els.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const el  = entry.target;
        const end = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const decimals = (end % 1 !== 0) ? 1 : 0;
        const duration = 2000;
        const start = performance.now();

        const update = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased    = 1 - Math.pow(1 - progress, 4);
          const current  = (eased * end).toFixed(decimals);
          el.textContent = current + suffix;
          if (progress < 1) requestAnimationFrame(update);
        };

        requestAnimationFrame(update);
        observer.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );

  els.forEach(el => {
    el.dataset.originalText = el.textContent;
    el.textContent = '0' + (el.dataset.suffix || '');
    observer.observe(el);
  });
})();

/* ---- Ticker marquee ---- */
(function initTicker() {
  const wrap = document.querySelector('.ticker-inner');
  if (!wrap) return;

  /* Duplicate for seamless loop */
  const clone = wrap.cloneNode(true);
  clone.setAttribute('aria-hidden', 'true');
  wrap.parentElement.appendChild(clone);
})();

/* ---- Section bg gradient shift on scroll ---- */
(function initBgShift() {
  const hero = document.querySelector('.hero-section');
  if (!hero) return;

  window.addEventListener('scroll', () => {
    const scrollPct = Math.min(window.scrollY / window.innerHeight, 1);
    const opacity = 0.6 - scrollPct * 0.4;
    const overlay = hero.querySelector('.hero-overlay');
    if (overlay) overlay.style.opacity = opacity;
  }, { passive: true });
})();

/* ---- Hover tilt on cards ---- */
(function initCardTilt() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(1000px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();