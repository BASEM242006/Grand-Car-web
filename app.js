/**
 * GRAND CAR - Premium Automotive Repair & PDR
 * Interactive JavaScript Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  loadCustomContactSettings();
  loadCustomGalleryItems();
  initNavbar();
  initComparisonSliders();
  initGallery();
  initLightbox();
  initEstimatorForm();
  initStatsCounter();
  initScrollTop();
  initImageFallbacks();
  initAdminEngine();
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
   3. Gallery Filtering & Dynamic Counts
   ========================================================================== */
function updateGalleryCountBadge() {
  const allItems = document.querySelectorAll('.gallery-item');
  const countBtn = document.getElementById('allGalleryCountBtn');
  if (countBtn && allItems.length > 0) {
    countBtn.textContent = `جميع الأعمال (${allItems.length} صورة)`;
  }
}

function initGallery() {
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const quickAddBtn = document.getElementById('galleryQuickAddBtn');

  updateGalleryCountBadge();

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      const galleryItems = document.querySelectorAll('.gallery-item');

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

  quickAddBtn?.addEventListener('click', () => {
    const modal = document.getElementById('inpageAdminModal');
    if (modal) {
      updateAdminViewState();
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';

      // If logged in, select upload tab
      const uploadTabBtn = document.querySelector('.admin-tab-btn[data-tab="uploadPhotoTab"]');
      uploadTabBtn?.click();
    }
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

/* ==========================================================================
   9. Embedded In-Page Admin & Gallery Upload System
   ========================================================================== */

const ADMIN_CREDENTIALS = {
  user: 'mabonoor2016@gmail.com',
  pass: 'Aa@0108239482'
};

let uploadedImageDataUrl = null;

function initAdminEngine() {
  const modal = document.getElementById('inpageAdminModal');
  const openBtnFooter = document.getElementById('openAdminModalBtn');
  const openBtnFloat = document.getElementById('floatingAdminBtn');
  const closeBtn = document.getElementById('adminModalCloseBtn');
  const loginForm = document.getElementById('inpageLoginForm');
  const logoutBtn = document.getElementById('inpageLogoutBtn');
  const pwToggle = document.getElementById('inpagePwToggle');
  const passInput = document.getElementById('inpageAdminPass');
  const eyeIcon = document.getElementById('inpageEyeIcon');
  const loginError = document.getElementById('inpageLoginError');

  // 1. Open / Close Modal Handlers
  function openModal() {
    updateAdminViewState();
    modal?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal?.classList.remove('active');
    document.body.style.overflow = '';
  }

  openBtnFooter?.addEventListener('click', openModal);
  openBtnFloat?.addEventListener('click', openModal);
  closeBtn?.addEventListener('click', closeModal);

  modal?.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Keyboard shortcut Ctrl + Shift + A to open Admin modal
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a' || e.key === 'ش')) {
      e.preventDefault();
      openModal();
    }
    if (e.key === 'Escape' && modal?.classList.contains('active')) {
      closeModal();
    }
  });

  // 2. Password visibility toggle
  pwToggle?.addEventListener('click', () => {
    const isHidden = passInput.type === 'password';
    passInput.type = isHidden ? 'text' : 'password';
    eyeIcon.innerHTML = isHidden
      ? '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>'
      : '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>';
  });

  // 3. Login Submission
  loginForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const userVal = document.getElementById('inpageAdminUser')?.value.trim();
    const passVal = passInput?.value;
    const submitBtn = document.getElementById('inpageLoginBtn');

    submitBtn?.classList.add('loading');
    loginError?.classList.remove('active');

    setTimeout(() => {
      submitBtn?.classList.remove('loading');

      if (userVal === ADMIN_CREDENTIALS.user && passVal === ADMIN_CREDENTIALS.pass) {
        localStorage.setItem('grandcar_admin_logged_in', 'true');
        showAdminToast('تم تسجيل الدخول بنجاح! أهلاً بك في لوحة الإدارة', 'success');
        updateAdminViewState();
        renderCustomGalleryList();
      } else {
        loginError?.classList.add('active');
      }
    }, 600);
  });

  // 4. Logout
  logoutBtn?.addEventListener('click', () => {
    localStorage.removeItem('grandcar_admin_logged_in');
    showAdminToast('تم تسجيل الخروج من لوحة الإدارة', 'error');
    updateAdminViewState();
    loginForm?.reset();
    loginError?.classList.remove('active');
  });

  // 5. Tabs Switching inside Admin Dashboard
  const tabBtns = document.querySelectorAll('.admin-tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.admin-tab-pane').forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetId = btn.getAttribute('data-tab');
      document.getElementById(targetId)?.classList.add('active');

      if (targetId === 'manageGalleryTab') {
        renderCustomGalleryList();
      }
    });
  });

  // 6. Image File Dropzone & FileReader
  initDropzone();

  // 7. Gallery Upload Form Submission
  const uploadForm = document.getElementById('uploadGalleryForm');
  uploadForm?.addEventListener('submit', handleGalleryUpload);

  // 8. Contact Settings Form Submission
  const contactForm = document.getElementById('contactSettingsForm');
  contactForm?.addEventListener('submit', handleContactSettingsSave);
}

