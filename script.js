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

    // 5. Product Image Modal & Zoom Functionality
    const productModal = document.getElementById('product-modal');
    const modalCloseBtn = document.querySelector('.modal-close-btn');
    const modalBackdrop = document.querySelector('.product-modal-backdrop');
    const modalImg = document.getElementById('modal-product-img');
    const modalViewport = document.getElementById('modal-img-viewport');
    
    const zoomInBtn = document.getElementById('modal-zoom-in');
    const zoomOutBtn = document.getElementById('modal-zoom-out');
    const zoomResetBtn = document.getElementById('modal-zoom-reset');
    const zoomLevelBadge = document.getElementById('zoom-level');
    
    let currentZoom = 1;
    let isDragging = false;
    let startX = 0, startY = 0;
    let translateX = 0, translateY = 0;
    
    function applyTransform() {
        if (modalImg) {
            modalImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${currentZoom})`;
            if (zoomLevelBadge) {
                zoomLevelBadge.textContent = `${Math.round(currentZoom * 100)}%`;
            }
        }
    }
    
    function resetZoom() {
        currentZoom = 1;
        translateX = 0;
        translateY = 0;
        applyTransform();
    }
    
    function openModal(data) {
        if (!productModal) return;
        
        if (modalImg) modalImg.src = data.image;
        const titleElem = document.getElementById('modal-product-title');
        if (titleElem) titleElem.textContent = data.name;
        
        const catElem = document.getElementById('modal-product-category');
        if (catElem) catElem.textContent = data.category || 'Handcrafted Art';
        
        const specsElem = document.getElementById('modal-product-specs');
        if (specsElem) {
            const span = specsElem.querySelector('span');
            if (span) span.textContent = 'Size: ' + (data.size || 'Standard');
        }
        
        const priceElem = document.getElementById('modal-product-price');
        if (priceElem) {
            const priceNum = Number(data.price);
            priceElem.textContent = priceNum > 0 ? `₹${priceNum.toLocaleString('en-IN')}` : 'Custom Pricing';
        }
        
        const cartBtn = document.getElementById('modal-add-to-cart-btn');
        if (cartBtn) {
            cartBtn.onclick = () => {
                let cart = JSON.parse(localStorage.getItem('achal_cart')) || [];
                const existingIdx = cart.findIndex(item => item.id === data.id);
                if (existingIdx > -1) {
                    cart[existingIdx].quantity += 1;
                } else {
                    cart.push({ id: data.id, name: data.name, price: data.price, size: data.size, image: data.image, quantity: 1 });
                }
                localStorage.setItem('achal_cart', JSON.stringify(cart));
                updateHeaderCartCount();
                showToast(`Added "${data.name}" to your cart!`);
            };
        }
        
        const waBtn = document.getElementById('modal-whatsapp-btn');
        if (waBtn) {
            const priceText = Number(data.price) > 0 ? `₹${data.price}` : 'Custom';
            const msg = encodeURIComponent(`Hi Achal Artworks, I am interested in ordering "${data.name}" (Size: ${data.size}, Price: ${priceText}). Please share more details.`);
            waBtn.href = `https://wa.me/917798510600?text=${msg}`;
        }
        
        resetZoom();
        productModal.classList.add('active');
        productModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }
    
    function closeModal() {
        if (!productModal) return;
        productModal.classList.remove('active');
        productModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        resetZoom();
    }
    
    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && productModal && productModal.classList.contains('active')) {
            closeModal();
        }
    });
    
    // Zoom control buttons
    if (zoomInBtn) {
        zoomInBtn.addEventListener('click', () => {
            if (currentZoom < 4) {
                currentZoom += 0.25;
                applyTransform();
            }
        });
    }
    
    if (zoomOutBtn) {
        zoomOutBtn.addEventListener('click', () => {
            if (currentZoom > 0.6) {
                currentZoom -= 0.25;
                if (currentZoom < 1) { translateX = 0; translateY = 0; }
                applyTransform();
            }
        });
    }
    
    if (zoomResetBtn) {
        zoomResetBtn.addEventListener('click', resetZoom);
    }
    
    // Mouse Wheel Zoom
    if (modalViewport) {
        modalViewport.addEventListener('wheel', (e) => {
            e.preventDefault();
            const delta = e.deltaY < 0 ? 0.15 : -0.15;
            const newZoom = currentZoom + delta;
            if (newZoom >= 0.6 && newZoom <= 4) {
                currentZoom = newZoom;
                if (currentZoom <= 1) { translateX = 0; translateY = 0; }
                applyTransform();
            }
        }, { passive: false });
        
        // Panning / Dragging
        modalViewport.addEventListener('mousedown', (e) => {
            if (currentZoom > 1) {
                isDragging = true;
                startX = e.clientX - translateX;
                startY = e.clientY - translateY;
            }
        });
        
        window.addEventListener('mousemove', (e) => {
            if (isDragging && currentZoom > 1) {
                translateX = e.clientX - startX;
                translateY = e.clientY - startY;
                applyTransform();
            }
        });
        
        window.addEventListener('mouseup', () => {
            isDragging = false;
        });
    }
    
    // Attach click triggers to product image cards
    document.querySelectorAll('.art-card').forEach(card => {
        const imgContainer = card.querySelector('.art-img-container');
        const cartBtn = card.querySelector('.btn-add-to-cart');
        const cardImg = card.querySelector('.art-img-container img');
        
        if (imgContainer && cartBtn) {
            imgContainer.addEventListener('click', (e) => {
                e.stopPropagation();
                const categoryElem = card.querySelector('.art-category');
                const category = categoryElem ? categoryElem.textContent : 'Handcrafted Art';
                const imageSrc = cardImg ? cardImg.getAttribute('src') : cartBtn.getAttribute('data-image');
                
                openModal({
                    id: cartBtn.getAttribute('data-id'),
                    name: cartBtn.getAttribute('data-name'),
                    price: cartBtn.getAttribute('data-price'),
                    size: cartBtn.getAttribute('data-size'),
                    image: imageSrc,
                    category: category
                });
            });
        }
    });

    // Run count update on load
    updateHeaderCartCount();

});
