// Admin Panel CRUD Operations
document.addEventListener('DOMContentLoaded', () => {
  const adminToggle = document.getElementById('admin-toggle');
  const adminOverlay = document.getElementById('admin-overlay');
  const adminClose = document.getElementById('admin-close');
  const loginForm = document.getElementById('login-form');
  const adminLogin = document.getElementById('admin-login');
  const adminContent = document.getElementById('admin-content');
  const adminTabs = document.querySelectorAll('.admin-tab');
  const tabContents = document.querySelectorAll('.admin-tab-content');

  // Check if user is logged in
  const isLoggedIn = () => localStorage.getItem('adminLoggedIn') === 'true';

  // Open/Close Admin Panel
  adminToggle?.addEventListener('click', () => {
    if (!isLoggedIn()) {
      adminLogin.classList.remove('hidden');
      adminContent.classList.add('hidden');
    } else {
      adminLogin.classList.add('hidden');
      adminContent.classList.remove('hidden');
      loadAdminData();
    }
    adminOverlay.classList.add('active');
  });

  adminClose?.addEventListener('click', () => {
    adminOverlay.classList.remove('active');
  });

  adminOverlay?.addEventListener('click', (e) => {
    if (e.target === adminOverlay) {
      adminOverlay.classList.remove('active');
    }
  });

  // Login
  loginForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('admin-username').value;
    const password = document.getElementById('admin-password').value;

    // Simple authentication (in production, use secure authentication)
    if (username === 'admin' && password === 'admin123') {
      localStorage.setItem('adminLoggedIn', 'true');
      adminLogin.classList.add('hidden');
      adminContent.classList.remove('hidden');
      loadAdminData();
    } else {
      alert('Invalid credentials. Default: admin / admin123');
    }
  });

  // Tab Switching
  adminTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const targetTab = tab.getAttribute('data-tab');

      adminTabs.forEach((t) => t.classList.remove('active'));
      tabContents.forEach((c) => c.classList.remove('active'));

      tab.classList.add('active');
      document.getElementById(`tab-${targetTab}`)?.classList.add('active');
    });
  });

  // Load Admin Data
  function loadAdminData() {
    loadSections();
    loadImages();
    loadTestimonials();
  }

  // Sections CRUD
  function loadSections() {
    const sectionsList = document.getElementById('sections-list');
    if (!sectionsList) return;

    const sections = [
      { id: 'hero', title: 'Hero Section', fields: ['hero-title', 'hero-description'] },
      { id: 'notary', title: 'Notary Services', fields: ['notary-title', 'notary-description'] },
      { id: 'insurance', title: 'Life Insurance', fields: [] },
      { id: 'financial', title: 'Financial Planning', fields: [] },
      { id: 'family', title: 'Family Protection', fields: [] },
    ];

    sectionsList.innerHTML = '';

    sections.forEach((section) => {
      const item = document.createElement('div');
      item.className = 'admin-section-item';
      item.innerHTML = `
        <h4>${section.title}</h4>
        ${section.fields
          .map(
            (field) => `
          <div class="form-field">
            <label>${field.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}</label>
            <textarea data-field="${field}" data-section="${section.id}">${getFieldValue(field)}</textarea>
          </div>
        `
          )
          .join('')}
        <div class="admin-section-actions">
          <button class="btn primary" onclick="saveSection('${section.id}')">Save Changes</button>
        </div>
      `;
      sectionsList.appendChild(item);
    });
  }

  function getFieldValue(fieldId) {
    const element = document.querySelector(`[data-editable="${fieldId}"]`);
    return element ? element.textContent.trim() : '';
  }

  function saveSection(sectionId) {
    const sectionItem = event.target.closest('.admin-section-item');
    const textareas = sectionItem.querySelectorAll('textarea[data-field]');

    textareas.forEach((textarea) => {
      const fieldId = textarea.getAttribute('data-field');
      const element = document.querySelector(`[data-editable="${fieldId}"]`);
      if (element) {
        element.textContent = textarea.value;
        saveToStorage(fieldId, textarea.value);
      }
    });

    alert('Section updated successfully!');
  }

  // Images CRUD
  function loadImages() {
    const imagesManager = document.getElementById('images-manager');
    if (!imagesManager) return;

    const images = [
      { id: 'hero-card', label: 'Hero Card Image', section: 'hero' },
      { id: 'notary-card', label: 'Notary Card Image', section: 'notary' },
      { id: 'insurance-banner', label: 'Insurance Banner', section: 'insurance' },
      { id: 'term-life', label: 'Term Life Insurance', section: 'insurance' },
      { id: 'whole-life', label: 'Whole Life Insurance', section: 'insurance' },
      { id: 'final-expense', label: 'Final Expense Insurance', section: 'insurance' },
      { id: 'financial-banner', label: 'Financial Planning Banner', section: 'financial' },
      { id: 'financial-card', label: 'Financial Planning Card', section: 'financial' },
      { id: 'family-banner', label: 'Family Protection Banner', section: 'family' },
      { id: 'family-card', label: 'Family Protection Card', section: 'family' },
    ];

    imagesManager.innerHTML = '';

    images.forEach((img) => {
      const currentSrc = getImageSrc(img.id);
      const item = document.createElement('div');
      item.className = 'admin-image-item';
      item.innerHTML = `
        <h4>${img.label}</h4>
        <div class="admin-image-preview">
          <img src="${currentSrc}" alt="${img.label}" />
          <div style="flex: 1;">
            <div class="form-field">
              <label>Image URL (Unsplash or other)</label>
              <input type="url" data-image="${img.id}" value="${currentSrc}" placeholder="https://images.unsplash.com/..." />
            </div>
            <div class="admin-section-actions" style="margin-top: 1rem;">
              <button class="btn primary" onclick="saveImage('${img.id}')">Update Image</button>
            </div>
          </div>
        </div>
      `;
      imagesManager.appendChild(item);
    });
  }

  function getImageSrc(imageId) {
    const element = document.querySelector(`[data-image="${imageId}"]`);
    return element ? element.getAttribute('src') : '';
  }

  function saveImage(imageId) {
    const imageItem = event.target.closest('.admin-image-item');
    const input = imageItem.querySelector(`input[data-image="${imageId}"]`);
    const newSrc = input.value.trim();

    if (!newSrc) {
      alert('Please enter a valid image URL');
      return;
    }

    const element = document.querySelector(`[data-image="${imageId}"]`);
    if (element) {
      element.setAttribute('src', newSrc);
      saveToStorage(`image-${imageId}`, newSrc);
      // Update preview
      const previewImg = imageItem.querySelector('img');
      if (previewImg) {
        previewImg.src = newSrc;
      }
      alert('Image updated successfully!');
    }
  }

  // Testimonials CRUD
  function loadTestimonials() {
    const testimonialsList = document.getElementById('testimonials-list');
    if (!testimonialsList) return;

    const testimonials = getTestimonialsFromStorage();

    testimonialsList.innerHTML = '';

    if (testimonials.length === 0) {
      // Load default testimonials
      const defaultTestimonials = [
        {
          id: 1,
          quote: 'RK Notary made our refinance seamless. The notary explained each form patiently and ensured we felt confident before signing.',
          author: 'Maria & Daniel P.',
        },
        {
          id: 2,
          quote: 'Our family plan combines term life, whole life, and college savings. We finally have peace of mind for every milestone.',
          author: 'The Johnson Family',
        },
        {
          id: 3,
          quote: 'Transitioning my 401(k) after retirement felt overwhelming. RK Notary gave me a clear roadmap and ongoing support.',
          author: 'Robert L.',
        },
      ];
      saveTestimonialsToStorage(defaultTestimonials);
      loadTestimonials();
      return;
    }

    testimonials.forEach((testimonial, index) => {
      const item = document.createElement('div');
      item.className = 'admin-testimonial-item';
      item.innerHTML = `
        <h4>Testimonial ${index + 1}</h4>
        <div class="form-field">
          <label>Quote</label>
          <textarea data-testimonial-quote="${testimonial.id}">${testimonial.quote}</textarea>
        </div>
        <div class="form-field">
          <label>Author</label>
          <input type="text" data-testimonial-author="${testimonial.id}" value="${testimonial.author}" />
        </div>
        <div class="admin-testimonial-actions">
          <button class="btn primary" onclick="saveTestimonial(${testimonial.id})">Save</button>
          <button class="btn secondary" onclick="deleteTestimonial(${testimonial.id})">Delete</button>
        </div>
      `;
      testimonialsList.appendChild(item);
    });
  }

  function getTestimonialsFromStorage() {
    const stored = localStorage.getItem('testimonials');
    return stored ? JSON.parse(stored) : [];
  }

  function saveTestimonialsToStorage(testimonials) {
    localStorage.setItem('testimonials', JSON.stringify(testimonials));
  }

  function saveTestimonial(id) {
    const testimonialItem = event.target.closest('.admin-testimonial-item');
    const quote = testimonialItem.querySelector(`textarea[data-testimonial-quote="${id}"]`).value;
    const author = testimonialItem.querySelector(`input[data-testimonial-author="${id}"]`).value;

    const testimonials = getTestimonialsFromStorage();
    const index = testimonials.findIndex((t) => t.id === id);

    if (index !== -1) {
      testimonials[index] = { id, quote, author };
      saveTestimonialsToStorage(testimonials);
      updateTestimonialsOnPage();
      alert('Testimonial updated!');
    }
  }

  function deleteTestimonial(id) {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;

    const testimonials = getTestimonialsFromStorage();
    const filtered = testimonials.filter((t) => t.id !== id);
    saveTestimonialsToStorage(filtered);
    loadTestimonials();
    updateTestimonialsOnPage();
  }

  function updateTestimonialsOnPage() {
    const testimonials = getTestimonialsFromStorage();
    const testimonialGrid = document.querySelector('.testimonial-grid');
    if (!testimonialGrid) return;

    testimonialGrid.innerHTML = '';

    testimonials.forEach((testimonial) => {
      const figure = document.createElement('figure');
      figure.className = 'testimonial';
      figure.innerHTML = `
        <blockquote>"${testimonial.quote}"</blockquote>
        <figcaption>— ${testimonial.author}</figcaption>
      `;
      testimonialGrid.appendChild(figure);
    });
  }

  // Add New Testimonial
  document.getElementById('add-testimonial-btn')?.addEventListener('click', () => {
    const testimonials = getTestimonialsFromStorage();
    const newId = testimonials.length > 0 ? Math.max(...testimonials.map((t) => t.id)) + 1 : 1;
    testimonials.push({ id: newId, quote: '', author: '' });
    saveTestimonialsToStorage(testimonials);
    loadTestimonials();
  });

  // Storage Helper
  function saveToStorage(key, value) {
    localStorage.setItem(key, value);
  }

  function getFromStorage(key) {
    return localStorage.getItem(key);
  }

  // Load saved data on page load
  function loadSavedData() {
    // Load editable text fields
    document.querySelectorAll('[data-editable]').forEach((element) => {
      const fieldId = element.getAttribute('data-editable');
      const saved = getFromStorage(fieldId);
      if (saved) {
        element.textContent = saved;
      }
    });

    // Load images
    document.querySelectorAll('[data-image]').forEach((element) => {
      const imageId = element.getAttribute('data-image');
      const saved = getFromStorage(`image-${imageId}`);
      if (saved) {
        element.setAttribute('src', saved);
      }
    });

    // Load testimonials
    updateTestimonialsOnPage();
  }

  // Make functions global for onclick handlers
  window.saveSection = saveSection;
  window.saveImage = saveImage;
  window.saveTestimonial = saveTestimonial;
  window.deleteTestimonial = deleteTestimonial;

  // Load saved data on page load
  loadSavedData();
});

