/**
 * Kinan Rahal - Portfolio & Introduction Website
 * Interactive Controller Script with Multilingual (EN/AR) & Dev Translation Manager
 */

let currentLang = localStorage.getItem('kinan_portfolio_lang') || 'en';

// Load any custom saved translations from localStorage
try {
  const savedTranslations = localStorage.getItem('kinan_custom_translations');
  if (savedTranslations && window.translations) {
    const parsed = JSON.parse(savedTranslations);
    if (parsed.en) Object.assign(window.translations.en, parsed.en);
    if (parsed.ar) Object.assign(window.translations.ar, parsed.ar);
  }
} catch (e) {
  console.warn('Could not load custom translations from localStorage:', e);
}

document.addEventListener('DOMContentLoaded', () => {
  initLanguage();
  initStickyHeader();
  initMobileNav();
  initScrollSpy();
  initSystemsTabs();
  initSkillsFilter();
  initEmailCopy();
  initContactForm();
  initStatsCounters();
});

/**
 * Initialize Language Switcher (English / Arabic)
 */
function initLanguage() {
  const langToggleBtn = document.getElementById('langToggle');
  
  // Set initial language from preference
  setLanguage(currentLang);

  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', () => {
      const newLang = currentLang === 'en' ? 'ar' : 'en';
      setLanguage(newLang);
    });
  }
}

/**
 * Apply Language across DOM and Attributes
 */
function setLanguage(lang) {
  if (!window.translations || !window.translations[lang]) return;

  currentLang = lang;
  localStorage.setItem('kinan_portfolio_lang', lang);

  const dict = window.translations[lang];

  // Set HTML dir and lang attributes
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

  // Update text content / HTML for all elements with data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key] !== undefined) {
      if (/<[a-z][\s\S]*>/i.test(dict[key])) {
        el.innerHTML = dict[key];
      } else {
        el.textContent = dict[key];
      }
    }
  });

  // Update placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (dict[key] !== undefined) {
      el.setAttribute('placeholder', dict[key]);
    }
  });

  // Update Language Toggle Button text
  const langToggleBtn = document.getElementById('langToggle');
  if (langToggleBtn) {
    const langTextSpan = langToggleBtn.querySelector('.lang-text');
    if (langTextSpan) {
      langTextSpan.textContent = dict.langToggle;
    }
  }

  // Update stats counters suffixes if present
  updateStatsLanguage(dict);
}

/**
 * Update stats counters suffix based on active language
 */
function updateStatsLanguage(dict) {
  const statsLangs = document.getElementById('statLangs');
  if (statsLangs) {
    const suffix = currentLang === 'ar' ? ' لغات' : ' Langs';
    statsLangs.setAttribute('data-suffix', suffix);
    statsLangs.innerHTML = `3<span class="stat-suffix">${suffix}</span>`;
  }
}

/**
 * Sticky Header behavior on scroll
 */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/**
 * Mobile Navigation Toggle
 */
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    toggleBtn.setAttribute('aria-expanded', isOpen);
    const icon = toggleBtn.querySelector('i');
    if (icon) {
      icon.className = isOpen ? 'fas fa-times' : 'fas fa-bars';
    }
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      const icon = toggleBtn.querySelector('i');
      if (icon) icon.className = 'fas fa-bars';
    });
  });
}

/**
 * ScrollSpy: Highlight active navigation link based on scroll position
 */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const onScroll = () => {
    const scrollPos = window.scrollY + 140;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/**
 * Featured Systems Interactive Tabs (ERP vs Dashboard)
 */
function initSystemsTabs() {
  const tabBtns = document.querySelectorAll('.system-tab-btn');
  const panels = document.querySelectorAll('.system-panel');

  if (!tabBtns.length || !panels.length) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-target');

      tabBtns.forEach(b => b.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPanel = document.getElementById(target);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });
}

/**
 * Skills Category Filter
 */
function initSkillsFilter() {
  const filterBtns = document.querySelectorAll('.skill-filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  if (!filterBtns.length || !skillCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      skillCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/**
 * 1-Click Email Copy to Clipboard
 */
function initEmailCopy() {
  const copyBtn = document.querySelector('.copy-email-btn');
  if (!copyBtn) return;

  copyBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const email = 'kinan.rahal88@gmail.com';
    const dict = window.translations ? window.translations[currentLang] : null;
    const copiedMsg = dict ? dict.toastEmailCopied : 'Email address copied to clipboard!';
    const copiedBtnText = dict ? dict.btnCopied : 'Copied';

    navigator.clipboard.writeText(email).then(() => {
      showToast(copiedMsg);
      const textSpan = copyBtn.querySelector('.copy-btn-text');
      const originalText = textSpan ? textSpan.textContent : '';
      if (textSpan) textSpan.textContent = copiedBtnText;
      setTimeout(() => {
        if (textSpan) textSpan.textContent = originalText;
      }, 2500);
    }).catch(() => {
      showToast(`kinan.rahal88@gmail.com`);
    });
  });
}

