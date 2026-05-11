const APP_URL = 'https://shadowreply.ai';

// --- Context menus ---
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
      title: '🔍 Analyser ce message',
      contexts: ['selection'],
    });
    chrome.contextMenus.create({
      id: 'sr-generate',
      parentId: 'sr-root',
      title: '⚡ Générer des réponses',
      contexts: ['selection'],
    });
    chrome.contextMenus.create({
      id: 'sr-reformulate',
      parentId: 'sr-root',
      title: '✍️ Reformuler ce texte',
      contexts: ['selection'],
    });
  });
});

chrome.contextMenus.onClicked.addListener((info) => {
  const text = info.selectionText?.trim() || '';
  const encoded = encodeURIComponent(text);

  const routes = {
    'sr-analyze': `${APP_URL}/analyze?msg=${encoded}`,
    'sr-generate': `${APP_URL}/dashboard?tpl_msg=${encoded}`,
    'sr-reformulate': `${APP_URL}/reformulate?draft=${encoded}`,
  };

  const url = routes[info.menuItemId];
  if (url) {
    chrome.tabs.create({ url });
  }
});

// --- Store selected text for popup ---
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'SR_SELECTION') {
    chrome.storage.session.set({ selectedText: msg.text });
  }
});
