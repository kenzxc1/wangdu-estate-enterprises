const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.primary-nav');

function closeNavigation({ returnFocus = false } = {}) {
  if (!menuToggle || !navigation) return;
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open navigation');
  navigation.classList.remove('is-open');
  if (returnFocus) menuToggle.focus();
}

menuToggle?.addEventListener('click', () => {
  const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isExpanded));
  menuToggle.setAttribute('aria-label', isExpanded ? 'Open navigation' : 'Close navigation');
  navigation?.classList.toggle('is-open', !isExpanded);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuToggle?.getAttribute('aria-expanded') === 'true') {
    closeNavigation({ returnFocus: true });
  }
});

document.addEventListener('click', (event) => {
  if (
    menuToggle?.getAttribute('aria-expanded') === 'true'
    && !navigation?.contains(event.target)
    && !menuToggle.contains(event.target)
  ) {
    closeNavigation();
  }
});

navigation?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => closeNavigation());
});

const filterButtons = document.querySelectorAll('.filter-button');
const propertyCards = document.querySelectorAll('.property-card');

function filterProperties(category) {
  filterButtons.forEach((button) => {
    const active = button.dataset.filter === category;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  propertyCards.forEach((card) => {
    card.hidden = category !== 'All' && card.dataset.category !== category;
  });
}

filterButtons.forEach((button) => {
  button.addEventListener('click', () => filterProperties(button.dataset.filter));
});

document.querySelectorAll('[data-category-link]').forEach((link) => {
  link.addEventListener('click', () => filterProperties(link.dataset.categoryLink));
});

const track = document.querySelector('#portfolio-track');
const previousButton = document.querySelector('#portfolio-prev');
const nextButton = document.querySelector('#portfolio-next');
const countLabel = document.querySelector('#portfolio-count');
const portfolioCards = [...(track?.children ?? [])];
let portfolioIndex = 0;
let touchStartX = null;

function visiblePortfolioCards() {
  return window.matchMedia('(min-width: 681px)').matches ? 3 : 1;
}

function updatePortfolio() {
  if (!track || portfolioCards.length === 0) return;
  const visible = visiblePortfolioCards();
  const maxIndex = Math.max(0, portfolioCards.length - visible);
  portfolioIndex = Math.min(portfolioIndex, maxIndex);
  const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;
  const cardWidth = portfolioCards[0].getBoundingClientRect().width;
  track.style.transform = `translateX(-${portfolioIndex * (cardWidth + gap)}px)`;
  if (previousButton) previousButton.disabled = portfolioIndex === 0;
  if (nextButton) nextButton.disabled = portfolioIndex >= maxIndex;
  if (countLabel) {
    countLabel.textContent = `${String(portfolioIndex + 1).padStart(2, '0')} — ${String(Math.min(portfolioIndex + visible, portfolioCards.length)).padStart(2, '0')}`;
  }
}

previousButton?.addEventListener('click', () => {
  portfolioIndex = Math.max(0, portfolioIndex - 1);
  updatePortfolio();
});
nextButton?.addEventListener('click', () => {
  portfolioIndex = Math.min(portfolioCards.length - visiblePortfolioCards(), portfolioIndex + 1);
  updatePortfolio();
});

// Keep the portfolio's swipe hint functional on touch screens.
track?.addEventListener('touchstart', (event) => {
  touchStartX = event.changedTouches[0]?.clientX ?? null;
}, { passive: true });
track?.addEventListener('touchend', (event) => {
  if (touchStartX === null) return;
  const deltaX = (event.changedTouches[0]?.clientX ?? touchStartX) - touchStartX;
  touchStartX = null;
  if (Math.abs(deltaX) < 40) return;
  portfolioIndex += deltaX < 0 ? 1 : -1;
  const maxIndex = Math.max(0, portfolioCards.length - visiblePortfolioCards());
  portfolioIndex = Math.max(0, Math.min(portfolioIndex, maxIndex));
  updatePortfolio();
}, { passive: true });

window.addEventListener('resize', updatePortfolio);
window.matchMedia('(min-width: 681px)').addEventListener?.('change', updatePortfolio);
updatePortfolio();

const inquiryForm = document.querySelector('#inquiry-form');
const formStatus = document.querySelector('#form-status');
inquiryForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!inquiryForm.reportValidity()) return;
  const data = new FormData(inquiryForm);
  const subject = encodeURIComponent(`Property inquiry from ${data.get('name')}`);
  const body = encodeURIComponent(
    `Name: ${data.get('name')}\nEmail: ${data.get('email')}\nInterested in: ${data.get('interest') || 'Not specified'}\n\n${data.get('message')}`,
  );
  if (formStatus) formStatus.textContent = 'Opening your email app so you can send this inquiry.';
  window.location.href = `mailto:hello@wangduestate.com?subject=${subject}&body=${body}`;
});

const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();
