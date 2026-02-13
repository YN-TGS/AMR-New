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
   8. TESTIMONIOS — generación dinámica desde array
   Para agregar un testimonio nuevo: añadir un objeto al array.
   driveId: el ID del archivo en Google Drive (de la URL de compartir)
------------------------------------------------------------------ */
const testimonios = [
  {
    nombre:  'Transportes Arriaza — Miguel Arriaza',
    driveId: '1-R3FVSkN318LEwR_H-WYWPditJ_cFjct'
  },
  {
    nombre:  'Transportes Lizana Cargo — Jesús Lizana',
    driveId: '1W9INwJhdWU8K58EVI3jvi_R4-zAfhw3m'
  },
  // — Agrega nuevos testimonios aquí, siguiendo el mismo formato:
  // { nombre: 'Empresa — Nombre Persona', driveId: 'ID_DEL_VIDEO_EN_DRIVE' },
];

function initTestimonios() {
  const grid = document.getElementById('testimoniosGrid');
  if (!grid) return;

  // Determina el ancho de columna según cantidad de testimonios
  const colClass = testimonios.length === 1 ? 'col-lg-8 col-md-10'
                 : testimonios.length === 2 ? 'col-lg-5 col-md-6'
                 : 'col-lg-4 col-md-6';

  testimonios.forEach((t, i) => {
    const delay = i === 0 ? 'reveal-delay-1' : i === 1 ? 'reveal-delay-2' : 'reveal-delay-3';
    const col = document.createElement('div');
    col.className = `${colClass} reveal ${delay}`;
    col.innerHTML = `
      <div class="testimonio-card">
        <div class="testimonio-header">
          <i class="fa-solid fa-quote-left me-2"></i>${t.nombre}
        </div>
        <div class="testimonio-video">
          <iframe
            src="https://drive.google.com/file/d/${t.driveId}/preview"
            allow="autoplay"
            loading="lazy"
            title="Testimonio ${t.nombre}">
          </iframe>
        </div>
      </div>`;
    grid.appendChild(col);
  });

  // Registrar los nuevos elementos en el observer de reveal
  grid.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
}

/* ------------------------------------------------------------------
   9. GALERÍA - Swiper + Lightbox
------------------------------------------------------------------ */
function initGallerySwiper() {
  if (typeof Swiper === 'undefined') return;

  new Swiper('.galeria-swiper', {
    slidesPerView: 3,
    spaceBetween: 8,
    loop: true,
    grabCursor: true,
    grid: {
      rows: 2,
      fill: 'row',
    },
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    pagination: {
      el: '.galeria-pagination',
      clickable: true,
    },
    breakpoints: {
      0:   { slidesPerView: 1, grid: { rows: 2 }, spaceBetween: 8 },
      576: { slidesPerView: 2, grid: { rows: 2 }, spaceBetween: 8 },
      992: { slidesPerView: 3, grid: { rows: 2 }, spaceBetween: 8 },
      1200:{ slidesPerView: 4, grid: { rows: 2 }, spaceBetween: 8 },
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
   10. TOGGLE LOGOS CLIENTES
------------------------------------------------------------------ */
function toggleLogos() {
  const grid = document.getElementById('logosGrid');
  const btn  = document.getElementById('logosToggleBtn');
  const expanded = grid.classList.toggle('expanded');
  if (expanded) {
    btn.innerHTML = 'Ver menos <i class="fa-solid fa-chevron-up ms-1"></i>';
  } else {
    btn.innerHTML = 'Ver todos los clientes <i class="fa-solid fa-chevron-down ms-1"></i>';
  }
}

/* ------------------------------------------------------------------
   11. FORMULARIO DE CONTACTO — redirige action según área
------------------------------------------------------------------ */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const emails = {
    gerencia:   'antonio.milla@amrasesorias.cl',
    prevencion: 'contacto@amrasesorias.cl',
    finanzas:   'finanzas@amrasesorias.cl'
  };

  form.addEventListener('submit', function(e) {
    const area = document.getElementById('contactArea').value;
    if (emails[area]) {
      form.action = 'https://formsubmit.co/' + emails[area];
    }
  });
}

/* ------------------------------------------------------------------
   11. INIT al cargar el DOM
------------------------------------------------------------------ */
document.addEventListener('DOMContentLoaded', () => {
  initTestimonios();
  initGallerySwiper();
  initLightbox();
  initContactForm();
});
