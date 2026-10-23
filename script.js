// Mobile navigation
const toggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('nav');

toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', String(!open));
  toggle.setAttribute('aria-label', open ? 'Odpri meni' : 'Zapri meni');
  nav.classList.toggle('open', !open);
});

nav.querySelectorAll('a').forEach((link) =>
  link.addEventListener('click', () => {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Odpri meni');
    nav.classList.remove('open');
  })
);

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Project gallery lightbox
const shots = [...document.querySelectorAll('.shot')];
const lightbox = document.getElementById('lightbox');
const lbImg = lightbox.querySelector('img');
const lbCaption = lightbox.querySelector('.lb-caption');
let current = 0;

function showShot(index) {
  current = (index + shots.length) % shots.length;
  const img = shots[current].querySelector('img');
  lbImg.src = img.src;
  lbImg.alt = img.alt;
  lbCaption.textContent = shots[current].querySelector('figcaption').lastChild.textContent;
}

function closeLightbox() {
  lightbox.hidden = true;
  document.body.style.overflow = '';
  shots[current].querySelector('a').focus();
}

shots.forEach((shot, i) =>
  shot.querySelector('a').addEventListener('click', (e) => {
    e.preventDefault();
    showShot(i);
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    lightbox.querySelector('.lb-close').focus();
  })
);

lightbox.querySelector('.lb-close').addEventListener('click', closeLightbox);
lightbox.querySelector('.lb-prev').addEventListener('click', () => showShot(current - 1));
lightbox.querySelector('.lb-next').addEventListener('click', () => showShot(current + 1));
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', (e) => {
  if (lightbox.hidden) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') showShot(current - 1);
  if (e.key === 'ArrowRight') showShot(current + 1);
});

// Reveal on scroll
const revealTargets = document.querySelectorAll('.service, .shot,.values li, .steps li, .section-head, .about-text, .contact-form');
if ('IntersectionObserver' in window) {
  revealTargets.forEach((el) => el.classList.add('reveal'));
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealTargets.forEach((el) => io.observe(el));
}

// Contact form -> opens the visitor's mail client with a prepared message
const form = document.getElementById('contact-form');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  let valid = true;
  form.querySelectorAll('[required]').forEach((field) => {
    const empty = !field.value.trim();
    field.classList.toggle('invalid', empty);
    if (empty) valid = false;
  });
  if (!valid) return;

  const data = new FormData(form);
  const subject = `Povpraševanje: ${data.get('storitev')}`;
  const body = [
    `Ime: ${data.get('ime')}`,
    `Telefon: ${data.get('telefon') || '-'}`,
    `Storitev: ${data.get('storitev')}`,
    '',
    data.get('sporocilo'),
  ].join('\n');

  window.location.href =
    `mailto:koc.gradnje@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});
