(() => {
  const cfg = window.CAB_CONFIG || {};
  const data = window.CAB_DATA || {};
  const path = decodeURI(location.pathname).replace(/\/$/, '') || '/';
  const parts = path.split('/').filter(Boolean);
  const route = data.routes?.find(item => item.slug === parts[1]);
  const page = route ? 'route' : parts[0] || 'home';
  const brand = cfg.brand || 'Nandi Cabs';
  const origin = String(cfg.canonicalOrigin || '').replace(/\/$/, '');
  const titleMap = {
    home: `Bengaluru Cab Service & Taxi Booking | ${brand}`,
    'airport-cabs': `Bengaluru Airport Cab Booking | ${brand}`,
    'local-cabs': `Local Cab Service in Bengaluru | ${brand}`,
    'outstation-cabs': `Outstation Cabs from Bengaluru | ${brand}`,
    routes: `Popular Cab Routes from Bengaluru | ${brand}`,
    about: `About ${brand} | Bengaluru Cab Service`,
    contact: `Contact ${brand} | Bengaluru Cab Booking`,
    terms: `Booking Terms | ${brand}`,
    privacy: `Privacy Policy | ${brand}`
  };
  const descriptions = {
    home: 'Book Bengaluru airport cabs, local taxis and outstation rides. Compare vehicles and request a clear fare directly with our team.',
    'airport-cabs': 'Request a Bengaluru airport cab to or from Kempegowda International Airport. Share your pickup time, flight details and passenger count.',
    'local-cabs': 'Book a local cab in Bengaluru for errands, meetings or a full day. Compare 4-hour and 8-hour vehicle packages and request a fare.',
    'outstation-cabs': 'Arrange a one-way or round-trip outstation cab from Bengaluru. Compare vehicle rates and confirm trip details directly.',
    routes: 'Browse popular cab routes from Bengaluru, including Mysore, Coorg, Ooty, Goa, Tirupati and Chennai. Check trip estimates and places to visit.',
    about: `${brand} helps passengers arrange airport, local and outstation cab rides from Bengaluru with trip and fare details agreed in advance.`,
    contact: 'Contact the Bengaluru cab team to ask about airport transfers, local rides, outstation routes, vehicle availability and fares.',
    terms: 'Review the booking, fare confirmation, payment and cancellation terms for cab journeys arranged through the Bengaluru service.',
    privacy: 'Read how information shared in a cab booking enquiry is used to coordinate your trip and respond to your request.'
  };
  const title = route ? `Bengaluru to ${route.name} Cab | ${brand}` : (titleMap[page] || titleMap.home);
  const firstPlaces = route?.places?.slice(0, 3).join(', ');
  const description = route
    ? `Book a Bengaluru to ${route.name} cab (${route.distance.replace(/^about /, '')}, ${route.time.replace(/^about /, '')}). ${firstPlaces ? `Explore ${firstPlaces}.` : route.note}`.slice(0, 158).trim()
    : (descriptions[page] || descriptions.home);
  const setMeta = (selector, attr, value, create) => {
    let element = document.head.querySelector(selector);
    if (!element && create) { element = document.createElement('meta'); Object.entries(create).forEach(([key, val]) => element.setAttribute(key, val)); document.head.append(element); }
    if (element) element.setAttribute(attr, value);
  };
  document.title = title;
  setMeta('meta[name="description"]', 'content', description, { name: 'description' });
  setMeta('meta[property="og:type"]', 'content', 'website', { property: 'og:type' });
  setMeta('meta[property="og:title"]', 'content', title, { property: 'og:title' });
  setMeta('meta[property="og:description"]', 'content', description, { property: 'og:description' });
  setMeta('meta[name="twitter:card"]', 'content', 'summary_large_image', { name: 'twitter:card' });
  setMeta('meta[name="twitter:title"]', 'content', title, { name: 'twitter:title' });
  setMeta('meta[name="twitter:description"]', 'content', description, { name: 'twitter:description' });
  let canonical = document.head.querySelector('link[rel="canonical"]');
  if (origin && /^https?:\/\//i.test(origin) && !/example\.com/i.test(origin)) {
    if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.append(canonical); }
    canonical.href = `${origin}${path === '/' ? '/' : `${path}/`}`;
    setMeta('meta[property="og:url"]', 'content', canonical.href, { property: 'og:url' });
    setMeta('meta[property="og:image"]', 'content', `${origin}/assets/home-hero-premium.jpg`, { property: 'og:image' });
  } else canonical?.remove();

  const addJsonLd = (name, value) => {
    document.getElementById(name)?.remove();
    const script = document.createElement('script');
    script.id = name; script.type = 'application/ld+json'; script.textContent = JSON.stringify(value);
    document.head.append(script);
  };
  const business = {
    '@context': 'https://schema.org', '@type': 'TaxiService', name: brand,
    description: 'Airport transfers, local cabs and outstation journeys arranged from Bengaluru.',
    areaServed: { '@type': 'City', name: 'Bengaluru' },
    provider: {
      '@type': 'LocalBusiness', name: brand,
      address: { '@type': 'PostalAddress', addressLocality: 'Bengaluru', addressRegion: 'Karnataka', addressCountry: 'IN' },
      ...(cfg.phoneLink ? { telephone: cfg.phoneLink } : {}),
      ...(origin && !/example\.com/i.test(origin) ? { url: `${origin}/` } : {})
    },
    serviceType: ['Airport transfers', 'Local cab hire', 'Outstation cab journeys']
  };
  addJsonLd('cab-business-schema', business);
  const serviceTypes = {
    'airport-cabs': 'Bengaluru airport taxi transfers',
    'local-cabs': 'Local cab hire in Bengaluru',
    'outstation-cabs': 'Outstation cab journeys from Bengaluru'
  };
  if (serviceTypes[page]) addJsonLd('cab-service-schema', {
    '@context': 'https://schema.org', '@type': 'Service', name: title,
    serviceType: serviceTypes[page], description, areaServed: { '@type': 'City', name: 'Bengaluru' }, provider: business.provider
  });
  if (origin && !/example\.com/i.test(origin)) {
    const crumbPages = [{ name: 'Home', path: '/' }];
    if (route || page === 'routes') crumbPages.push({ name: 'Routes', path: '/routes/' });
    else if (page !== 'home') {
      const breadcrumbNames = { 'airport-cabs': 'Airport transfers', 'local-cabs': 'Local by the hour', 'outstation-cabs': 'Outstation journeys', about: 'About', contact: 'Contact', terms: 'Booking terms', privacy: 'Privacy' };
      crumbPages.push({ name: breadcrumbNames[page] || page, path: `${path}/` });
    }
    if (route) crumbPages.push({ name: route.name, path: `${path}/` });
    addJsonLd('cab-breadcrumb-schema', {
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: crumbPages.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.name, item: `${origin}${item.path}` }))
    });
  }
  const faqItems = [...document.querySelectorAll('.faq-item')].map(item => ({
    question: item.querySelector('.faq-q')?.textContent.replace(/[+−]/g, '').trim(),
    answer: item.querySelector('.faq-a')?.textContent.trim()
  })).filter(item => item.question && item.answer);
  if (faqItems.length) addJsonLd('cab-faq-schema', {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: faqItems.map(item => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } }))
  });
  const mobileCta = document.querySelector('.mobile-cta');
  const mobileCtaBooking = mobileCta?.querySelector('.mobile-cta-book');
  const bookingForm = document.querySelector('#quick-book');
  const heroActions = document.querySelector('.hero-buttons');
  const mobileCtaTargets = [bookingForm, heroActions].filter(Boolean);
  if (mobileCtaBooking && mobileCtaTargets.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(() => {
      const visible = mobileCtaTargets.some(target => {
        const rect = target.getBoundingClientRect();
        return rect.bottom > 0 && rect.top < window.innerHeight;
      });
      mobileCtaBooking.classList.toggle('cta-hidden', visible);
      mobileCtaBooking.setAttribute('aria-hidden', visible ? 'true' : 'false');
    }, { threshold: 0.02 });
    mobileCtaTargets.forEach(target => observer.observe(target));
  }
})();
