document.addEventListener('DOMContentLoaded', () => {
    /* ==============================
       Mobile Navigation - Dropdown
    ============================== */
    const nav = document.getElementById('nav');
    const bars = document.querySelector('.header-actions .bars');

    const closeNav = () => {
        if (!nav) return;
        nav.classList.remove('active');
        if (bars) {
            const icon = bars.querySelector('i');
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        }
    };

    if (bars) {
        bars.addEventListener('click', (e) => {
            e.stopPropagation();
            nav.classList.toggle('active');
            const icon = bars.querySelector('i');
            if (nav.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Close nav on link click (mobile)
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) closeNav();
        });
    });

    // Close nav when clicking outside
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && nav && nav.classList.contains('active')) {
            if (!nav.contains(e.target) && !bars.contains(e.target)) {
                closeNav();
            }
        }
    });

    // Close nav on resize to desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) closeNav();
    });

    // Close nav on scroll
    window.addEventListener('scroll', () => {
        if (window.innerWidth <= 768) closeNav();
    });

    /* ==============================
       Scroll Effects
    ============================== */
    const header = document.querySelector('header');

    // Back to top button
    const backToTop = document.createElement('button');
    backToTop.id = 'back-to-top';
    backToTop.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
    backToTop.classList.add('back-to-top');
    document.body.appendChild(backToTop);

    window.addEventListener('scroll', () => {
        if (header) {
            if (window.scrollY > 10) header.classList.add('scrolled');
            else header.classList.remove('scrolled');
        }
        if (window.scrollY > 400) backToTop.classList.add('visible');
        else backToTop.classList.remove('visible');
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* ==============================
       Hero Buttons Functionality
    ============================== */
    const isSubpage = window.location.pathname.includes('/pages/');
    const basePath = isSubpage ? '../' : './';

    // "View All Items" → go to products
    const heroBtn = document.querySelector('.hero-section .hero-text button');
    if (heroBtn) {
        heroBtn.addEventListener('click', () => {
            window.location.href = basePath + 'pages/products.html';
        });
    }

    // "Get Discount" → copy code + toast
    const discountBtn = document.querySelector('.discount-banner button');
    if (discountBtn) {
        discountBtn.addEventListener('click', () => {
            navigator.clipboard.writeText('SECRETSALE').then(() => {
                showToast('🎉 Code "SECRETSALE" copied! Use at checkout for 25% off.');
            }).catch(() => {
                showToast('🎉 Use code SECRETSALE at checkout for 25% off!');
            });
        });
    }

    // Logo → Home
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.style.cursor = 'pointer';
        logo.addEventListener('click', () => {
            window.location.href = isSubpage ? '../index.html' : './index.html';
        });
    }

    // Cart and User icons are now <a> tags — no JS needed

    /* ==============================
       Product Page - Size Selector
    ============================== */
    document.querySelectorAll('.size-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    /* ==============================
       Product Page - Color Selector
    ============================== */
    document.querySelectorAll('.color-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    /* ==============================
       Product Page - Tabs
    ============================== */
    const tabHeaders = document.querySelectorAll('.tabs-header span[data-tab]');
    tabHeaders.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active from all tabs
            tabHeaders.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Hide all content
            document.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');

            // Show selected
            const target = document.getElementById('tab-' + tab.dataset.tab);
            if (target) target.style.display = 'block';
        });
    });

    /* ==============================
       Product Page - Quantity
    ============================== */
    const minBtn = document.getElementById('btn-min');
    const plusBtn = document.getElementById('btn-plus');
    const qtyText = document.getElementById('text');

    if (minBtn && plusBtn && qtyText) {
        plusBtn.addEventListener('click', () => {
            let qty = parseInt(qtyText.textContent);
            qtyText.textContent = qty + 1;
        });
        minBtn.addEventListener('click', () => {
            let qty = parseInt(qtyText.textContent);
            if (qty > 1) qtyText.textContent = qty - 1;
        });
    }

    /* ==============================
       About Page Buttons
    ============================== */
    // "Shop Our Collection" button
    const shopBtn = document.querySelector('.story-content .btn');
    if (shopBtn && shopBtn.tagName === 'A') {
        // Already a link, handled by href
    } else if (shopBtn) {
        shopBtn.addEventListener('click', () => {
            window.location.href = basePath + 'pages/products.html';
        });
    }

    // "Get Offer Today" button
    const offerBtn = document.querySelector('.promotion-container .promotion-info .btn, .promotion-container .promotion-info button');
    if (offerBtn) {
        offerBtn.addEventListener('click', () => {
            navigator.clipboard.writeText('SECRETSALE').then(() => {
                showToast('🎉 Code "SECRETSALE" copied! Paste it at checkout.');
            }).catch(() => {
                showToast('🎉 Use code SECRETSALE at checkout for 25% off!');
            });
        });
    }

    /* ==============================
       Product Cards → Product Detail
    ============================== */
    document.addEventListener('click', (e) => {
        // Product image click → go to detail page
        const card = e.target.closest('.product-card');
        if (card && !e.target.closest('.add-to-cart') && !e.target.closest('button')) {
            window.location.href = isSubpage ? './cart.html' : './pages/cart.html';
        }
    });

    // Make product cards look clickable
    document.querySelectorAll('.product-card').forEach(card => {
        card.style.cursor = 'pointer';
    });

    // Also handle dynamically loaded product cards
    const observer = new MutationObserver(() => {
        document.querySelectorAll('.product-card').forEach(card => {
            card.style.cursor = 'pointer';
        });
    });
    const productsGrid = document.querySelector('.products-grid, #selected-products, #all-products');
    if (productsGrid) {
        observer.observe(productsGrid, { childList: true });
    }

    /* ==============================
       Collection Cards → Products
    ============================== */
    document.addEventListener('click', (e) => {
        const card = e.target.closest('.collection-card');
        if (card) {
            window.location.href = basePath + 'pages/products.html';
        }
    });

    /* ==============================
       Toast Notification System
    ============================== */
    function showToast(message) {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = 'awesome-toast';
        toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${message}`;
        container.appendChild(toast);

        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    }

    // Expose globally for cart.js usage
    window.showToast = showToast;
});
