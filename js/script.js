document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------------------
     Año automático en el footer
  --------------------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------------------------------------------------
     Foto de perfil: si no existe assets/foto.jpg,
     se muestra el placeholder con iniciales.
  --------------------------------------------------------- */
  const photo = document.getElementById('profilePhoto');
  const fallback = document.getElementById('photoFallback');

  if (photo) {
    photo.addEventListener('error', () => {
      photo.classList.add('hidden');
      fallback.classList.add('visible');
    });
    // Si la imagen ya estaba rota antes de registrar el listener
    if (photo.complete && photo.naturalWidth === 0) {
      photo.classList.add('hidden');
      fallback.classList.add('visible');
    }
  }

  /* ---------------------------------------------------------
     Navbar: fondo sólido al hacer scroll + barra de progreso
  --------------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  const scrollProgress = document.getElementById('scrollProgress');
  const toTopBtn = document.getElementById('toTop');

  const onScroll = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    navbar.classList.toggle('scrolled', scrollTop > 40);
    scrollProgress.style.width = `${progress}%`;
    toTopBtn.classList.toggle('visible', scrollTop > 500);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  toTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------------------------------------------------------
     Menú de navegación (versión móvil)
  --------------------------------------------------------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  /* ---------------------------------------------------------
     Resaltar el link activo según la sección visible
  --------------------------------------------------------- */
  const sections = document.querySelectorAll('main section[id], .footer[id]');
  const navItems = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navItems.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(section => sectionObserver.observe(section));

  /* ---------------------------------------------------------
     Animación "reveal" al hacer scroll (formal, sutil)
  --------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------------------------------------------------------
     Contador numérico para las estadísticas de "Acerca de mí"
  --------------------------------------------------------- */
  const statNumbers = document.querySelectorAll('.stat-number');

  const animateCount = (el) => {
    const target = parseInt(el.dataset.count, 10) || 0;
    const duration = 1200;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.floor(eased * target);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target;
      }
    };

    requestAnimationFrame(step);
  };

  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  statNumbers.forEach(el => statObserver.observe(el));

  /* ---------------------------------------------------------
     Formulario de contacto (Web3Forms, sin backend propio)
  --------------------------------------------------------- */
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  if (contactForm) {
    contactForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const submitBtn = contactForm.querySelector('.form-submit');
      const formData = new FormData(contactForm);

      submitBtn.disabled = true;
      submitBtn.textContent = 'Enviando...';
      formStatus.textContent = '';
      formStatus.classList.remove('success', 'error');

      try {
        const response = await fetch(contactForm.action, {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: formData
        });
        const result = await response.json();

        if (response.ok && result.success) {
          formStatus.textContent = '¡Mensaje enviado! Te voy a responder a la brevedad.';
          formStatus.classList.add('success');
          contactForm.reset();
        } else {
          throw new Error(result.message || 'No se pudo enviar el mensaje.');
        }
      } catch (err) {
        formStatus.textContent = 'Hubo un error al enviar el mensaje. Probá de nuevo o escribime directo por mail.';
        formStatus.classList.add('error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Enviar mensaje';
      }
    });
  }

});
