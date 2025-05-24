let currentIndex = 0;

function getSlidesPerView() {
  // Ajusta o número de slides conforme o breakpoints do Tailwind
  if (window.innerWidth >= 768) {
    return 3; // md: 3 slides
  } else {
    return 1; // mobile: 1 slide
  }
}

function updateCarousel() {
  const carousel = document.getElementById('carousel');
  const slidesPerView = getSlidesPerView();
  const slideWidth = 100 / slidesPerView; // Exemplo: 33.33% no desktop, 100% no mobile
  carousel.style.transform = `translateX(-${currentIndex * slideWidth}%)`;

  updateSpacing();
  updateButtons();
}

function nextSlide() {
  const totalSlides = document.querySelectorAll('#carousel > div').length;
  const slidesPerView = getSlidesPerView();
  if (currentIndex < totalSlides - slidesPerView) {
    currentIndex++;
    updateCarousel();
  }
}

function prevSlide() {
  if (currentIndex > 0) {
    currentIndex--;
    updateCarousel();
  }
}

function updateSpacing() {
  const slides = document.querySelectorAll('#carousel > div');
  slides.forEach((slide) => {
    slide.classList.remove('px-4');
  });
  if (slides[currentIndex + 1]) {
    slides[currentIndex + 1].classList.add('px-4');
  }
}

function updateButtons() {
  const totalSlides = document.querySelectorAll('#carousel > div').length;
  const slidesPerView = getSlidesPerView();

  document
    .querySelector('[onclick="prevSlide()"]')
    .classList.toggle('hidden', currentIndex === 0);
  document
    .querySelector('[onclick="nextSlide()"]')
    .classList.toggle('hidden', currentIndex >= totalSlides - slidesPerView);
}

document.addEventListener('DOMContentLoaded', () => {
  updateSpacing();
  updateButtons();
  startAutoPlay();
});

// Atualiza automaticamente ao redimensionar a tela
window.addEventListener('resize', () => {
  // Ajusta o carrossel e botões para o novo tamanho
  updateCarousel();
});

function startAutoPlay() {
  autoPlayInterval = setInterval(() => {
    nextSlide();
  }, 3000); // Troca de slide a cada 3 segundos (3000ms)
}

function stopAutoPlay() {
  clearInterval(autoPlayInterval);
}

const carousel = document.getElementById('carousel');
carousel.addEventListener('mouseenter', stopAutoPlay);
carousel.addEventListener('mouseleave', startAutoPlay);

document.querySelectorAll('[data-review-text]').forEach((review) => {
  const text = review.querySelector('[data-text]');
  const btn = review.querySelector('[data-btn]');

  if (text.scrollHeight > text.clientHeight) {
    btn.classList.remove('hidden');
  }
});

async function openModalFromButton(button) {
  document.getElementById('modalPhotoUri').src = button.dataset.photoUri;
  document.getElementById('modalDisplayName').textContent = button.dataset.displayName;
  document.getElementById('modalRelativePublishTimeDescription').textContent =
    button.dataset.relativePublishTimeDescription;
  document.getElementById('modalText').textContent = button.dataset.text;

  const starsContainer = document.getElementById('modalStars');
  starsContainer.innerHTML = '';

  const rating = button.dataset.rating;
  const starSVG = await getStarSVG();

  for (let i = 0; i < rating; i++) {
    const span = document.createElement('span');
    span.innerHTML = starSVG;
    starsContainer.appendChild(span);
  }

  const modal = document.getElementById('modal');

  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeModal() {
  const modal = document.getElementById('modal');
  modal.classList.remove('flex');
  modal.classList.add('hidden');
}

document.getElementById('closeModal').addEventListener('click', closeModal);

document.getElementById('modalOverlay').addEventListener('click', closeModal);

document.addEventListener('click', function (e) {
  const btn = e.target.closest('[data-btn]');
  if (btn) {
    openModalFromButton(btn);
  }
});

async function getStarSVG() {
  const response = await fetch('images/star.svg');
  return await response.text();
}
