const APP_URL = 'https://shadowreply-ai.vercel.app';

let activeTabId = null;
let currentReplies = [];

// Get the active tab once
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  if (tabs[0]) activeTabId = tabs[0].id;
});

// --- View helpers ---
function showView(id) {
  document.querySelectorAll('.view').forEach((v) => v.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
}

function openInApp(path) {
  chrome.tabs.create({ url: APP_URL + path });
  window.close();
}

// --- Init: populate textarea with selected text if available ---
chrome.storage.session.get(['selectedText', 'autoGenerate'], ({ selectedText, autoGenerate }) => {
  if (selectedText?.trim().length > 3) {
    const text = selectedText.trim();
    document.getElementById('message-input').value = text;

    // Show the selection indicator
    const indicator = document.getElementById('selection-indicator');
    const preview = document.getElementById('sel-preview');
    preview.textContent = text.length > 60 ? text.slice(0, 60) + '…' : text;
    indicator.classList.remove('hidden');
  }

  // Clear the autoGenerate flag
  if (autoGenerate) {
    chrome.storage.session.remove('autoGenerate');
  }
});

// Clear selection indicator
document.getElementById('sel-clear').addEventListener('click', () => {
  document.getElementById('selection-indicator').classList.add('hidden');
  document.getElementById('message-input').value = '';
  chrome.storage.session.remove('selectedText');
});

// --- Plan badge ---
chrome.storage.local.get('sr_plan', ({ sr_plan }) => {
  const badge = document.getElementById('status-badge');
  if (sr_plan === 'pro' || sr_plan === 'enterprise') {
    badge.textContent = 'Pro';
    badge.className = 'status-badge status-pro';
  }
});

// --- Generate ---
document.getElementById('btn-generate').addEventListener('click', async () => {
  const message = document.getElementById('message-input').value.trim();
  if (!message) {
    document.getElementById('message-input').focus();
    return;
  }

  const mode = document.getElementById('mode-select').value;
  const btn = document.getElementById('btn-generate');
  const errorBanner = document.getElementById('error-banner');

  // Show loading state
  btn.disabled = true;
  btn.innerHTML = `
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
      style="animation: spin 1s linear infinite">
      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
    </svg>
    Génération en cours…
  `;
  errorBanner.classList.add('hidden');

  const response = await chrome.runtime.sendMessage({
    type: 'SR_GENERATE',
    payload: { message, mode },
  });

  // Reset button
  btn.disabled = false;
  btn.innerHTML = `
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
      <polygon points="13,2 3,14 12,14 11,22 21,10 12,10"/>
    </svg>
    Générer 3 réponses
  `;

  if (response.error) {
    errorBanner.textContent = response.error;
    errorBanner.classList.remove('hidden');
    return;
  }

  if (!response.replies?.length) {
    errorBanner.textContent = 'Aucune réponse générée. Réessaie.';
    errorBanner.classList.remove('hidden');
    return;
  }

  currentReplies = response.replies;
  renderResults(currentReplies);
  showView('view-results');

  // Check if injection is likely to work (ask content script)
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

// --- Render reply cards ---
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

  // Wire up inject buttons
  container.querySelectorAll('.btn-inject').forEach((btn) => {
    btn.addEventListener('click', () => {
      const text = currentReplies[+btn.dataset.index]?.text;
      if (!text) return;

      if (activeTabId) {
        chrome.tabs.sendMessage(activeTabId, { type: 'SR_INJECT', text }, (resp) => {
          if (chrome.runtime.lastError || !resp?.injected) {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(text).then(() => {
              showToast('Inséré dans le presse-papiers (aucun champ détecté)');
            });
          } else {
            window.close();
          }
        });
      } else {
        navigator.clipboard.writeText(text).then(() => {
          showToast('Copié dans le presse-papiers');
        });
      }
    });
  });

  // Wire up copy buttons
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

// --- Back button ---
document.getElementById('btn-back').addEventListener('click', () => {
  showView('view-main');
  document.getElementById('no-inject-hint').classList.add('hidden');
});

// --- Footer links ---
document.getElementById('open-app').addEventListener('click', (e) => {
  e.preventDefault();
  openInApp('/dashboard');
});
document.getElementById('open-app-results').addEventListener('click', (e) => {
  e.preventDefault();
  openInApp('/dashboard');
});

// --- Helpers ---
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
    animation: sr-fade-in 0.2s ease-out;
  `;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2500);
}
