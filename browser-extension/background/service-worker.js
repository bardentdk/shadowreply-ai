const APP_URL = 'https://airepl.vercel.app';

// ── Context menus ────────────────────────────────────────────────

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: 'sr-root',
      title: 'ShadowReply AI',
      contexts: ['selection'],
    });
    chrome.contextMenus.create({
      id: 'sr-analyze',
      parentId: 'sr-root',
      title: 'Analyser ce message',
      contexts: ['selection'],
    });
    chrome.contextMenus.create({
      id: 'sr-generate',
      parentId: 'sr-root',
      title: 'Générer des réponses (popup)',
      contexts: ['selection'],
    });
    chrome.contextMenus.create({
      id: 'sr-generate-app',
      parentId: 'sr-root',
      title: "Ouvrir dans l'application",
      contexts: ['selection'],
    });
  });
});

chrome.contextMenus.onClicked.addListener((info) => {
  const text = info.selectionText?.trim() || '';
  const encoded = encodeURIComponent(text);

  if (info.menuItemId === 'sr-analyze') {
    chrome.tabs.create({ url: `${APP_URL}/analyze?msg=${encoded}` });
  } else if (info.menuItemId === 'sr-generate-app') {
    chrome.tabs.create({ url: `${APP_URL}/dashboard?tpl_msg=${encoded}` });
  } else if (info.menuItemId === 'sr-generate') {
    // Store text so popup pre-fills the textarea
    chrome.storage.session.set({ selectedText: text });
  }
});

// ── Message listener ─────────────────────────────────────────────

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {

  // ── Auth check ──────────────────────────────────────────────
  if (msg.type === 'SR_CHECK_AUTH') {
    fetch(`${APP_URL}/api/me`, {
      method: 'GET',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((r) => {
        if (!r.ok) {
          sendResponse({ authed: false });
          return;
        }
        return r.json();
      })
      .then((data) => {
        if (!data) return; // already responded above
        if (data.success && data.data) {
          sendResponse({
            authed: true,
            plan: data.data.plan ?? 'free',
            name: data.data.full_name ?? '',
          });
        } else {
          sendResponse({ authed: false });
        }
      })
      .catch(() => sendResponse({ authed: false }));

    return true; // keep channel open for async
  }

  // ── Text selection from content script ─────────────────────
  if (msg.type === 'SR_SELECTION') {
    chrome.storage.session.set({ selectedText: msg.text });
    return false;
  }

  // ── Generate replies ────────────────────────────────────────
  if (msg.type === 'SR_GENERATE') {
    const { message, mode, context } = msg.payload;
    const body = { message, mode };
    if (context) body.context = context;

    fetch(`${APP_URL}/api/generate`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.data) {
          sendResponse({
            replies: data.data.response?.replies ?? [],
            flagged: data.data.response?.flagged ?? false,
            usage: data.data.usage ?? null,
          });
        } else {
          const errorCode = data.error?.code ?? '';
          let errorMsg = data.error?.message ?? 'Erreur lors de la génération.';
          if (errorCode === 'UNAUTHENTICATED') {
            errorMsg = 'Session expirée. Reconnecte-toi pour continuer.';
          } else if (errorCode === 'QUOTA_EXCEEDED') {
            errorMsg = 'Quota quotidien atteint. Reviens demain ou passe Pro.';
          }
          sendResponse({ error: errorMsg, errorCode });
        }
      })
      .catch(() => {
        sendResponse({
          error: 'Connexion impossible. Vérifie ta connexion internet.',
        });
      });

    return true; // keep channel open for async
  }
});