function updateAdminViewState() {
  const isLoggedIn = localStorage.getItem('grandcar_admin_logged_in') === 'true';
  const loginView = document.getElementById('adminLoginView');
  const dashboardView = document.getElementById('adminDashboardView');

  if (isLoggedIn) {
    loginView?.classList.remove('active');
    dashboardView?.classList.add('active');
    renderCustomGalleryList();
  } else {
    dashboardView?.classList.remove('active');
    loginView?.classList.add('active');
  }
}

/* Dropzone & File Preview Logic */
function initDropzone() {
  const dropzone = document.getElementById('adminDropzone');
  const fileInput = document.getElementById('galleryFileInput');
  const previewBox = document.getElementById('dropzonePreview');
  const promptBox = document.getElementById('dropzonePrompt');
  const previewImg = document.getElementById('previewImgElement');
  const removeBtn = document.getElementById('removePreviewBtn');

  if (!dropzone || !fileInput) return;

  function handleFile(file) {
    if (!file || !file.type.startsWith('image/')) {
      showAdminToast('يرجى اختيار ملف صورة صالح (JPG, PNG, WEBP)', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      uploadedImageDataUrl = e.target.result;
      if (previewImg) previewImg.src = uploadedImageDataUrl;
      promptBox.style.display = 'none';
      previewBox.style.display = 'inline-block';
    };
    reader.readAsDataURL(file);
  }

  fileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  });

  ['dragenter', 'dragover'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      dropzone.classList.add('dragover');
    });
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      dropzone.classList.remove('dragover');
    });
  });

  dropzone.addEventListener('drop', (e) => {
    if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  });

  removeBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    resetDropzone();
  });
}

function resetDropzone() {
  uploadedImageDataUrl = null;
  const fileInput = document.getElementById('galleryFileInput');
  const previewBox = document.getElementById('dropzonePreview');
  const promptBox = document.getElementById('dropzonePrompt');
  const previewImg = document.getElementById('previewImgElement');

  if (fileInput) fileInput.value = '';
  if (previewImg) previewImg.src = '';
  if (previewBox) previewBox.style.display = 'none';
  if (promptBox) promptBox.style.display = 'block';
}

