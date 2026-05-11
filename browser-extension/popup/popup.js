const APP_URL = 'https://shadowreply-ai.vercel.app';

let activeTabId = null;
let currentReplies = [];

// Get active tab once
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  if (tabs[0]) activeTabId = tabs[0].id;
});

// ── View management ──────────────────────────────────────────────

function showView(id) {
  ['view-loading', 'view-auth', 'view-main', 'view-results'].forEach((v) => {
    document.getElementById(v).classList.add('hidden');
  });

  const header = document.getElementById('app-header');
  const headerVisible = id === 'view-main' || id === 'view-results';
  header.classList.toggle('hidden', !headerVisible);

  document.getElementById(id).classList.remove('hidden');
}

function openInApp(path) {
  chrome.tabs.create({ url: APP_URL + path });
  window.close();
}

// ── Auth check on load ───────────────────────────────────────────

chrome.runtime.sendMessage({ type: 'SR_CHECK_AUTH' }, (response) => {
  if (chrome.runtime.lastError) {
    // Service worker may still be waking up — retry once after short delay
    setTimeout(() => {
      chrome.runtime.sendMessage({ type: 'SR_CHECK_AUTH' }, handleAuthResponse);
    }, 600);
    return;
  }
  handleAuthResponse(response);
});

function handleAuthResponse(response) {
  if (!response || !response.authed) {
    showView('view-auth');
    return;
  }

  // Update plan badge
  const badge = document.getElementById('status-badge');
  if (response.plan === 'pro' || response.plan === 'enterprise') {
    badge.textContent = 'Pro';
    badge.className = 'status-badge status-pro';
  }

  // Cache plan locally for quick badge reads
  chrome.storage.local.set({ sr_plan: response.plan });

  // Pre-fill from context-menu selected text
  chrome.storage.session.get(['selectedText'], ({ selectedText }) => {
    if (selectedText?.trim().length > 3) {
      const text = selectedText.trim();
      document.getElementById('message-input').value = text;

      const indicator = document.getElementById('selection-indicator');
      const preview = document.getElementById('sel-preview');
      preview.textContent = text.length > 60 ? text.slice(0, 60) + '…' : text;
      indicator.classList.remove('hidden');
    }
    showView('view-main');
    document.getElementById('message-input').focus();
  });
}

// ── Auth: login button ───────────────────────────────────────────

document.getElementById('btn-login').addEventListener('click', () => {
  openInApp('/login');
});

// ── Selection indicator ──────────────────────────────────────────

document.getElementById('sel-clear').addEventListener('click', () => {
  document.getElementById('selection-indicator').classList.add('hidden');
  document.getElementById('message-input').value = '';
  chrome.storage.session.remove('selectedText');
});

// ── Generation ───────────────────────────────────────────────────

document.getElementById('btn-generate').addEventListener('click', async () => {
  const message = document.getElementById('message-input').value.trim();
  if (!message) {
    document.getElementById('message-input').focus();
    return;
  }

  const mode = document.getElementById('mode-select').value;
  const btn = document.getElementById('btn-generate');
  const errorBanner = document.getElementById('error-banner');

  btn.disabled = true;
  btn.innerHTML = `
    <svg class="spin" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
    </svg>
    Génération en cours…
  `;
  errorBanner.classList.add('hidden');

  const response = await chrome.runtime.sendMessage({
    type: 'SR_GENERATE',
    payload: { message, mode },
  });

  btn.disabled = false;
  btn.innerHTML = `
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
      <polygon points="13,2 3,14 12,14 11,22 21,10 12,10"/>
    </svg>
    Générer 3 réponses
  `;

  // Session expired mid-use
  if (response?.errorCode === 'UNAUTHENTICATED') {
    showView('view-auth');
    return;
  }

  if (response?.error) {
    errorBanner.textContent = response.error;
    errorBanner.classList.remove('hidden');
    return;
  }

  if (!response?.replies?.length) {
    errorBanner.textContent = 'Aucune réponse générée. Réessaie.';
    errorBanner.classList.remove('hidden');
    return;
  }

  currentReplies = response.replies;
  renderResults(currentReplies);
  showView('view-results');

  // Check if content script has a focused target for injection
  if (activeTabId) {
    chrome.tabs.sendMessage(activeTabId, { type: 'SR_PING' }, (resp) => {
      if (chrome.runtime.lastError || !resp?.hasTarget) {
        document.getElementById('no-inject-hint').classList.remove('hidden');
      }
    });
  } else {
    document.getElementById('no-inject-hint').classList.remove('hidden');
  }
});

