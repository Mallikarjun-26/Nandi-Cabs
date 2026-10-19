(() => {
  const data = window.CAB_DATA;
  if (!data) return;

  document.querySelectorAll('.route-carousel-shell').forEach(shell => {
    const rail = shell.querySelector('[data-route-carousel]');
    const cards = [...shell.querySelectorAll('[data-route-card]')];
    const prev = shell.querySelector('[data-carousel-prev]');
    const next = shell.querySelector('[data-carousel-next]');
    const distance = () => Math.max(rail.clientWidth * .82, (cards[0]?.getBoundingClientRect().width || 260) + 16);
    prev?.addEventListener('click', () => rail.scrollBy({ left: -distance(), behavior: 'smooth' }));
    next?.addEventListener('click', () => rail.scrollBy({ left: distance(), behavior: 'smooth' }));
  });

  const dialog = document.createElement('dialog');
  dialog.className = 'route-detail-dialog';
  dialog.setAttribute('aria-labelledby', 'route-dialog-title');
  dialog.innerHTML = '<div class="route-detail-panel"><button class="route-detail-close" type="button" aria-label="Close route details">×</button><div class="route-detail-content"></div></div>';
  document.body.append(dialog);
  const content = dialog.querySelector('.route-detail-content');
  let lastTrigger = null;
  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const money = value => `₹${Number(value || 0).toLocaleString('en-IN')}`;
  const brief = (value, max = 180) => {
    const text = String(value || '').trim();
    if (text.length <= max) return text;
    const end = text.slice(0, max).lastIndexOf(' ');
    return `${text.slice(0, end > 80 ? end : max).trimEnd()}…`;
  };
  const openRoute = async (route, trigger) => {
    if (!route) return;
    lastTrigger = trigger;
    content.innerHTML = `<div class="route-detail-layout"><div class="route-detail-main"><span class="eyebrow">Bengaluru · ${esc(route.distance)} · ${esc(route.time)}</span><h2 id="route-dialog-title">Bengaluru to ${esc(route.name)}</h2><p class="route-detail-loading">Loading destination details…</p><a class="route-wiki-link" target="_blank" rel="noopener noreferrer" href="${esc(window.CAB_WIKIPEDIA?.articleUrl(route.wiki || route.name) || '#')}">Read on Wikipedia ↗</a><h3>Places to visit</h3><div class="route-detail-places"><p class="route-detail-loading">Loading places…</p></div></div><aside class="route-detail-aside"><img class="route-detail-photo" alt="${esc(route.name)}" hidden><h3>Vehicle rates</h3><ul class="route-rate-list">${(data.vehicles || []).map(vehicle => `<li><strong>${esc(vehicle.name)}</strong><span>${esc(vehicle.seats)} seats · ${money(vehicle.perKm)}/km</span><small>Minimum ${esc(vehicle.minKm)} km/day · allowance ${money(vehicle.allowance)}/day</small></li>`).join('')}</ul></aside></div>`;
    dialog.showModal();
    const wiki = window.CAB_WIKIPEDIA;
    if (!wiki) return;
    const requested = route.wiki || route.name;
    const extract = content.querySelector('.route-detail-loading');
    try {
      const page = await wiki.summary(requested);
      extract.textContent = brief(wiki.shortExtract(page.extract), 260) || page.description || `Explore ${route.name} and its popular attractions.`;
      const article = content.querySelector('.route-wiki-link');
      article.href = page.content_urls?.desktop?.page || wiki.articleUrl(requested);
      const photo = content.querySelector('.route-detail-photo');
      if (page.thumbnail?.source && wiki.relatedPage(requested, page.title)) {
        photo.src = page.thumbnail.source; photo.hidden = false;
      }
    } catch { extract.textContent = 'Wikipedia details are unavailable right now.'; }
    const places = content.querySelector('.route-detail-places');
    places.replaceChildren();
    for (const title of route.places || []) {
      const card = document.createElement('article'); card.className = 'route-detail-place';
      card.innerHTML = `<img alt="${esc(title)}" loading="lazy" hidden><div><h4><a target="_blank" rel="noopener noreferrer">${esc(title)}</a></h4><p>Loading Wikipedia summary…</p><a class="route-place-credit" target="_blank" rel="noopener noreferrer"></a></div>`;
      places.append(card);
      const img = card.querySelector('img'), link = card.querySelector('h4 a'), summary = card.querySelector('p'), credit = card.querySelector('.route-place-credit');
      link.href = wiki.articleUrl(title);
      try {
        const page = await wiki.summary(title);
        if (page.type === 'disambiguation' || !wiki.relatedPage(title, page.title)) { summary.textContent = 'Open the Wikipedia article for details.'; credit.remove(); continue; }
        summary.textContent = brief(wiki.shortExtract(page.extract), 155) || 'Open the Wikipedia article for details.';
        link.href = page.content_urls?.desktop?.page || wiki.articleUrl(title);
        if (page.thumbnail?.source) {
          img.src = page.thumbnail.source; img.hidden = false;
          try { const source = await wiki.fileCredit(page.thumbnail.source); credit.textContent = `Photo: ${source.artist} · ${source.license}`; credit.href = source.fileUrl; }
          catch { credit.textContent = 'Photo: Wikimedia Commons'; credit.href = page.content_urls?.desktop?.page || wiki.articleUrl(title); }
        } else credit.remove();
      } catch { summary.textContent = 'Wikipedia details could not be loaded.'; credit.remove(); }
    }
  };
  const close = () => { dialog.close(); lastTrigger?.focus?.(); };
  dialog.querySelector('.route-detail-close').addEventListener('click', close);
  dialog.addEventListener('click', event => { if (event.target === dialog) close(); });
  document.addEventListener('click', event => {
    if (event.target.closest('.route-photo-credit')) return;
    const card = event.target.closest('[data-route-card]');
    if (!card) return;
    const route = data.routes.find(item => item.slug === card.dataset.routeCard);
    if (event.target.closest('[data-route-link]')) event.preventDefault();
    openRoute(route, card);
  });
  document.addEventListener('keydown', event => {
    const card = event.target.closest?.('[data-route-card]');
    if (card && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); openRoute(data.routes.find(item => item.slug === card.dataset.routeCard), card); }
  });
})();