/* Handle Upload & Publish Gallery Item */
function handleGalleryUpload(e) {
  e.preventDefault();

  if (!uploadedImageDataUrl) {
    showAdminToast('يرجى اختيار أو رفع صورة أولاً!', 'error');
    return;
  }

  const carName = document.getElementById('carNameInput')?.value.trim() || 'سيارة عميل';
  const category = document.getElementById('imageCategorySelect')?.value || 'real luxury pdr after';
  const title = document.getElementById('workTitleInput')?.value.trim() || 'إصلاح وتعديل احترافي';
  const tag = document.getElementById('workTagInput')?.value.trim() || 'مركز جراند كار — طريق خريص';
  const badgeStatus = document.getElementById('badgeStatusSelect')?.value || 'after';

  let badgeText = 'بعد التعديل (وكالة 100%)';
  let badgeClass = 'gallery-status-after';

  if (badgeStatus === 'before') {
    badgeText = 'قبل التعديل (صدمة)';
    badgeClass = 'gallery-status-before';
  } else if (badgeStatus === 'process') {
    badgeText = 'أثناء العمل بالورشة';
    badgeClass = 'gallery-status-after';
  }

  const newItem = {
    id: 'custom_' + Date.now(),
    imgSrc: uploadedImageDataUrl,
    carName: carName,
    category: category,
    title: title,
    tag: tag,
    badgeText: badgeText,
    badgeClass: badgeClass,
    createdAt: new Date().toLocaleDateString('ar-SA')
  };

  // 1. Save to LocalStorage
  const existing = getStoredGalleryItems();
  existing.unshift(newItem);
  localStorage.setItem('grandcar_custom_gallery', JSON.stringify(existing));

  // 2. Prepend to live gallery grid
  renderSingleGalleryItemToGrid(newItem, true);

  // 3. Reset form
  document.getElementById('uploadGalleryForm')?.reset();
  resetDropzone();

  // 4. Update count badge & list
  renderCustomGalleryList();

  // 5. Notify user
  showAdminToast('✨ تم نشر الصورة بنجاح في معرض الأعمال!', 'success');

  // Scroll to gallery section smoothly
  const galleryEl = document.getElementById('gallery');
  if (galleryEl) {
    const modal = document.getElementById('inpageAdminModal');
    modal?.classList.remove('active');
    document.body.style.overflow = '';
    galleryEl.scrollIntoView({ behavior: 'smooth' });
  }
}

