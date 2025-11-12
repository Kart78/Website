document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const currentYearEl = document.getElementById('currentYear');

  if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
  }

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        if (navLinks.classList.contains('open')) {
          navLinks.classList.remove('open');
          navToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  const appointmentForm = document.querySelector('.appointment-form');
  const subscribeForm = document.querySelector('.subscribe');
  const plannerForm = document.getElementById('planner-form');
  const plannerCancelBtn = document.getElementById('planner-cancel');
  const plannerTable = document.querySelector('#planner-table tbody');
  const plannerEmpty = document.querySelector('.planner-empty');

  // ============================================
  // EMAILJS CONFIGURATION
  // ============================================
  const EMAILJS_CONFIG = {
    PUBLIC_KEY: 'mSidDHZYLKjkpTA2I',
    SERVICE_ID: 'service_z5nglir',
    TEMPLATE_ID: 'template_mqk92qm',
    TO_EMAIL: 'rknotaries@gmail.com',
    ENABLED: true  // Changed from TRUE to true (lowercase boolean)
  };

  // Initialize EmailJS
  if (typeof emailjs !== 'undefined' && EMAILJS_CONFIG.ENABLED) {
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
  }

  // Handle Appointment Form Submission with EmailJS
  if (appointmentForm) {
    appointmentForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const submitButton = appointmentForm.querySelector('button[type="submit"]');
      const originalButtonText = submitButton.textContent;
      
      // Disable button and show loading state
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';

      try {
        // Get form data
        const formData = {
          name: document.getElementById('name').value.trim(),
          email: document.getElementById('email').value.trim(),
          service: document.getElementById('service').value,
          message: document.getElementById('message').value.trim(),
        };

        // Validate email
        if (!formData.email || !formData.email.includes('@')) {
          alert('Please enter a valid email address.');
          submitButton.disabled = false;
          submitButton.textContent = originalButtonText;
          return;
        }

        const emailParams = {
          to_email: EMAILJS_CONFIG.TO_EMAIL,
          from_name: formData.name,
          from_email: formData.email,
          service: formData.service,
          message: formData.message || 'No message provided',
          reply_to: formData.email,
        };

        // Send email using EmailJS if configured
        if (typeof emailjs !== 'undefined' && EMAILJS_CONFIG.ENABLED) {
          await emailjs.send(
            EMAILJS_CONFIG.SERVICE_ID,
            EMAILJS_CONFIG.TEMPLATE_ID,
            emailParams
          );

          alert('Thank you! Your appointment request has been sent to RK Notary. We will contact you shortly at ' + formData.email + '.');
          appointmentForm.reset();
        } else {
          // Fallback: Send email using mailto link if EmailJS is not configured
          const subject = encodeURIComponent(`Appointment Request - ${formData.service}`);
          const body = encodeURIComponent(
            `Name: ${formData.name}\nEmail: ${formData.email}\nService: ${formData.service}\n\nMessage:\n${formData.message}`
          );
          window.location.href = `mailto:rknotaries@gmail.com?subject=${subject}&body=${body}`;
          alert('Thank you! Your email client should open. If not, please email us directly at rknotaries@gmail.com');
        }
      } catch (error) {
        console.error('Error sending email:', error);
        alert('There was an error sending your request. Please call us at (551) 689-7740 or email rknotaries@gmail.com directly.');
      } finally {
        // Re-enable button
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
      }
    });
  }

  // Subscribe Form Handler
  if (subscribeForm) {
    subscribeForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const submitButton = subscribeForm.querySelector('button[type="submit"]');
      const emailInput = document.getElementById('subscribe-email');
      const originalButtonText = submitButton.textContent;
      
      submitButton.disabled = true;
      submitButton.textContent = 'Joining...';

      try {
        const subscriberEmail = emailInput.value.trim();

        if (!subscriberEmail || !subscriberEmail.includes('@')) {
          alert('Please enter a valid email address.');
          submitButton.disabled = false;
          submitButton.textContent = originalButtonText;
          return;
        }

        const emailParams = {
          to_email: EMAILJS_CONFIG.TO_EMAIL,
          subscriber_email: subscriberEmail,
        };

        if (typeof emailjs !== 'undefined' && EMAILJS_CONFIG.ENABLED) {
          await emailjs.send(
            EMAILJS_CONFIG.SERVICE_ID,
            EMAILJS_CONFIG.TEMPLATE_ID,
            emailParams
          );
          alert('Thanks for subscribing to RK Notary insights!');
          subscribeForm.reset();
        } else {
          alert('Thanks for subscribing to RK Notary insights!');
          subscribeForm.reset();
        }
      } catch (error) {
        console.error('Error subscribing:', error);
        alert('There was an error. Please try again or email us directly at rknotaries@gmail.com');
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
      }
    });
  }

  // Planner functionality
  if (plannerForm && plannerTable && plannerEmpty && plannerCancelBtn) {
    const plannerClient = document.getElementById('planner-client');
    const plannerService = document.getElementById('planner-service');
    const plannerDate = document.getElementById('planner-date');
    const plannerNotes = document.getElementById('planner-notes');
    const plannerSubmitBtn = plannerForm.querySelector('button[type="submit"]');

    const plannerData = [
      {
        client: 'Anderson Family',
        service: 'Family Protection & Estate Guidance',
        date: new Date().toISOString().slice(0, 10),
        notes: 'Review beneficiaries and schedule attorney meeting.',
      },
      {
        client: 'Robert L.',
        service: 'Financial Planning & 401(k) Rollovers',
        date: new Date(Date.now() + 12096e5).toISOString().slice(0, 10),
        notes: 'Finalize rollover paperwork and risk assessment questionnaire.',
      },
    ];

    let editingIndex = null;

    const toggleEmptyState = () => {
      if (plannerData.length === 0) {
        plannerEmpty.classList.remove('hidden');
      } else {
        plannerEmpty.classList.add('hidden');
      }
    };

    const renderPlannerRows = () => {
      plannerTable.innerHTML = '';

      plannerData.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${item.client}</td>
          <td>${item.service}</td>
          <td>${item.date}</td>
          <td>${item.notes || '—'}</td>
          <td class="actions">
            <button type="button" data-index="${index}" class="edit">Edit</button>
            <button type="button" data-index="${index}" class="delete">Delete</button>
          </td>
        `;
        plannerTable.appendChild(row);
      });

      toggleEmptyState();
    };

    const resetPlannerForm = () => {
      plannerForm.reset();
      editingIndex = null;
      plannerSubmitBtn.textContent = 'Save Task';
      plannerCancelBtn.classList.add('hidden');
    };

    plannerForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const entry = {
        client: plannerClient.value.trim(),
        service: plannerService.value,
        date: plannerDate.value,
        notes: plannerNotes.value.trim(),
      };

      if (!entry.client || !entry.service || !entry.date) {
        alert('Please complete the required fields.');
        return;
      }

      if (editingIndex !== null) {
        plannerData[editingIndex] = entry;
      } else {
        plannerData.push(entry);
      }

      renderPlannerRows();
      resetPlannerForm();
    });

    plannerTable.addEventListener('click', (event) => {
      const target = event.target;

      if (!(target instanceof HTMLElement)) {
        return;
      }

      const indexAttr = target.getAttribute('data-index');
      if (indexAttr === null) {
        return;
      }

      const index = Number(indexAttr);

      if (target.classList.contains('edit')) {
        const item = plannerData[index];
        plannerClient.value = item.client;
        plannerService.value = item.service;
        plannerDate.value = item.date;
        plannerNotes.value = item.notes;
        editingIndex = index;
        plannerSubmitBtn.textContent = 'Update Task';
        plannerCancelBtn.classList.remove('hidden');
        plannerClient.focus();
      }

      if (target.classList.contains('delete')) {
        const confirmed = confirm('Remove this task from your planner?');
        if (confirmed) {
          plannerData.splice(index, 1);
          renderPlannerRows();
          resetPlannerForm();
        }
      }
    });

    plannerCancelBtn?.addEventListener('click', () => {
      resetPlannerForm();
    });

    renderPlannerRows();
  }
});