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
            if (section) {
                const sectionTop = section.offsetTop;
                if (pageYOffset >= (sectionTop - 150)) {
                    current = section.getAttribute('id') || '';
                }
            }
        });

        navLinks.forEach(link => {
            if (link.getAttribute('href').startsWith('#')) {
                link.classList.remove('active');
                if (link.getAttribute('href').slice(1) === current) {
                    link.classList.add('active');
                }
            }
        });
    });

    // 4. Cart Functionality (Add to Cart from Home Page)
    function updateHeaderCartCount() {
        const cart = JSON.parse(localStorage.getItem('achal_cart')) || [];
        const count = cart.reduce((total, item) => total + item.quantity, 0);
        
        // Update both desktop and mobile cart badge counts
        const cartCountElem = document.getElementById('cart-count');
        if (cartCountElem) cartCountElem.textContent = count;
        
        const cartCountMobileElem = document.getElementById('cart-count-mobile');
        if (cartCountMobileElem) cartCountMobileElem.textContent = count;
    }
    
    // Expose updateHeaderCartCount globally so cart-page.js can call it
    window.updateHeaderCartCount = updateHeaderCartCount;

    // Toast Notification helper
    function showToast(message) {
        // Remove existing toast if visible
        const existingToast = document.querySelector('.toast-notification');
        if (existingToast) existingToast.remove();

        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
        document.body.appendChild(toast);
        
        // Trigger show animation
        setTimeout(() => {
            toast.classList.add('show');
        }, 50);

        // Hide and remove after 2.5s
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 2500);
    }

    const addToCartBtns = document.querySelectorAll('.btn-add-to-cart');
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            const name = btn.getAttribute('data-name');
            const price = btn.getAttribute('data-price');
            const size = btn.getAttribute('data-size');
            const image = btn.getAttribute('data-image');

            let cart = JSON.parse(localStorage.getItem('achal_cart')) || [];
            const existingIdx = cart.findIndex(item => item.id === id);

            if (existingIdx > -1) {
                cart[existingIdx].quantity += 1;
            } else {
                cart.push({ id, name, price, size, image, quantity: 1 });
            }

            localStorage.setItem('achal_cart', JSON.stringify(cart));
            updateHeaderCartCount();
            showToast(`Added "${name}" to your cart!`);
        });
    });

    // Run count update on load
    updateHeaderCartCount();

});
