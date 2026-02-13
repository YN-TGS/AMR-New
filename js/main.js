/* =====================================================================
   AMR Asesorías - main.js
   Dependencias: Bootstrap 5 (CDN), Swiper (CDN)
===================================================================== */

'use strict';

/* ------------------------------------------------------------------
   1. PRELOADER
------------------------------------------------------------------ */
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    setTimeout(() => {
      preloader.classList.add('hide');
      setTimeout(() => preloader.remove(), 600);
    }, 800);
  }
});

/* ------------------------------------------------------------------
   2. NAVBAR: scroll effect + active section highlight
------------------------------------------------------------------ */
const navbar = document.getElementById('mainNavbar');

function handleNavbarScroll() {
  if (!navbar) return;
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', handleNavbarScroll, { passive: true });
handleNavbarScroll(); // Run on init

// Cerrar navbar mobile al hacer click en un link
document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
  link.addEventListener('click', () => {
    const collapse = document.getElementById('navbarMain');
    if (collapse && collapse.classList.contains('show')) {
      const bsCollapse = bootstrap.Collapse.getInstance(collapse);
      if (bsCollapse) bsCollapse.hide();
    }
  });
});

/* ------------------------------------------------------------------
   3. ACTIVE NAV LINK por sección visible (Intersection Observer)
------------------------------------------------------------------ */
const sections = document.querySelectorAll('section[id], div[id]');
const navLinks = document.querySelectorAll('.navbar-nav .nav-link[href^="#"]');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${id}`) {
          link.classList.add('active');
        }
      });
    }
  });
}, { threshold: 0.35 });

sections.forEach(s => sectionObserver.observe(s));

/* ------------------------------------------------------------------
   4. SMOOTH SCROLL para links de ancla
------------------------------------------------------------------ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      const offset = 70; // altura navbar
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ------------------------------------------------------------------
   5. REVEAL ON SCROLL (Intersection Observer)
------------------------------------------------------------------ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ------------------------------------------------------------------
   6. BACK TO TOP
------------------------------------------------------------------ */
const backToTop = document.getElementById('backToTop');

if (backToTop) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTop.classList.add('show');
    } else {
      backToTop.classList.remove('show');
    }
  }, { passive: true });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ------------------------------------------------------------------
   7. CARRUSEL DE CLIENTES (marquee CSS — sin dependencias extra)
   Duplica los ítems para loop infinito perfecto
------------------------------------------------------------------ */
function initClientsMarquee() {
  const track = document.querySelector('.clients-track');
  if (!track) return;

  // Los ítems ya están duplicados en el HTML para efecto loop.
  // Solo aseguramos que la animación esté activa.
  track.style.animationPlayState = 'running';
}

initClientsMarquee();

/* ------------------------------------------------------------------
   8. GALERÍA - Swiper + Lightbox
------------------------------------------------------------------ */
function initGallerySwiper() {
  if (typeof Swiper === 'undefined') return;

  new Swiper('.galeria-swiper', {
    slidesPerView: 'auto',
    spaceBetween: 16,
    loop: true,
    grabCursor: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    breakpoints: {
      0:   { spaceBetween: 10 },
      600: { spaceBetween: 14 },
      992: { spaceBetween: 16 },
    }
  });
}

/* ------------------------------------------------------------------
   9. LIGHTBOX para galería
------------------------------------------------------------------ */
const lightbox     = document.getElementById('lightbox');
const lightboxImg  = document.getElementById('lightboxImg');
let galleryImages  = [];
let currentLBIndex = 0;

function openLightbox(src, index) {
  if (!lightbox || !lightboxImg) return;
  lightboxImg.src = src;
  currentLBIndex  = index;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

function navigateLightbox(dir) {
  currentLBIndex = (currentLBIndex + dir + galleryImages.length) % galleryImages.length;
  lightboxImg.src = galleryImages[currentLBIndex];
}

function initLightbox() {
  const galeriaWrap = document.querySelectorAll('.galeria-img-wrap');
  galleryImages = Array.from(galeriaWrap).map(w => w.querySelector('img')?.src || '');

  galeriaWrap.forEach((wrap, index) => {
    wrap.addEventListener('click', () => openLightbox(galleryImages[index], index));
  });

  const closeBtn = document.querySelector('.lightbox-close');
  const prevBtn  = document.querySelector('.lightbox-prev');
  const nextBtn  = document.querySelector('.lightbox-next');

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (prevBtn)  prevBtn.addEventListener('click',  () => navigateLightbox(-1));
  if (nextBtn)  nextBtn.addEventListener('click',  () => navigateLightbox(1));

  // Cerrar al hacer click fuera de la imagen
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  // Teclado
  document.addEventListener('keydown', (e) => {
    if (!lightbox?.classList.contains('active')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
  });
}

/* ------------------------------------------------------------------
   10. INIT al cargar el DOM
------------------------------------------------------------------ */
document.addEventListener('DOMContentLoaded', () => {
  initGallerySwiper();
  initLightbox();
});
