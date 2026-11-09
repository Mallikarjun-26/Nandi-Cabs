(() => {
  const seen = new Set();
  const dataSaver = navigator.connection?.saveData || /(^|-)2g$/.test(navigator.connection?.effectiveType || '');
  const prefetchPage = (href) => {
    if (dataSaver || !href) return;
    let url;
    try { url = new URL(href, location.href); } catch { return; }
    if (url.origin !== location.origin || url.pathname === location.pathname || url.protocol !== 'http:' && url.protocol !== 'https:') return;
    url.hash = '';
    const key = url.href;
    if (seen.has(key)) return;
    seen.add(key);
    const link = document.createElement('link');
    link.rel = 'prefetch'; link.as = 'document'; link.href = key;
    document.head.append(link);
  };
  const prefetchRoute = (card) => {
    if (dataSaver || !card || card.dataset.prefetched) return;
    card.dataset.prefetched = 'true';
    const route = window.CAB_DATA?.routes?.find(item => item.slug === card.dataset.routeCard);
    const wiki = window.CAB_WIKIPEDIA;
    if (!route || !wiki) return;
    wiki.summary(route.wiki || route.name).catch(() => {});
    (route.places || []).slice(0, 3).forEach(title => wiki.summary(title).catch(() => {}));
  };
  const handleIntent = event => {
    const target = event.target instanceof Element ? event.target : event.target?.parentElement;
    if (!target) return;
    const link = target.closest('a[href]');
    if (link && !link.hasAttribute('download') && link.target !== '_blank') prefetchPage(link.href);
    prefetchRoute(target.closest('[data-route-card]'));
  };
  document.addEventListener('pointerover', event => {
    if (event.pointerType === 'touch') return;
    if (event.target instanceof Element && event.relatedTarget instanceof Node && event.target.contains(event.relatedTarget)) return;
    handleIntent(event);
  }, { passive: true });
  document.addEventListener('focusin', handleIntent);
})();

