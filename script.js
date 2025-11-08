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

  const handleSubmit = (form, message) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      alert(message);
      form.reset();
    });
  };

  if (appointmentForm) {
    handleSubmit(
      appointmentForm,
      'Thank you for contacting RK Notary. We will confirm your appointment shortly.'
    );
  }

  if (subscribeForm) {
    handleSubmit(subscribeForm, 'Thanks for subscribing to RK Notary insights!');
  }

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

