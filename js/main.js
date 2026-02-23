(function () {
  'use strict';

  const WALLET_ADDRESS = 'TAQvEdF1es2pNwxLxDTpkwiNnEsHbridsV';

  // QR code for TRC-20 address (USDT on TRON)
  function initQR() {
    const el = document.getElementById('qrcode');
    if (!el || typeof QRCode === 'undefined') return;
    var opts = { width: 160, margin: 1, color: { dark: '#0a0b0d', light: '#ffffff' } };
    QRCode.toDataURL(WALLET_ADDRESS, opts, function (err, url) {
      if (err) return;
      var img = document.createElement('img');
      img.src = url;
      img.alt = 'QR code for USDT TRC-20 wallet';
      img.width = 160;
      img.height = 160;
      el.appendChild(img);
    });
  }

  // Copy wallet address
  function initCopy() {
    const btn = document.getElementById('copy-btn');
    const code = document.getElementById('wallet-address');
    if (!btn || !code) return;

    btn.addEventListener('click', function () {
      const text = code.textContent || code.innerText;
      navigator.clipboard.writeText(text).then(function () {
        btn.textContent = 'Copied!';
        btn.classList.add('copied');
        setTimeout(function () {
          btn.textContent = 'Copy';
          btn.classList.remove('copied');
        }, 2000);
      }).catch(function () {
        // Fallback: select and copy
        const range = document.createRange();
        range.selectNodeContents(code);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        try {
          document.execCommand('copy');
          btn.textContent = 'Copied!';
          btn.classList.add('copied');
          setTimeout(function () {
            btn.textContent = 'Copy';
            btn.classList.remove('copied');
          }, 2000);
        } catch (_) {}
        sel.removeAllRanges();
      });
    });
  }

  // Reduce casual inspection (right-click, DevTools shortcuts). Note: cannot fully block DevTools.
  function initProtection() {
    document.addEventListener('contextmenu', function (e) {
      e.preventDefault();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'F12' ||
          (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
          (e.ctrlKey && e.key === 'u') ||
          (e.metaKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
          (e.metaKey && e.key === 'u')) {
        e.preventDefault();
      }
    });
    document.addEventListener('dragstart', function (e) {
      if (e.target && e.target.tagName === 'IMG') e.preventDefault();
    });
  }

  // Access request form (Formspree or mailto fallback)
  function initAccessForm() {
    var form = document.getElementById('access-request-form');
    var wrap = form && form.closest('.access-request-form-wrap');
    var successEl = document.getElementById('access-form-success');
    if (!form || !wrap || !successEl) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var action = (form.getAttribute('action') || '').trim();
      var txHash = (document.getElementById('access-txhash') && document.getElementById('access-txhash').value) || '';
      var plan = (document.getElementById('access-plan') && document.getElementById('access-plan').value) || '';
      var email = (document.getElementById('access-email') && document.getElementById('access-email').value) || '';

      if (action && action.indexOf('YOUR_FORM_ID') === -1) {
        // Formspree configured: POST form → email is sent to support inbox automatically
        var body = new FormData(form);
        fetch(action, { method: 'POST', body: body, headers: { Accept: 'application/json' } })
          .then(function (res) {
            if (res.ok) {
              wrap.classList.add('form-submitted');
              successEl.removeAttribute('hidden');
            } else {
              throw new Error('Submit failed');
            }
          })
          .catch(function () {
            openMailto(txHash, plan, email);
            setSuccessMessage(successEl, 'Your deliverables are on the way', 'We couldn’t send automatically. We’ve opened your email with the details—please send the message to complete your request. We’ll then send your strategy files to this email within 24–48 hours.');
            wrap.classList.add('form-submitted');
            successEl.removeAttribute('hidden');
          });
      } else {
        // Formspree not set up yet: fallback to mailto so user can still submit
        openMailto(txHash, plan, email);
        setSuccessMessage(successEl, 'Your deliverables are on the way', 'We’ve opened your email with the details pre-filled. Please send the message to complete your request—we’ll then send your strategy files to this email within 24–48 hours.');
        wrap.classList.add('form-submitted');
        successEl.removeAttribute('hidden');
      }
    });
  }

  function setSuccessMessage(successEl, title, text) {
    var titleEl = successEl.querySelector('.access-form-success-title');
    var textEl = successEl.querySelector('.access-form-success-text');
    if (titleEl) titleEl.textContent = title;
    if (textEl) textEl.textContent = text;
  }

  function openMailto(txHash, plan, email) {
    var subject = encodeURIComponent('Alpha Strategy — Delivery request');
    var body = encodeURIComponent(
      'Transaction hash (TX ID): ' + txHash + '\n\nPlan: ' + plan + '\n\nEmail: ' + email
    );
    window.location.href = 'mailto:support@alphastrategy.com?subject=' + subject + '&body=' + body;
  }

  // Mobile nav toggle
  function initNav() {
    const toggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('.nav');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', nav.classList.contains('open'));
    });

    document.addEventListener('click', function (e) {
      if (nav.classList.contains('open') && !nav.contains(e.target) && !toggle.contains(e.target)) {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Run when DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }

  function run() {
    initQR();
    initCopy();
    initProtection();
    initAccessForm();
    initNav();
  }
})();
