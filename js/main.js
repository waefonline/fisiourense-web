document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();

    // --- Lógica para el encabezado pegajoso y cambio de logo ---
    const header = document.getElementById('header');
    const logoImg = document.querySelector('#logo img');
    const navButtons = document.querySelectorAll('nav a.font-medium');
    const mobileMenuButtonIcon = document.querySelector('#mobile-menu-button');
    // For service pages which might have different selectors or elements
    const pideCitaButton = document.querySelector('header a[href*="#contacto"]');
    const mobileMenuIconI = document.querySelector('#mobile-menu-button i');


    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('bg-white', 'shadow-lg');
            if (logoImg) logoImg.style.filter = 'none';

            if (navButtons.length > 0) {
                navButtons.forEach(button => {
                    button.classList.remove('text-white', 'border-white/30', 'hover:bg-white/10');
                    button.classList.add('text-cyan-800', 'border-transparent', 'hover:bg-gray-100');
                });
            }

            if (mobileMenuButtonIcon) {
                mobileMenuButtonIcon.classList.remove('text-white');
                mobileMenuButtonIcon.classList.add('text-cyan-800');
            }

            // Service pages specific
            if (pideCitaButton) {
                pideCitaButton.classList.remove('bg-cyan-500', 'text-white');
                pideCitaButton.classList.add('bg-cyan-600', 'text-white');
            }
            if (mobileMenuIconI) {
                mobileMenuIconI.classList.remove('text-white');
                mobileMenuIconI.classList.add('text-cyan-800');
            }

        } else {
            header.classList.remove('bg-white', 'shadow-lg');
            if (logoImg) logoImg.style.filter = 'brightness(0) invert(1)';

            if (navButtons.length > 0) {
                navButtons.forEach(button => {
                    button.classList.add('text-white', 'border-white/30', 'hover:bg-white/10');
                    button.classList.remove('text-cyan-800', 'border-transparent', 'hover:bg-gray-100');
                });
            }

            if (mobileMenuButtonIcon) {
                mobileMenuButtonIcon.classList.add('text-white');
                mobileMenuButtonIcon.classList.remove('text-cyan-800');
            }

            // Service pages specific
            if (pideCitaButton) {
                pideCitaButton.classList.add('bg-cyan-500', 'text-white');
                pideCitaButton.classList.remove('bg-cyan-600');
            }
            if (mobileMenuIconI) {
                mobileMenuIconI.classList.add('text-white');
                mobileMenuIconI.classList.remove('text-cyan-800');
            }
        }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Init

    // --- Scroll to top button ---
    const scrollTopBtn = document.getElementById('scroll-top');
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollTopBtn.classList.remove('opacity-0', 'pointer-events-none');
                scrollTopBtn.classList.add('opacity-100');
            } else {
                scrollTopBtn.classList.add('opacity-0', 'pointer-events-none');
                scrollTopBtn.classList.remove('opacity-100');
            }
        });
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- Lógica para el menú móvil ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            const isHidden = mobileMenu.classList.toggle('hidden');
            mobileMenuButton.setAttribute('aria-expanded', !isHidden);
        });

        // Cerrar menú móvil al hacer clic en un enlace
        document.querySelectorAll('#mobile-menu a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                mobileMenuButton.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // --- Lógica para Carruseles ---
    function setupCarousel(sliderId, prevBtnId, nextBtnId, itemClass) {
        const slider = document.getElementById(sliderId);
        if (!slider) return;

        const prevBtn = document.getElementById(prevBtnId);
        const nextBtn = document.getElementById(nextBtnId);
        const items = slider.querySelectorAll(`.${itemClass}`);
        if (!items || items.length === 0) return;

        let currentIndex = 0;
        const totalItems = items.length;

        function getItemsPerView() {
            if (sliderId !== 'testimonial-slider') return 1;
            if (window.innerWidth >= 1024) return 3;
            if (window.innerWidth >= 768) return 2;
            return 1;
        }

        function updateCarousel() {
            if (items.length === 0) return;
            const itemsPerView = getItemsPerView();
            let maxIndex = totalItems - itemsPerView;
            if (maxIndex < 0) maxIndex = 0;

            if (sliderId === 'gallery-slider') {
                maxIndex = totalItems - 1;
            }

            if (currentIndex > maxIndex) currentIndex = maxIndex;
            if (currentIndex < 0) currentIndex = 0;

            const itemWidth = slider.parentElement.getBoundingClientRect().width / itemsPerView;
            const newTransform = currentIndex * itemWidth;

            slider.style.transform = `translateX(-${newTransform}px)`;
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                const itemsPerView = getItemsPerView();

                if (sliderId === 'gallery-slider') {
                    currentIndex = (currentIndex > 0) ? currentIndex - 1 : totalItems - 1;
                } else {
                    currentIndex -= itemsPerView;
                    const maxIndex = totalItems - itemsPerView;
                    if (currentIndex < 0) {
                        currentIndex = maxIndex >= 0 ? maxIndex : 0;
                        if (totalItems % itemsPerView !== 0 && maxIndex > 0) {
                            currentIndex = totalItems - (totalItems % itemsPerView)
                        }
                    }
                }
                updateCarousel();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const itemsPerView = getItemsPerView();
                const maxIndex = totalItems - itemsPerView;

                if (sliderId === 'gallery-slider') {
                    currentIndex = (currentIndex < totalItems - 1) ? currentIndex + 1 : 0;
                } else {
                    currentIndex += itemsPerView;
                    if (currentIndex > maxIndex) {
                        currentIndex = 0;
                    }
                }
                updateCarousel();
            });
        }

        if (sliderId === 'gallery-slider' && nextBtn) {
            setInterval(() => nextBtn.click(), 4000);
        }

        window.addEventListener('resize', updateCarousel);
        updateCarousel(); // Initial call
    }

    setupCarousel('testimonial-slider', 'prev-testimonial', 'next-testimonial', 'carousel-item');
    setupCarousel('gallery-slider', 'prev-gallery', 'next-gallery', 'flex-shrink-0');

    // --- Lógica para el modal de privacidad ---
    const privacyModal = document.getElementById('privacy-modal');
    const privacyLink = document.getElementById('privacy-link');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const privacyLinkCookie = document.getElementById('privacy-link-cookie');

    const openModal = (e) => {
        e.preventDefault();
        if (privacyModal) {
            privacyModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            lucide.createIcons();
        }
    };

    const closeModal = () => {
        if (privacyModal) {
            privacyModal.style.display = 'none';
            document.body.style.overflow = '';
        }
    };

    if (privacyLink) privacyLink.addEventListener('click', openModal);
    if (privacyLinkCookie) privacyLinkCookie.addEventListener('click', openModal);
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (privacyModal) {
        privacyModal.addEventListener('click', (e) => {
            if (e.target === privacyModal) closeModal();
        });
        // Cerrar con tecla Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && privacyModal.style.display === 'flex') {
                closeModal();
            }
        });
    }

    // --- Lógica para el Banner de Cookies ---
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies-btn');

    const setCookie = (name, value, days) => {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Lax";
    };

    const getCookie = (name) => {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    };

    if (cookieBanner && !getCookie('cookies_accepted')) {
        cookieBanner.style.display = 'block';
        setTimeout(() => {
            cookieBanner.classList.remove('translate-y-full');
        }, 100);
    }

    if (acceptCookiesBtn) {
        acceptCookiesBtn.addEventListener('click', () => {
            setCookie('cookies_accepted', 'true', 365);
            cookieBanner.classList.add('translate-y-full');
            setTimeout(() => {
                cookieBanner.style.display = 'none';
            }, 500);
        });
    }

    // --- Lógica para el Analizador de Síntomas con límite de consultas ---
    const analyzeBtn = document.getElementById('analyze-btn');
    const symptomInput = document.getElementById('symptom-input');
    const geminiResultDiv = document.getElementById('gemini-result');
    const resultText = document.getElementById('result-text');
    const loadingSpinner = document.getElementById('loading-spinner');

    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', async () => {
            const userInput = symptomInput.value;

            if (!userInput.trim()) {
                resultText.innerHTML = "Por favor, describe tu dolencia en el cuadro de texto.";
                geminiResultDiv.classList.remove('hidden');
                loadingSpinner.style.display = 'none';
                resultText.style.display = 'block';
                return;
            }

            // Verificar límite de consultas
            let queryCount = parseInt(localStorage.getItem('symptom_queries') || '0');
            const maxQueries = 3;
            const lastReset = localStorage.getItem('symptom_reset_date');
            const today = new Date().toDateString();

            // Resetear contador cada día
            if (lastReset !== today) {
                localStorage.setItem('symptom_queries', '0');
                localStorage.setItem('symptom_reset_date', today);
                queryCount = 0;
            }

            // Verificar si ha alcanzado el límite
            if (queryCount >= maxQueries) {
                resultText.innerHTML = "<strong>Has alcanzado el límite de " + maxQueries + " consultas diarias.</strong><br><br>Para una atención personalizada y sin límites, llámanos al <a href='tel:988255461' class='underline font-bold hover:text-white'>988 255 461</a> o envíanos un <a href='https://wa.me/34988255461' class='underline font-bold hover:text-white' target='_blank'>WhatsApp</a>.";
                geminiResultDiv.classList.remove('hidden');
                loadingSpinner.style.display = 'none';
                resultText.style.display = 'block';
                return;
            }

            geminiResultDiv.classList.remove('hidden');
            loadingSpinner.style.display = 'flex';
            resultText.style.display = 'none';
            resultText.innerHTML = '';

            try {
                // Usamos ruta relativa "api/analyze"
                const response = await fetch('api/analyze', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userInput: userInput }),
                });
                if (!response.ok) {
                    throw new Error(`El servidor respondió con un error: ${response.statusText}`);
                }

                const result = await response.json();

                let generatedText = result.text;
                generatedText = generatedText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                generatedText = generatedText.replace(/\n/g, '<br>');
                resultText.innerHTML = generatedText;

                // Incrementar contador SOLO si la petición fue exitosa
                const newCount = queryCount + 1;
                localStorage.setItem('symptom_queries', newCount.toString());
                localStorage.setItem('symptom_reset_date', today);

                // Mostrar consultas restantes
                const remaining = maxQueries - newCount;
                if (remaining > 0) {
                    resultText.innerHTML += `<br><br><small class="text-cyan-200 opacity-80">💡 Te quedan <strong>${remaining}</strong> consulta${remaining !== 1 ? 's' : ''} hoy.</small>`;
                } else {
                    resultText.innerHTML += `<br><br><small class="text-cyan-200 opacity-80">Has usado todas tus consultas diarias. Mañana podrás consultar de nuevo.</small>`;
                }

            } catch (error) {
                console.error("Error al llamar a la función de API:", error);
                resultText.innerHTML = "Lo sentimos, ha ocurrido un error al procesar tu solicitud. Por favor, intenta de nuevo más tarde o llámanos directamente al <a href='tel:988255461' class='underline font-bold hover:text-white'>988 255 461</a>.";
            } finally {
                loadingSpinner.style.display = 'none';
                resultText.style.display = 'block';
            }
        });
    }

    // --- Lógica para animaciones de scroll ---
    const animatedElements = document.querySelectorAll('.scroll-animate');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('scroll-animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    animatedElements.forEach(element => {
        observer.observe(element);
    });

    // Smooth scroll para enlaces ancla
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const headerHeight = header.offsetHeight;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
});
