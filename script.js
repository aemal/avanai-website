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

// Promo video overlay
const videoFab = document.getElementById('video-fab');
const videoOverlay = document.getElementById('video-overlay');
const videoIframe = document.getElementById('video-iframe');

function openVideo() {
  if (!videoOverlay) return;
  videoOverlay.setAttribute('aria-hidden', 'false');
  const src = videoIframe?.getAttribute('data-src');
  if (videoIframe && src) {
    // load and autoplay
    videoIframe.setAttribute('src', src);
  }
}

function closeVideo() {
  if (!videoOverlay) return;
  videoOverlay.setAttribute('aria-hidden', 'true');
  // stop playback by removing src
  if (videoIframe) {
    videoIframe.setAttribute('src', '');
  }
}

videoFab?.addEventListener('click', openVideo);
videoOverlay?.addEventListener('click', (e) => {
  const target = e.target;
  if (target instanceof Element && (target.hasAttribute('data-close') || target.classList.contains('video-overlay'))) {
    closeVideo();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeVideo();
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

    const endpoint = 'https://aemal.app.n8n.cloud/webhook/1b3cb523-4ba4-43cc-917e-3be1e85fca4e';

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

// Vapi Voice Widget bootstrap (if meta tags are present)
(() => {
  const publicKey = document.querySelector('meta[name="vapi-public-key"]')?.getAttribute('content');
  const assistantId = document.querySelector('meta[name="vapi-assistant-id"]')?.getAttribute('content');
  if (!publicKey || !assistantId || publicKey.includes('YOUR_VAPI') || assistantId.includes('YOUR_VAPI')) {
    return; // Not configured
  }

  // Create a floating button style matching site brand
  const buttonConfig = {
    position: 'bottom-right',
    button: {
      style: {
        background: 'linear-gradient(135deg, #6c47ff 0%, #8b5cf6 100%)',
        borderRadius: '22px',
        padding: '12px 18px',
        fontWeight: 800,
        color: '#ffffff',
        boxShadow: '0 10px 24px rgba(108,71,255,.35)'
      },
      text: 'Start voice chat'
    },
    panel: {
      style: {
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        borderRadius: '16px',
        border: '2px solid #e5e7eb',
        backdropFilter: 'blur(8px)'
      }
    }
  };

  (function (d, t) {
    var g = d.createElement(t), s = d.getElementsByTagName(t)[0];
    g.src = 'https://cdn.jsdelivr.net/gh/VapiAI/html-script-tag@latest/dist/assets/index.js';
    g.defer = true; g.async = true; s.parentNode.insertBefore(g, s);
    g.onload = function () {
      window.vapiSDK?.run({ apiKey: publicKey, assistant: assistantId, config: buttonConfig });
    };
  })(document, 'script');
})();

