const APP_URL = 'https://shadowreply.ai';

function openTab(path, params = {}) {
  const url = new URL(path, APP_URL);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  chrome.tabs.create({ url: url.toString() });
  window.close();
}

// Quick action links
document.querySelectorAll('.action-item[data-url]').forEach((el) => {
  el.addEventListener('click', () => openTab('/' + el.dataset.url));
});

// Open app button
document.getElementById('open-app').addEventListener('click', (e) => {
  e.preventDefault();
  openTab('/dashboard');
});

// Selection action buttons
document.getElementById('btn-analyze').addEventListener('click', () => {
  chrome.storage.session.get('selectedText', ({ selectedText }) => {
    if (selectedText) openTab('/analyze', { msg: selectedText });
    else openTab('/analyze');
  });
});

document.getElementById('btn-generate').addEventListener('click', () => {
  chrome.storage.session.get('selectedText', ({ selectedText }) => {
    if (selectedText) openTab('/dashboard', { tpl_msg: selectedText });
    else openTab('/dashboard');
  });
});

// Check for selected text from active tab
chrome.storage.session.get('selectedText', ({ selectedText }) => {
  const section = document.getElementById('selection-section');
  const preview = document.getElementById('selection-preview');
  if (selectedText && selectedText.trim().length > 3) {
    const trimmed = selectedText.trim();
    preview.textContent = trimmed.length > 120 ? trimmed.slice(0, 120) + '…' : trimmed;
    section.classList.remove('hidden');
  }
});

// Check login status via storage
chrome.storage.local.get('sr_plan', ({ sr_plan }) => {
  const badge = document.getElementById('status-badge');
  if (sr_plan === 'pro' || sr_plan === 'enterprise') {
    badge.textContent = 'Pro';
    badge.className = 'status-badge status-pro';
  }
});
