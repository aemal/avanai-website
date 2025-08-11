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

