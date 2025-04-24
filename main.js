document.addEventListener('DOMContentLoaded', function() {
    // ========== Menú Hamburguesa ==========
    const menuBtn = document.querySelector('.menu-hamburguesa');
    const navLinks = document.querySelector('.enlaces');
    const body = document.body;

    if (menuBtn && navLinks) {
        const toggleMenu = () => {
            menuBtn.classList.toggle('active');
            navLinks.classList.toggle('active');
            body.classList.toggle('no-scroll');
        };

        menuBtn.addEventListener('click', toggleMenu);

        // Cerrar menú al hacer clic en un enlace
        document.querySelectorAll('.enlaces a').forEach(link => {
            link.addEventListener('click', () => {
                menuBtn.classList.remove('active');
                navLinks.classList.remove('active');
                body.classList.remove('no-scroll');
            });
        });
    }

    // ========== Smooth Scroll ==========
    const smoothScroll = (e) => {
        e.preventDefault();
        const targetId = e.currentTarget.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const headerHeight = document.querySelector('.encabezado')?.offsetHeight || 80;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    };

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', smoothScroll);
    });

    // ========== Efecto Header al Scrollear ==========
    const header = document.querySelector('.encabezado');
    if (header) {
        let lastScroll = 0;
        const headerHeight = header.offsetHeight;
        
        const handleScroll = () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll <= headerHeight) {
                header.style.removeProperty('transform');
                header.style.removeProperty('box-shadow');
            } else if (currentScroll > lastScroll && currentScroll > headerHeight) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
                header.style.boxShadow = '0 2px 15px rgba(0, 0, 0, 0.1)';
            }
            
            lastScroll = currentScroll;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    // ========== Filtrado de Galería ==========
    const filterButtons = document.querySelectorAll('.filtro-btn');
    const galleryItems = document.querySelectorAll('.galeria__item');

    if (filterButtons.length && galleryItems.length) {
        const filterGallery = (filterValue) => {
            galleryItems.forEach(item => {
                const matchesFilter = filterValue === 'todos' || item.dataset.categoria === filterValue;
                
                item.style.transition = 'opacity 0.3s ease';
                item.style.opacity = '0';
                
                setTimeout(() => {
                    item.style.display = matchesFilter ? 'block' : 'none';
                    setTimeout(() => {
                        item.style.opacity = matchesFilter ? '1' : '0';
                    }, 50);
                }, 300);
            });
        };

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                filterGallery(button.dataset.filter);
            });
        });
    }

    // ========== VER MÁS PROYECTOS ==========
    const verMasBtn = document.getElementById('ver-mas-galeria');
    const proyectosOcultos = document.querySelectorAll('.galeria__item.galeria__item--oculto');

    if (verMasBtn && proyectosOcultos.length) {
        const proyectosPorCarga = 2;
        let proyectosCargados = 0;

        const cargarMasProyectos = () => {
            verMasBtn.innerHTML = '<span class="boton__texto">Cargando...</span><span class="boton__icono"></span>';
            verMasBtn.classList.add('cargando');
            verMasBtn.disabled = true;
            
            const proyectosAMostrar = Array.from(proyectosOcultos)
                .slice(proyectosCargados, proyectosCargados + proyectosPorCarga);
            
            proyectosAMostrar.forEach((proyecto, index) => {
                setTimeout(() => {
                    proyecto.classList.remove('galeria__item--oculto');
                    proyecto.style.animation = `fadeIn 0.5s ease ${index * 0.2}s forwards`;
                }, index * 100);
            });

            proyectosCargados += proyectosAMostrar.length;
            
            // Ocultar botón si no hay más proyectos
            if (proyectosCargados >= proyectosOcultos.length) {
                setTimeout(() => {
                    verMasBtn.style.display = 'none';
                }, 500);
            }
            
            setTimeout(() => {
                verMasBtn.innerHTML = '<span class="boton__texto">Ver Más Proyectos</span><span class="boton__icono">+</span>';
                verMasBtn.classList.remove('cargando');
                verMasBtn.disabled = false;
            }, 300);
        };

        verMasBtn.addEventListener('click', cargarMasProyectos);
    }

    // ========== Formulario de Contacto ==========
    const contactForm = document.getElementById('form-contacto');
    if (contactForm) {
        const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

        const handleSubmit = (e) => {
            e.preventDefault();
            
            const nombre = contactForm.querySelector('#nombre').value.trim();
            const email = contactForm.querySelector('#email').value.trim();
            const mensaje = contactForm.querySelector('#mensaje').value.trim();
            
            if (!nombre || !email || !mensaje) {
                mostrarNotificacion('Por favor complete todos los campos requeridos', 'error');
                return;
            }
            
            if (!validateEmail(email)) {
                mostrarNotificacion('Por favor ingrese un email válido', 'error');
                return;
            }
            
            // Simular envío
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Enviando...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                mostrarNotificacion('Mensaje enviado con éxito. Nos pondremos en contacto pronto.', 'success');
                contactForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1500);
        };

        contactForm.addEventListener('submit', handleSubmit);
    }

    // ========== Funciones Auxiliares ==========
    function mostrarNotificacion(mensaje, tipo) {
        const notificacion = document.createElement('div');
        notificacion.className = `notificacion notificacion-${tipo}`;
        notificacion.textContent = mensaje;
        notificacion.setAttribute('role', 'alert');
        
        document.body.appendChild(notificacion);
        
        // Animación de entrada
        requestAnimationFrame(() => {
            notificacion.classList.add('mostrar');
        });
        
        // Auto-eliminación después de 3 segundos
        setTimeout(() => {
            notificacion.classList.remove('mostrar');
            setTimeout(() => notificacion.remove(), 500);
        }, 3000);
    }

    // ========== Lazy Loading para Imágenes ==========
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    if ('IntersectionObserver' in window && lazyImages.length) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        }, { rootMargin: '200px' });

        lazyImages.forEach(img => {
            if (!img.src && img.hasAttribute('src')) {
                img.dataset.src = img.getAttribute('src');
                img.removeAttribute('src');
            }
            imageObserver.observe(img);
        });
    }

    // ========== Animaciones al Scrollear ==========
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.fade-in');
        const windowHeight = window.innerHeight;
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            
            if (elementPosition < windowHeight * 0.8) {
                element.classList.add('visible');
            }
        });
    };

    // Usar requestAnimationFrame para mejor performance
    const handleScroll = () => {
        requestAnimationFrame(animateOnScroll);
    };

    window.addEventListener('load', animateOnScroll);
    window.addEventListener('scroll', handleScroll, { passive: true });
});