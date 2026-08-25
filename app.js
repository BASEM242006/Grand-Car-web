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
        const category = item.getAttribute('data-category') || '';
        const categories = category.split(' ');
        if (filter === 'all' || categories.includes(filter)) {
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

  let currentVisibleItems = [];
  let currentIndex = 0;

  function updateVisibleItems() {
    currentVisibleItems = Array.from(document.querySelectorAll('.gallery-item')).filter(
      item => item.style.display !== 'none'
    );
    if (currentVisibleItems.length === 0) {
      currentVisibleItems = Array.from(document.querySelectorAll('.gallery-item'));
    }
  }

  function showImage(index) {
    updateVisibleItems();
    if (currentVisibleItems.length === 0) return;

    if (index < 0) index = currentVisibleItems.length - 1;
    if (index >= currentVisibleItems.length) index = 0;

    currentIndex = index;
    const item = currentVisibleItems[currentIndex];
    const img = item.querySelector('img');
    const title = item.querySelector('.gallery-item-title')?.textContent.trim() || '';
    const tag = item.querySelector('.gallery-item-tag')?.textContent.trim() || '';
    const car = item.querySelector('.gallery-item-car')?.textContent.trim() || '';

    if (lightboxImg && img) {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt || title;
    }

    if (lightboxCaption) {
      const waMsg = encodeURIComponent(`مرحباً مركز جراند كار، رأيت في معرض أعمالكم صورة (${car} - ${title}) وأود الاستفسار عن إمكانية إصلاح سيارتي.`);
      lightboxCaption.innerHTML = `
        ${car ? `<span style="background:rgba(255,255,255,0.15); color:#fff; padding:3px 12px; border-radius:20px; font-size:0.8rem;">${car}</span>` : ''}
        <strong style="font-size:1.15rem; color:#fff; display:block;">${title}</strong>
        ${tag ? `<span style="display:block; color:var(--accent-glow); font-size:0.9rem;">${tag}</span>` : ''}
        <a href="https://wa.me/966500818192?text=${waMsg}" target="_blank" rel="noopener noreferrer" class="lightbox-cta-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.174.086.275.072.376-.043.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.043.073.043.419-.101.824z"/></svg>
          <span>استفسر عن إصلاح مثل هذه الحالة على واتساب</span>
        </a>
      `;
    }
  }

  // Delegated click listener on gallery items
  document.addEventListener('click', (e) => {
    const galleryItem = e.target.closest('.gallery-item');
    if (galleryItem) {
      updateVisibleItems();
      const idx = currentVisibleItems.indexOf(galleryItem);
      if (idx !== -1) {
        showImage(idx);
        lightbox?.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    }
  });

  function closeLightbox() {
    lightbox?.classList.remove('open');
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