/**
 * Interactive Contact Form with Real Email & WhatsApp Dispatch
 */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  // 1. WhatsApp Instant Send Button
  const btnWhatsapp = document.getElementById('btnSendWhatsappMsg');
  if (btnWhatsapp) {
    btnWhatsapp.addEventListener('click', () => {
      const name = form.querySelector('[name="name"]').value.trim();
      const email = form.querySelector('[name="email"]').value.trim();
      const subject = form.querySelector('[name="subject"]').value.trim();
      const message = form.querySelector('[name="message"]').value.trim();
      const dict = window.translations ? window.translations[currentLang] : null;

      if (!name || !message) {
        const warningMsg = dict ? dict.toastFillFields : 'Please fill in your name and message.';
        showToast(warningMsg, 'warning');
        return;
      }

      let text = '';
      if (currentLang === 'ar') {
        text = `السلام عليكم م. كنان الرحال،\n\nالاسم: ${name}\nالبريد: ${email || 'غير محدد'}\nالموضوع: ${subject || 'استفسار عبر الموقع الإلكتروني'}\n\nنص الرسالة:\n${message}`;
      } else {
        text = `Hello Eng. Kinan Rahal,\n\nName: ${name}\nEmail: ${email || 'Not specified'}\nSubject: ${subject || 'Inquiry from Portfolio'}\n\nMessage:\n${message}`;
      }

      const waUrl = `https://wa.me/966543212156?text=${encodeURIComponent(text)}`;
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    });
  }

  // 2. Direct Email Form Submission (Web3Forms API + Mailto Fallback)
  // To receive submissions directly to kinan.rahal88@gmail.com without a backend or database,
  // enter your free Web3Forms access key below (get free key in 10s at https://web3forms.com):
  const WEB3FORMS_ACCESS_KEY = '965eb959-6818-4722-ac3d-b5a5a79b0e46';

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = form.querySelector('[name="name"]').value.trim();
    const email = form.querySelector('[name="email"]').value.trim();
    const subject = form.querySelector('[name="subject"]').value.trim();
    const message = form.querySelector('[name="message"]').value.trim();
    const dict = window.translations ? window.translations[currentLang] : null;

    if (!name || !email || !message) {
      const warningMsg = dict ? dict.toastFillFields : 'Please fill in all required fields.';
      showToast(warningMsg, 'warning');
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const submitBtnText = submitBtn.querySelector('.btn-submit-text');
    const originalText = submitBtnText ? submitBtnText.textContent : '';
    submitBtn.disabled = true;
    if (submitBtnText) submitBtnText.textContent = dict ? dict.btnSending : 'Sending message...';

    const hasActiveKey = WEB3FORMS_ACCESS_KEY && !WEB3FORMS_ACCESS_KEY.includes('YOUR_');

    if (hasActiveKey) {
      try {
        const formData = new FormData(form);
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData
        });

        const result = await response.json();
        if (result.success) {
          form.reset();
          const successMsg = dict ? dict.toastMessageSent : 'Thank you! Your inquiry has been sent to Kinan Rahal.';
          showToast(successMsg);
        } else {
          throw new Error(result.message || 'Submission failed');
        }
      } catch (err) {
        const fallbackMsg = dict ? dict.toastMessageFallback : 'Opening email client to send your message...';
        showToast(fallbackMsg, 'warning');
        const mailtoUrl = `mailto:kinan.rahal88@gmail.com?subject=${encodeURIComponent(subject || 'Portfolio Inquiry')}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
        window.location.href = mailtoUrl;
      } finally {
        submitBtn.disabled = false;
        if (submitBtnText) submitBtnText.textContent = originalText;
      }
    } else {
      // Direct mailto fallback if API key is not yet set
      const fallbackMsg = dict ? dict.toastMessageFallback : 'Opening email client to send your message...';
      showToast(fallbackMsg);
      const mailtoUrl = `mailto:kinan.rahal88@gmail.com?subject=${encodeURIComponent(subject || 'Inquiry from ' + name)}&body=${encodeURIComponent(`From: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
      setTimeout(() => {
        window.location.href = mailtoUrl;
        submitBtn.disabled = false;
        if (submitBtnText) submitBtnText.textContent = originalText;
        form.reset();
      }, 500);
    }
  });
}

/**
 * Animated Numbers Counter for Hero Statistics
 */
function initStatsCounters() {
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  if (!statNumbers.length) return;

  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        statNumbers.forEach(stat => {
          const target = parseFloat(stat.getAttribute('data-target'));
          const suffix = stat.getAttribute('data-suffix') || '';
          let count = 0;
          const duration = 1500;
          const stepTime = 30;
          const steps = duration / stepTime;
          const increment = target / steps;

          const timer = setInterval(() => {
            count += increment;
            if (count >= target) {
              count = target;
              clearInterval(timer);
              stat.innerHTML = `${target}<span class="stat-suffix">${suffix}</span>`;
            } else {
              stat.innerHTML = `${Math.floor(count)}<span class="stat-suffix">${suffix}</span>`;
            }
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.5 });

  const statsRow = document.querySelector('.hero-stats-row');
  if (statsRow) {
    observer.observe(statsRow);
  }
}

/**
 * Toast Notification Helper
 */
function showToast(message, type = 'success') {
  let toast = document.querySelector('.toast-notification');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-notification';
    document.body.appendChild(toast);
  }

  const iconClass = type === 'warning' ? 'fa-exclamation-circle' : 'fa-check-circle';
  toast.innerHTML = `
    <i class="fas ${iconClass} toast-icon"></i>
    <span class="toast-message">${message}</span>
  `;

  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}