// ── Results rendering ────────────────────────────────────────────

function renderResults(replies) {
  const container = document.getElementById('replies-container');
  container.innerHTML = '';

  replies.forEach((reply, i) => {
    const card = document.createElement('div');
    card.className = 'reply-card';
    card.innerHTML = `
      <div class="reply-style">${escapeHtml(reply.style ?? `Réponse ${i + 1}`)}</div>
      <p class="reply-text">${escapeHtml(reply.text ?? '')}</p>
      <div class="reply-actions">
        <button class="btn-reply btn-inject" data-index="${i}">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
          </svg>
          Insérer
        </button>
        <button class="btn-reply btn-copy" data-index="${i}">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
          </svg>
          Copier
        </button>
      </div>
    `;
    container.appendChild(card);
  });

  // Wire inject buttons
  container.querySelectorAll('.btn-inject').forEach((btn) => {
    btn.addEventListener('click', () => {
      const text = currentReplies[+btn.dataset.index]?.text;
      if (!text) return;

      if (activeTabId) {
        chrome.tabs.sendMessage(activeTabId, { type: 'SR_INJECT', text }, (resp) => {
          if (chrome.runtime.lastError || !resp?.injected) {
            // No focused field — fall back to clipboard
            navigator.clipboard.writeText(text).then(() => {
              showToast('Copié dans le presse-papiers');
            });
          } else {
            btn.classList.add('inserted');
            btn.innerHTML = `
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="20,6 9,17 4,12"/>
              </svg>
              Inséré !
            `;
            setTimeout(() => window.close(), 900);
          }
        });
      } else {
        navigator.clipboard.writeText(text).then(() => {
          showToast('Copié dans le presse-papiers');
        });
      }
    });
  });

  // Wire copy buttons
  container.querySelectorAll('.btn-copy').forEach((btn) => {
    btn.addEventListener('click', () => {
      const text = currentReplies[+btn.dataset.index]?.text;
      if (!text) return;

      navigator.clipboard.writeText(text).then(() => {
        btn.classList.add('copied');
        const original = btn.innerHTML;
        btn.innerHTML = `
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20,6 9,17 4,12"/>
          </svg>
          Copié !
        `;
        setTimeout(() => {
          btn.classList.remove('copied');
          btn.innerHTML = original;
        }, 2000);
      });
    });
  });
}

// ── Navigation ───────────────────────────────────────────────────

document.getElementById('btn-back').addEventListener('click', () => {
  showView('view-main');
  document.getElementById('no-inject-hint').classList.add('hidden');
});

document.getElementById('open-app').addEventListener('click', (e) => {
  e.preventDefault();
  openInApp('/dashboard');
});
document.getElementById('open-app-results').addEventListener('click', (e) => {
  e.preventDefault();
  openInApp('/dashboard');
});

// ── Helpers ──────────────────────────────────────────────────────

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function showToast(msg) {
  const existing = document.getElementById('sr-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'sr-toast';
  toast.style.cssText = `
    position: fixed; bottom: 14px; left: 50%; transform: translateX(-50%);
    background: #00674f; color: white; font-size: 11px; font-weight: 600;
    padding: 6px 14px; border-radius: 20px; white-space: nowrap;
    box-shadow: 0 4px 16px rgba(0,103,79,0.4); z-index: 9999;
  `;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2500);
}
