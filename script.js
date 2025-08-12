// Mobile navigation toggle
const toggleButton = document.querySelector('.nav-toggle');
const htmlRoot = document.documentElement;
const yearSpan = document.getElementById('year');

if (toggleButton) {
  toggleButton.addEventListener('click', () => {
    const isOpen = htmlRoot.classList.toggle('mobile-open');
    toggleButton.setAttribute('aria-expanded', String(isOpen));
  });
}

if (yearSpan) {
  yearSpan.textContent = String(new Date().getFullYear());
}

// Close the mobile menu when clicking a link
document.querySelectorAll('.mobile-nav a').forEach((link) => {
  link.addEventListener('click', () => {
    htmlRoot.classList.remove('mobile-open');
    toggleButton?.setAttribute('aria-expanded', 'false');
  });
});

// Contact form submission
(() => {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  const successEl = document.getElementById('formSuccess');
  const errorEl = document.getElementById('formError');
  const submitButton = form.querySelector('button[type="submit"]');

  async function handleSubmit(event) {
    event.preventDefault();
    errorEl?.setAttribute('hidden', '');
    successEl?.setAttribute('hidden', '');

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    const endpoint = 'https://aemal.app.n8n.cloud/webhook-test/1b3cb523-4ba4-43cc-917e-3be1e85fca4e';

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';
    }

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'avanai-website-contact',
          timestamp: new Date().toISOString(),
          data: payload,
        }),
      });

      if (!res.ok) throw new Error('Request failed: ' + res.status);

      // Hide the form and show success
      form.setAttribute('hidden', '');
      successEl?.removeAttribute('hidden');
      // Ensure success message is visible
      successEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } catch (err) {
      console.error(err);
      errorEl?.removeAttribute('hidden');
      // Ensure error message is visible
      errorEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Send Message';
      }
    }
  }

  form.addEventListener('submit', handleSubmit);
})();

