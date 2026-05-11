/* ShadowReply AI — Floating widget + injection handler (Shadow DOM isolated) */
(function () {
  'use strict';

  const APP_URL = 'https://airepl.vercel.app';
  const STORAGE_KEY = 'sr_widget_hidden';

  // Don't inject on shadowreply.ai itself
  if (location.hostname.includes('airepl.vercel.app')) return;
  // Don't double-inject
  if (document.getElementById('shadowreply-widget-host')) return;

  // --- Track the last focused editable element (for injection) ---
  let lastFocusedElement = null;

  document.addEventListener(
    'focusin',
    (e) => {
      const el = e.target;
      if (
        el instanceof HTMLInputElement ||
        el instanceof HTMLTextAreaElement ||
        (el instanceof HTMLElement && el.isContentEditable)
      ) {
        lastFocusedElement = el;
      }
    },
    true // capture phase — fires before the element gets focus
  );

  // --- Inject text into the tracked element ---
  function injectText(text) {
    const el = lastFocusedElement;
    if (!el || !document.contains(el)) return false;

    try {
      el.focus();

      if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
        const start = el.selectionStart ?? el.value.length;
        const end = el.selectionEnd ?? el.value.length;
        el.value = el.value.slice(0, start) + text + el.value.slice(end);
        el.selectionStart = el.selectionEnd = start + text.length;
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      } else if (el.isContentEditable) {
        // execCommand handles cursor positioning in rich text editors
        if (document.execCommand) {
          document.execCommand('insertText', false, text);
        } else {
          const sel = window.getSelection();
          const range = sel?.rangeCount
            ? sel.getRangeAt(0)
            : (() => {
                const r = document.createRange();
                r.selectNodeContents(el);
                r.collapse(false);
                return r;
              })();
          range.deleteContents();
          range.insertNode(document.createTextNode(text));
          range.collapse(false);
          sel?.removeAllRanges();
          sel?.addRange(range);
          el.dispatchEvent(new InputEvent('input', { bubbles: true }));
        }
      }
      return true;
    } catch {
      return false;
    }
  }

  // --- Message listener from popup ---
  chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (msg.type === 'SR_INJECT') {
      const ok = injectText(msg.text);
      sendResponse({ injected: ok });
      return false;
    }

    if (msg.type === 'SR_PING') {
      // Let popup know whether we have a focused target
      sendResponse({ hasTarget: lastFocusedElement !== null && document.contains(lastFocusedElement) });
      return false;
    }
  });

  // ---------------------------------------------------------------
  // Floating widget
  // ---------------------------------------------------------------

  const isHidden = localStorage.getItem(STORAGE_KEY) === 'true';
  if (isHidden) return;

  // --- Shadow DOM host ---
  const host = document.createElement('div');
  host.id = 'shadowreply-widget-host';
  host.style.cssText =
    'position:fixed;bottom:20px;right:20px;z-index:2147483647;all:initial;';
  document.body.appendChild(host);

  const shadow = host.attachShadow({ mode: 'closed' });

  // --- Styles ---
  const style = document.createElement('style');
  style.textContent = `
    *{box-sizing:border-box;margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;}

    .sr-fab {
      width: 48px; height: 48px; border-radius: 50%;
      background: linear-gradient(135deg, #00674f, #00956f);
      border: none; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 4px 20px rgba(0,103,79,0.45);
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .sr-fab:hover {
      transform: scale(1.08);
      box-shadow: 0 6px 28px rgba(0,103,79,0.6);
    }
    .sr-fab svg { width: 22px; height: 22px; }

    .sr-panel {
      position: absolute; bottom: 60px; right: 0;
      width: 290px;
      background: #0c1410;
      border: 1px solid rgba(0,103,79,0.3);
      border-radius: 16px;
      box-shadow: 0 16px 48px rgba(0,0,0,0.5);
      overflow: hidden; display: none;
      animation: sr-slide-up 0.2s ease-out;
    }
    .sr-panel.open { display: block; }

    @keyframes sr-slide-up {
      from { opacity:0; transform: translateY(8px); }
      to   { opacity:1; transform: translateY(0); }
    }

    .sr-panel-header {
      padding: 12px 14px;
      display: flex; align-items: center; justify-content: space-between;
      border-bottom: 1px solid rgba(255,255,255,0.07);
      background: rgba(0,103,79,0.08);
    }
    .sr-logo { font-size: 13px; font-weight: 700; color: #f0f5f2; }
    .sr-logo span { color: #00956f; }
    .sr-close {
      background: none; border: none; color: #6b8c7e;
      cursor: pointer; font-size: 16px; line-height: 1;
      padding: 2px 4px; border-radius: 4px;
    }
    .sr-close:hover { color: #f0f5f2; background: rgba(255,255,255,0.05); }

    .sr-selection-bar {
      padding: 10px 14px;
      background: rgba(0,103,79,0.06);
      border-bottom: 1px solid rgba(0,103,79,0.15);
      display: none;
    }
    .sr-selection-bar.visible { display: block; }
    .sr-selection-label {
      font-size: 10px; font-weight: 600;
      text-transform: uppercase; letter-spacing: 0.05em;
      color: #00674f; margin-bottom: 4px;
    }
    .sr-selection-text {
      font-size: 11px; color: #9ab3a8; font-style: italic;
      overflow: hidden; display: -webkit-box;
      -webkit-line-clamp: 2; -webkit-box-orient: vertical;
      margin-bottom: 8px;
    }
    .sr-selection-actions { display: flex; gap: 6px; }

    .sr-btn {
      flex: 1; padding: 5px 8px; border-radius: 7px;
      font-size: 11px; font-weight: 600; cursor: pointer;
      border: none; transition: all 0.15s;
      display: flex; align-items: center; justify-content: center;
    }
    .sr-btn-primary { background: #00674f; color: white; }
    .sr-btn-primary:hover { background: #00956f; }
    .sr-btn-secondary { background: rgba(255,255,255,0.07); color: #f0f5f2; }
    .sr-btn-secondary:hover { background: rgba(255,255,255,0.12); }

    .sr-links { padding: 8px; }
    .sr-link {
      display: flex; align-items: center; gap: 8px;
      padding: 8px 10px; border-radius: 10px;
      text-decoration: none; transition: background 0.15s; cursor: pointer;
    }
    .sr-link:hover { background: rgba(255,255,255,0.05); }
    .sr-link-icon { font-size: 15px; width: 24px; text-align: center; }
    .sr-link-name { font-size: 12px; font-weight: 600; color: #f0f5f2; }
    .sr-link-desc { font-size: 10px; color: #6b8c7e; }

    .sr-footer {
      padding: 8px 14px 10px;
      border-top: 1px solid rgba(255,255,255,0.07);
    }
    .sr-hide-btn {
      background: none; border: none; color: #6b8c7e;
      font-size: 11px; cursor: pointer;
      text-decoration: underline; text-underline-offset: 2px;
    }
    .sr-hide-btn:hover { color: #9ab3a8; }
  `;

  // --- HTML ---
  const wrapper = document.createElement('div');
  wrapper.innerHTML = `
    <div class="sr-panel" id="sr-panel">
      <div class="sr-panel-header">
        <div class="sr-logo">Shadow<span>Reply</span> AI</div>
        <button class="sr-close" id="sr-panel-close" title="Fermer">✕</button>
      </div>

      <div class="sr-selection-bar" id="sr-selection-bar">
        <div class="sr-selection-label">Texte sélectionné</div>
        <div class="sr-selection-text" id="sr-sel-text"></div>
        <div class="sr-selection-actions">
          <button class="sr-btn sr-btn-primary" id="sr-sel-analyze">🔍 Analyser</button>
          <button class="sr-btn sr-btn-secondary" id="sr-sel-generate">⚡ Générer</button>
        </div>
      </div>

      <div class="sr-links">
        ${[
          ['dashboard', '⚡', 'Générer une réponse', '3 styles en 3 secondes'],
          ['analyze', '🔍', 'Analyser un message', 'Comprendre l\'intention'],
          ['reformulate', '✍️', 'Reformuler', 'Améliorer ton texte'],
          ['templates', '📚', 'Templates', '43 scénarios prêts'],
        ].map(([path, icon, name, desc]) => `
          <div class="sr-link" data-path="${path}">
            <div class="sr-link-icon">${icon}</div>
            <div>
              <div class="sr-link-name">${name}</div>
              <div class="sr-link-desc">${desc}</div>
            </div>
          </div>
        `).join('')}
      </div>

      <div class="sr-footer">
        <button class="sr-hide-btn" id="sr-hide-widget">Masquer le widget</button>
      </div>
    </div>

    <button class="sr-fab" id="sr-fab" title="ShadowReply AI">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="white" stroke-width="1.5"/>
        <circle cx="8" cy="12" r="1.5" fill="white"/>
        <circle cx="12" cy="12" r="1.5" fill="white"/>
        <circle cx="16" cy="12" r="1.5" fill="white"/>
      </svg>
    </button>
  `;

  shadow.appendChild(style);
  shadow.appendChild(wrapper);

  // --- Widget logic ---
  let panelOpen = false;
  let selectedText = '';

  const fab = shadow.getElementById('sr-fab');
  const panel = shadow.getElementById('sr-panel');

  function openInApp(path, params = {}) {
    const url = new URL('/' + path, APP_URL);
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    window.open(url.toString(), '_blank', 'noopener');
  }

  function togglePanel() {
    panelOpen = !panelOpen;
    panel.classList.toggle('open', panelOpen);
    updateSelectionBar();
  }

  function updateSelectionBar() {
    const bar = shadow.getElementById('sr-selection-bar');
    const selText = shadow.getElementById('sr-sel-text');
    if (selectedText && selectedText.length > 3) {
      selText.textContent =
        selectedText.length > 100 ? selectedText.slice(0, 100) + '…' : selectedText;
      bar.classList.add('visible');
    } else {
      bar.classList.remove('visible');
    }
  }

  fab.addEventListener('click', (e) => {
    e.stopPropagation();
    togglePanel();
  });

  shadow.getElementById('sr-panel-close').addEventListener('click', () => {
    panelOpen = false;
    panel.classList.remove('open');
  });

  shadow.querySelectorAll('.sr-link[data-path]').forEach((el) => {
    el.addEventListener('click', () => {
      openInApp(el.dataset.path);
      panelOpen = false;
      panel.classList.remove('open');
    });
  });

  shadow.getElementById('sr-sel-analyze').addEventListener('click', () => {
    openInApp('analyze', selectedText ? { msg: selectedText } : {});
  });
  shadow.getElementById('sr-sel-generate').addEventListener('click', () => {
    openInApp('dashboard', selectedText ? { tpl_msg: selectedText } : {});
  });

  shadow.getElementById('sr-hide-widget').addEventListener('click', () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    host.remove();
  });

  document.addEventListener('click', () => {
    if (panelOpen) {
      panelOpen = false;
      panel.classList.remove('open');
    }
  });

  document.addEventListener('mouseup', () => {
    const sel = window.getSelection()?.toString().trim() || '';
    if (sel.length > 3) {
      selectedText = sel;
      try {
        chrome.runtime.sendMessage({ type: 'SR_SELECTION', text: sel });
      } catch (_) { /* extension context may be invalid */ }
      if (panelOpen) updateSelectionBar();
    }
  });
})();
