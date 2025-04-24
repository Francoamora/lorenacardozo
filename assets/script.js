document.addEventListener('DOMContentLoaded', function() {
    // Animación de elementos al hacer scroll
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.fade-in');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if(elementPosition < screenPosition) {
                element.classList.add('visible');
            }
        });
    };

    // Ejecutar al cargar y al hacer scroll
    window.addEventListener('load', animateOnScroll);
    window.addEventListener('scroll', animateOnScroll);

    // Efecto smooth scroll mejorado
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Cerrar menú móvil si está abierto
                const menuBtn = document.querySelector('.menu-hamburguesa');
                if(menuBtn.classList.contains('active')) {
                    menuBtn.classList.remove('active');
                    document.querySelector('.enlaces').classList.remove('active');
                    document.body.classList.remove('no-scroll');
                }
            }
        });
    });

    // Header con efecto al hacer scroll
    const header = document.querySelector('.encabezado');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if(currentScroll <= 0) {
            header.style.transform = 'translateY(0)';
            header.style.boxShadow = 'none';
        } else if(currentScroll > lastScroll) {
            // Scroll hacia abajo
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scroll hacia arriba
            header.style.transform = 'translateY(0)';
            header.style.boxShadow = '0 2px 15px rgba(0, 0, 0, 0.1)';
        }
        
        lastScroll = currentScroll;
    });

    // Validación de formulario mejorada
    const contactoForm = document.getElementById('formulario-contacto');
    if(contactoForm) {
        contactoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validar campos
            const nombre = this.querySelector('#nombre').value.trim();
            const email = this.querySelector('#email').value.trim();
            const mensaje = this.querySelector('#mensaje').value.trim();
            
            if(!nombre || !email || !mensaje) {
                showAlert('Por favor complete todos los campos requeridos', 'error');
                return;
            }
            
            if(!validateEmail(email)) {
                showAlert('Por favor ingrese un email válido', 'error');
                return;
            }
            
            // Simular envío
            showAlert('Mensaje enviado con éxito. Nos pondremos en contacto pronto.', 'success');
            this.reset();
        });
    }
    
    // Funciones auxiliares
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function showAlert(message, type) {
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.textContent = message;
        
        document.body.appendChild(alert);
        
        setTimeout(() => {
            alert.classList.add('fade-out');
            setTimeout(() => alert.remove(), 500);
        }, 3000);
    }
});
// Galería de proyectos
document.addEventListener('DOMContentLoaded', function() {
    // Variables
    const filtroBtns = document.querySelectorAll('.filtro-btn');
    const galeriaItems = document.querySelectorAll('.galeria__item');
    const modal = document.querySelector('.galeria__modal');
    const modalImg = document.querySelector('.modal-imagen');
    const modalTitulo = document.querySelector('.modal-titulo');
    const modalDesc = document.querySelector('.modal-descripcion');
    const modalFecha = document.querySelector('.modal-fecha');
    const cerrarModal = document.querySelector('.cerrar-modal');
    const verMasBtns = document.querySelectorAll('.ver-mas');
    const verMasGaleriaBtn = document.getElementById('ver-mas-galería');
    
    // Filtrado de la galería
    filtroBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Cambiar botón activo
            filtroBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const filtro = this.dataset.filter;
            
            // Filtrar items
            galeriaItems.forEach(item => {
                if (filtro === 'todos' || item.dataset.categoria === filtro) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
    
    // Abrir modal
    function abrirModal(imgSrc, titulo, descripcion, fecha) {
        modalImg.src = imgSrc;
        modalImg.alt = titulo;
        modalTitulo.textContent = titulo;
        modalDesc.textContent = descripcion;
        modalFecha.textContent = fecha;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
    
    // Eventos para abrir modal
    verMasBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const item = this.closest('.galeria__item');
            const imgSrc = item.querySelector('img').src;
            const titulo = item.querySelector('h3').textContent;
            const descripcion = item.querySelector('p').textContent;
            const fecha = item.querySelector('p').textContent.split('-').pop().trim();
            
            abrirModal(imgSrc, titulo, descripcion, fecha);
        });
    });
    
    // También permitir clic en la imagen
    galeriaItems.forEach(item => {
        item.addEventListener('click', function(e) {
            if (e.target.tagName === 'IMG') {
                const imgSrc = e.target.src;
                const titulo = this.querySelector('h3').textContent;
                const descripcion = this.querySelector('p').textContent;
                const fecha = this.querySelector('p').textContent.split('-').pop().trim();
                
                abrirModal(imgSrc, titulo, descripcion, fecha);
            }
        });
    });
    
    // Cerrar modal
    cerrarModal.addEventListener('click', function() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
    
    // Cerrar al hacer clic fuera
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Cargar más proyectos (simulado)
    verMasGaleriaBtn.addEventListener('click', function() {
        // En una implementación real, aquí harías una petición AJAX
        // o cargarías más elementos del DOM que están ocultos inicialmente
        
        this.textContent = 'Cargando...';
        this.disabled = true;
        
        // Simulamos carga con setTimeout
        setTimeout(() => {
            // Aquí iría la lógica para agregar más items
            alert('En una implementación real, se cargarían más proyectos aquí');
            
            this.textContent = 'Ver más proyectos';
            this.disabled = false;
        }, 1000);
    });
});