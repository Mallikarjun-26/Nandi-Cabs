(() => {
  const path = location.pathname.replace(/\/$/, '') || '/';
  const main = document.querySelector('#main');
  if (!main) return;

  if (path === '/airport-cabs') {
    main.querySelector('.page-hero .breadcrumb')?.remove();
  }
  if (path === '/local-cabs') {
    main.querySelector('.page-hero .breadcrumb')?.remove();
  }

  if (path === '/about') {
    main.querySelector('.about-values')?.closest('section')?.remove();
  }
  if (path === '/outstation-cabs') {
    [...main.querySelectorAll(':scope > section')].find(section => section.querySelector('.section-head h2')?.textContent.includes('Frequently planned'))?.remove();
    main.querySelectorAll('.faq-item').forEach(item => {
      if (/airport cab/i.test(item.querySelector('.faq-q')?.textContent || '')) item.remove();
    });
  }

  if (path === '/') {
    const eyebrow = main.querySelector('.hero-copy .eyebrow');
    if (eyebrow) eyebrow.textContent = 'Private rides · Bengaluru & beyond';
    const title = main.querySelector('.hero h1');
    if (title) title.innerHTML = 'Bengaluru cabs. <span class="serif">Book direct.</span>';
    const intro = main.querySelector('.hero-copy > p');
    if (intro) intro.textContent = 'Airport, local and outstation rides. Share your trip details for a fare and confirmation.';
    const meta = main.querySelector('.hero-meta');
    if (meta) meta.remove();
    const heroButtons = main.querySelectorAll('.hero-buttons .btn');
    if (heroButtons[0]) heroButtons[0].textContent = 'Book a cab';
    if (heroButtons[1]) { const icon = heroButtons[1].querySelector('.whatsapp-icon')?.cloneNode(true); heroButtons[1].replaceChildren(...(icon ? [icon, document.createTextNode(' WhatsApp')] : [document.createTextNode('WhatsApp')])); }
    const headings = main.querySelectorAll('.section-head h2');
    if (headings[0]) headings[0].textContent = 'Choose a vehicle';
    if (headings[1]) headings[1].textContent = 'Popular routes';
    main.querySelectorAll('.quote-grid').forEach(grid => grid.closest('section')?.remove());
  }

  document.querySelectorAll('.vehicle-card img').forEach(img => {
    const name = img.closest('.vehicle-card')?.querySelector('h3')?.textContent;
    if (name) img.alt = `Photo of ${name}`;
  });
  document.querySelectorAll('.booking-card').forEach(card => {
    const heading = card.querySelector('h2');
    if (heading) heading.textContent = 'Book a cab';
    const intro = card.querySelector(':scope > p');
    if (intro) intro.textContent = 'Enter your trip details. We’ll send them to WhatsApp.';
  });
  document.querySelectorAll('.service-tabs button').forEach(button => {
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-selected', button.classList.contains('active') ? 'true' : 'false');
    button.addEventListener('click', () => {
      const tabs = button.closest('.service-tabs');
      tabs.querySelectorAll('button').forEach(item => {
        const active = item === button;
        item.classList.toggle('active', active);
        item.setAttribute('aria-selected', active ? 'true' : 'false');
      });
    });
  });
  if (window.innerWidth > 760) document.querySelector('.nav-links .mobile-menu-book')?.remove();
})();