function getStoredGalleryItems() {
  try {
    const data = localStorage.getItem('grandcar_custom_gallery');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/* Load and render all stored gallery items into live page */
function loadCustomGalleryItems() {
  const items = getStoredGalleryItems();
  const grid = document.querySelector('.gallery-grid');
  if (!grid || items.length === 0) return;

  // Insert stored custom items at the very beginning of the grid
  items.forEach(item => {
    renderSingleGalleryItemToGrid(item, false);
  });
}

function renderSingleGalleryItemToGrid(item, isNew = false) {
  const grid = document.querySelector('.gallery-grid');
  if (!grid) return;

  // Avoid duplicates
  const existingEl = document.getElementById(`item_${item.id}`);
  if (existingEl) return;

  const itemEl = document.createElement('div');
  itemEl.id = `item_${item.id}`;
  itemEl.className = 'gallery-item featured-real custom-uploaded-item';
  itemEl.setAttribute('data-category', item.category);

  if (isNew) {
    itemEl.style.animation = 'fadeIn 0.5s ease forwards';
  }

  itemEl.innerHTML = `
    <span class="gallery-real-badge">تصوير ورشتنا</span>
    <span class="gallery-status-badge ${item.badgeClass || 'gallery-status-after'}">${item.badgeText || 'بعد التعديل'}</span>
    <img src="${item.imgSrc}" alt="${item.carName} — ${item.title}" class="pos-center" loading="lazy">
    <div class="gallery-item-overlay">
      <span class="gallery-item-car">${item.carName}</span>
      <h4 class="gallery-item-title">${item.title}</h4>
      <span class="gallery-item-tag">${item.tag}</span>
      <div class="gallery-zoom-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
      </div>
    </div>
  `;

  // Prepend to top of gallery
  grid.insertBefore(itemEl, grid.firstChild);
  updateGalleryCountBadge();
}

/* Render Custom Gallery items in Admin Manage Tab */
function renderCustomGalleryList() {
  const listContainer = document.getElementById('customGalleryList');
  const countBadge = document.getElementById('customImagesCount');
  if (!listContainer) return;

  const items = getStoredGalleryItems();
  if (countBadge) countBadge.textContent = items.length;

  if (items.length === 0) {
    listContainer.innerHTML = `
      <div class="custom-gallery-empty">
        <p>لم تقم برفع صور إضافية بعد. استخدم تبويب «📸 رفع صورة جديدة للمعرض» لنشر صور جديدة لسيارات العملاء.</p>
      </div>
    `;
    return;
  }

  listContainer.innerHTML = items.map(item => `
    <div class="custom-gallery-card" id="card_${item.id}">
      <div class="custom-gallery-card-left">
        <img src="${item.imgSrc}" alt="${item.carName}" class="custom-gallery-thumb">
        <div class="custom-gallery-details">
          <div class="custom-gallery-title">${item.carName} — ${item.title}</div>
          <div class="custom-gallery-sub">${item.badgeText || 'تصوير ورشتنا'} • ${item.createdAt || ''}</div>
        </div>
      </div>
      <button type="button" class="btn-delete-card" onclick="deleteCustomGalleryItem('${item.id}')" title="حذف من المعرض">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
        <span>حذف</span>
      </button>
    </div>
  `).join('');
}

window.deleteCustomGalleryItem = function(id) {
  if (!confirm('هل أنت متأكد من رغبتك في حذف هذه الصورة من معرض الأعمال؟')) return;

  let items = getStoredGalleryItems();
  items = items.filter(item => item.id !== id);
  localStorage.setItem('grandcar_custom_gallery', JSON.stringify(items));

  // Remove from live grid
  const gridItem = document.getElementById(`item_${id}`);
  gridItem?.remove();
  updateGalleryCountBadge();

  // Re-render list
  renderCustomGalleryList();
  showAdminToast('تم حذف الصورة من معرض الأعمال بنجاح', 'error');
};

/* Contact Settings Save & Live Update */
function handleContactSettingsSave(e) {
  e.preventDefault();
  const phone = document.getElementById('settingPhone')?.value.trim();
  const whatsapp = document.getElementById('settingWhatsapp')?.value.trim();
  const address = document.getElementById('settingAddress')?.value.trim();

  if (phone) localStorage.setItem('grandcar_phone', phone);
  if (whatsapp) localStorage.setItem('grandcar_whatsapp', whatsapp);
  if (address) localStorage.setItem('grandcar_address', address);

  applyContactSettings(phone, whatsapp, address);
  showAdminToast('💾 تم حفظ وتحديث بيانات التواصل في كامل الموقع!', 'success');
}

function loadCustomContactSettings() {
  const phone = localStorage.getItem('grandcar_phone');
  const whatsapp = localStorage.getItem('grandcar_whatsapp');
  const address = localStorage.getItem('grandcar_address');

  if (phone || whatsapp || address) {
    applyContactSettings(phone, whatsapp, address);
  }
}

function applyContactSettings(phone, whatsapp, address) {
  if (phone) {
    document.querySelectorAll('a[href^="tel:"]').forEach(a => {
      a.href = `tel:+966${phone.replace(/^0+/, '')}`;
      const span = a.querySelector('span');
      if (span && !span.classList.contains('btn-text')) {
        span.textContent = phone;
      }
    });
    const phoneInput = document.getElementById('settingPhone');
    if (phoneInput) phoneInput.value = phone;
  }

  if (whatsapp) {
    const cleanWa = whatsapp.replace(/\+/g, '');
    document.querySelectorAll('a[href*="wa.me"]').forEach(a => {
      const url = new URL(a.href);
      const text = url.searchParams.get('text') || '';
      a.href = `https://wa.me/${cleanWa}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
    });
    const waInput = document.getElementById('settingWhatsapp');
    if (waInput) waInput.value = cleanWa;
  }
}

/* Toast Notifications */
let adminToastTimeout = null;
function showAdminToast(msg, type = 'success') {
  const toast = document.getElementById('adminToast');
  const icon = document.getElementById('adminToastIcon');
  const text = document.getElementById('adminToastText');

  if (!toast || !text) return;

  toast.className = `admin-toast ${type} show`;
  text.textContent = msg;

  if (icon) {
    icon.innerHTML = type === 'success'
      ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>'
      : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>';
  }

  clearTimeout(adminToastTimeout);
  adminToastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

