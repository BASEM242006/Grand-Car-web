/**
 * GRAND CAR - Premium Automotive Repair & PDR
 * Interactive JavaScript Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initComparisonSliders();
  initGallery();
  initLightbox();
  initEstimatorForm();
  initStatsCounter();
  initScrollTop();
  initImageFallbacks();
});

/* ==========================================================================
   1. Navbar & Mobile Drawer
   ========================================================================== */
function initNavbar() {
  const header = document.getElementById('header');
  const menuToggle = document.getElementById('menuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileDrawerClose = document.getElementById('mobileDrawerClose');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const navLinks = document.querySelectorAll('.nav-link');

  // Sticky Header on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
    updateActiveNavLink();
  });

  // Mobile Drawer Toggle
  menuToggle?.addEventListener('click', () => {
    mobileDrawer?.classList.add('open');
    document.body.style.overflow = 'hidden';
  });

  function closeMobileDrawer() {
    mobileDrawer?.classList.remove('open');
    document.body.style.overflow = '';
  }

  mobileDrawerClose?.addEventListener('click', closeMobileDrawer);

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMobileDrawer);
  });

  // Active section observer / spy
  function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 200;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPosition >= top && scrollPosition < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }
}

/* ==========================================================================
   2. Interactive Before / After Comparison Sliders
   ========================================================================== */
function initComparisonSliders() {
  const tabBtns = document.querySelectorAll('.comp-tab-btn');
  const compPanels = document.querySelectorAll('.comp-panel');

  // Tab switching
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      compPanels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetId = btn.getAttribute('data-target');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });

  // Slider Drag Functionality (Touch & Pointer events)
  const sliders = document.querySelectorAll('.img-comp-slider');

  sliders.forEach(slider => {
    const afterImg = slider.querySelector('.comp-img-after');
    const handle = slider.querySelector('.comp-handle');
    let isDragging = false;

    if (!afterImg || !handle) return;

    function setPosition(xPos) {
      const rect = slider.getBoundingClientRect();
      let offsetX = xPos - rect.left;

      // Clamp between 5% and 95%
      let percentage = (offsetX / rect.width) * 100;
      if (percentage < 3) percentage = 3;
      if (percentage > 97) percentage = 97;

      afterImg.style.width = `${percentage}%`;
      handle.style.left = `${percentage}%`;
    }

    // Pointer events (works for mouse, pen, and touch)
    function onPointerDown(e) {
      isDragging = true;
      slider.style.cursor = 'ew-resize';
      setPosition(e.clientX || (e.touches && e.touches[0].clientX));
    }

    function onPointerMove(e) {
      if (!isDragging) return;
      const clientX = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0].clientX);
      if (clientX !== undefined) {
        setPosition(clientX);
      }
    }

    function onPointerUp() {
      isDragging = false;
      slider.style.cursor = '';
    }

    slider.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    slider.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);
  });
}

/* ==========================================================================
   3. Gallery Filtering
   ========================================================================== */
function initGallery() {
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          item.style.display = 'block';
          item.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   4. Lightbox Modal
   ========================================================================== */
function initLightbox() {
  const lightbox = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));

  let currentIndex = 0;

  function showImage(index) {
    if (galleryItems.length === 0) return;
    if (index < 0) index = galleryItems.length - 1;
    if (index >= galleryItems.length) index = 0;

    currentIndex = index;
    const item = galleryItems[currentIndex];
    const img = item.querySelector('img');
    const title = item.querySelector('.gallery-item-title')?.textContent || '';

    if (lightboxImg && img) {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt || title;
    }
    if (lightboxCaption) {
      lightboxCaption.textContent = title;
    }
  }

  galleryItems.forEach((item, idx) => {
    item.addEventListener('click', () => {
      showImage(idx);
      lightbox?.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightbox?.classList.remove('active');
    document.body.style.overflow = '';
  }

  lightboxClose?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  lightboxPrev?.addEventListener('click', (e) => {
    e.stopPropagation();
    showImage(currentIndex - 1);
  });

  lightboxNext?.addEventListener('click', (e) => {
    e.stopPropagation();
    showImage(currentIndex + 1);
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox?.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showImage(currentIndex - 1); // RTL right is previous
    if (e.key === 'ArrowLeft') showImage(currentIndex + 1);  // RTL left is next
  });
}

/* ==========================================================================
   5. Interactive WhatsApp Quote / Estimator Form
   ========================================================================== */
function initEstimatorForm() {
  const form = document.getElementById('whatsappEstimatorForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const carMake = document.getElementById('carMake')?.value || 'غير محدد';
    const carYear = document.getElementById('carYear')?.value || '';
    const serviceType = document.getElementById('serviceType')?.value || 'استفسار عام';
    const damageLocation = document.getElementById('damageLocation')?.value || 'غير محدد';
    const notes = document.getElementById('notes')?.value || 'لا يوجد ملاحظات إضافية';

    const messageText = `مرحباً مركز GRAND CAR، أود الاستفسار وطلب تقييم لإصلاح سيارتي:
- نوع وموديل السيارة: ${carMake} ${carYear}
- الخدمة المطلوبة: ${serviceType}
- مكان الصدمة / الضرر: ${damageLocation}
- تفاصيل إضافية: ${notes}

يرجى تزويدي بالتقييم التقديري وإمكانية الحجز. شكراً لكم!`;

    const encodedMessage = encodeURIComponent(messageText);
    const whatsappUrl = `https://wa.me/966500818192?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
  });
}

/* ==========================================================================
   6. Stats Counter Animation on Scroll
   ========================================================================== */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number-val');
  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        statNumbers.forEach(counter => {
          const target = parseInt(counter.getAttribute('data-target') || '0', 10);
          const duration = 1800;
          const start = 0;
          const startTime = performance.now();

          function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const currentVal = Math.floor(easeProgress * (target - start) + start);

            counter.textContent = currentVal.toLocaleString('en-US');

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              counter.textContent = target.toLocaleString('en-US');
            }
          }

          requestAnimationFrame(updateCounter);
        });
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.getElementById('statsSection');
  if (statsSection) {
    observer.observe(statsSection);
  }
}

/* ==========================================================================
   7. Scroll to Top Button
   ========================================================================== */
function initScrollTop() {
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  if (!scrollTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================================================
   8. Reliable Image Fallback System
   ========================================================================== */
function initImageFallbacks() {
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    img.addEventListener('error', function() {
      // High-tech automotive dark gradient SVG fallback if external link ever has network block
      if (!this.getAttribute('data-failed')) {
        this.setAttribute('data-failed', 'true');
        const altText = this.getAttribute('alt') || 'GRAND CAR';
        this.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><rect width="800" height="600" fill="%230f172a"/><circle cx="400" cy="300" r="180" fill="%231e293b"/><text x="50%25" y="48%25" text-anchor="middle" fill="%2300e676" font-family="sans-serif" font-size="28" font-weight="bold">GRAND CAR</text><text x="50%25" y="55%25" text-anchor="middle" fill="%2394a3b8" font-family="sans-serif" font-size="18">${encodeURIComponent(altText)}</text></svg>`;
      }
    });
  });
}
