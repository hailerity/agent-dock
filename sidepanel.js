// sidepanel.js — reuse popup behavior for the side panel view
(function(){
  const grid = document.getElementById('sidepanel-grid');
  const closeBtn = document.getElementById('sidepanel-close');

  function escapeHtml(text){
     if (!text) return '';
     return text.replace(/[&<>"']/g, function(m){
      return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]);
     });
  }

  function render(items){
    grid.innerHTML = '';
    (items||[]).forEach(item => {
      const el = document.createElement('div');
      el.className = 'fab-item';
      el.tabIndex = 0;
      el.setAttribute('role', 'button');
  const iconHtml = item.icon ? `<img src="${escapeHtml(item.icon)}" alt="${escapeHtml(item.title)}" />` : escapeHtml((item.title && item.title[0]) || '?');
  el.innerHTML = `<div class="fab-item-icon" aria-hidden="true">${iconHtml}</div><div class="fab-item-title">${escapeHtml(item.title)}</div><div class="fab-item-chevron" aria-hidden="true">›</div>`;
      const remove = document.createElement('button');
      remove.className = 'fab-item-remove';
      remove.textContent = '✕';
      remove.title = 'Remove';
      remove.style.marginLeft = '8px';
      el.appendChild(remove);
  el.addEventListener('click', (e) => { if (e.target.closest('.fab-item-remove')) return; chrome.runtime.sendMessage({ type: 'navigate', url: item.url }); });
  el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); el.click(); }});
      remove.addEventListener('click', (e) => { e.stopPropagation(); removeItem(item.id); });
      el.tabIndex = 0;
      el.setAttribute('role','listitem');
      el.setAttribute('aria-label', item.title);
      el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); el.click(); } });
      grid.appendChild(el);
    });
  }

  function removeItem(id){
    chrome.storage.local.get(['fab_items'], (res) => {
      const items = (res && res.fab_items) ? res.fab_items.filter(it => it.id !== id) : [];
      chrome.storage.local.set({ fab_items: items }, () => render(items));
    });
  }

  chrome.storage.local.get(['fab_items'], (res) => render(res && res.fab_items ? res.fab_items : []));
  chrome.storage.onChanged.addListener((changes, area) => { if (area === 'local' && changes.fab_items) render(changes.fab_items.newValue || []);} );

  if (closeBtn) closeBtn.addEventListener('click', () => {
    // Try using sidePanel API to close, otherwise fallback to window close
    if (chrome.sidePanel && chrome.sidePanel.hide) chrome.sidePanel.hide();
    else window.close();
  });
})();
