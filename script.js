document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Mobile Navigation Toggle
    const navToggle = document.getElementById('nav-toggle');
    const mainNav = document.getElementById('main-nav');
    
    if (navToggle && mainNav) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            mainNav.classList.toggle('active');
        });

        // Close mobile nav when clicking a link
        const navLinks = document.querySelectorAll('.nav-link, .nav-btn-contact');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                mainNav.classList.remove('active');
            });
        });
    }

    // 2. Collection Filtering Logic
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const galleryGrid = document.getElementById('gallery-grid');

    if (filterButtons.length && galleryItems.length) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                filterButtons.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                // Fade out grid briefly
                if (galleryGrid) galleryGrid.style.opacity = '0.3';

                setTimeout(() => {
                    galleryItems.forEach(item => {
                        const itemCategory = item.getAttribute('data-category');
                        if (filterValue === 'all' || itemCategory === filterValue) {
                            item.style.display = 'block';
                        } else {
                            item.style.display = 'none';
                        }
                    });
                    // Fade back in
                    if (galleryGrid) galleryGrid.style.opacity = '1';
                }, 200);
            });
        });
    }

    // 3. Update Active Nav Link on Scroll
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });

});
