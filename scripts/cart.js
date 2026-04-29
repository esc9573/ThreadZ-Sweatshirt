let cart = JSON.parse(localStorage.getItem('cartItems')) || [];

document.addEventListener('DOMContentLoaded', () => {
    setupCartCounter();

    // Setup Add To Cart Buttons (Using Event Delegation)
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.add-to-cart, .btn-mini, .btn-add, .product-card button:not(.back-to-top)');
        if (!btn) return;
        
        if(btn.disabled) return;
        e.preventDefault();

        const name = btn.getAttribute('data-name') || "Streetwear Sweatshirt";
        const price = parseFloat(btn.getAttribute('data-price')) || 150;
        const image = btn.getAttribute('data-img') || "../assets/images/model-1.jpg";
        
        let qty = 1;
        const qtyText = document.getElementById('text');
        if(qtyText && btn.classList.contains('btn-add')) {
            qty = parseInt(qtyText.innerText) || 1;
        }

        // Inline Loading Animation
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Adding...';
        btn.disabled = true;

        setTimeout(() => {
            addToCart(name, price, image, qty);
            btn.innerHTML = '<i class="fa-solid fa-check"></i> Added';
            
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.disabled = false;
            }, 2000);
        }, 500); // simulate network delay
    });

    // Quantity Logic (+ / -) in product details mapped directly from the UI
    const btnPlus = document.getElementById('btn-plus');
    const btnMin = document.getElementById('btn-min');
    const qtyText = document.getElementById('text');
    
    if(btnPlus && btnMin && qtyText) {
        btnPlus.addEventListener('click', () => {
            let val = parseInt(qtyText.innerText) || 1;
            qtyText.innerText = val + 1;
        });
        btnMin.addEventListener('click', () => {
            let val = parseInt(qtyText.innerText) || 1;
            if (val > 1) qtyText.innerText = val - 1;
        });
    }

    // Tabs inside product details
    const tabs = document.querySelectorAll('.tabs-header span');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.tabs-header span').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });

    // Dynamic Product Page Loading
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (productId && window.location.pathname.includes('cart.html')) {
        loadProductDetails(productId);
    }
});

async function loadProductDetails(id) {
    if (typeof api === 'undefined' || typeof api.getAllProducts !== 'function') return;
    
    const products = await api.getAllProducts();
    const product = products.find(p => p.id == id);
    
    if (product) {
        const isSubpage = window.location.pathname.includes('/pages/');
        const basePath = isSubpage ? '../' : './';
        
        const imgEl = document.querySelector('.product-im img');
        if(imgEl) {
            imgEl.src = basePath + product.image;
            imgEl.alt = product.title;
        }
        
        const titleEl = document.querySelector('.product-info h1');
        if(titleEl) titleEl.innerText = product.title;
        
        const priceEl = document.querySelector('.price .now');
        if(priceEl) priceEl.innerText = '$' + product.price.toFixed(2);
        
        const oldPriceEl = document.querySelector('.price .old');
        if(oldPriceEl) {
            // Fake an old price for UI purposes if it's on sale, else hide
            if (product.sale) {
                oldPriceEl.innerText = '$' + (product.price * 1.25).toFixed(2);
                oldPriceEl.style.display = 'inline-block';
            } else {
                oldPriceEl.style.display = 'none';
            }
        }

        const discountTag = document.querySelector('.price .discount-tag');
        if(discountTag) {
            discountTag.style.display = product.sale ? 'inline-block' : 'none';
        }
        
        const badgeEl = document.querySelector('.product-im .badge');
        if(badgeEl) badgeEl.style.display = product.sale ? 'block' : 'none';
        
        const btnAdd = document.querySelector('.btn-add');
        if(btnAdd) {
            btnAdd.setAttribute('data-name', product.title);
            btnAdd.setAttribute('data-price', product.price);
            btnAdd.setAttribute('data-img', basePath + product.image);
        }

        // Update page title
        document.title = `ThreadZ | ${product.title}`;

        // Render You May Also Like
        const otherProductsGrid = document.querySelector('.other-products .products-grid');
        if (otherProductsGrid) {
            // Get 4 products excluding the current one
            const suggestedProducts = products.filter(p => p.id != id).slice(0, 4);
            otherProductsGrid.innerHTML = suggestedProducts.map(p => `
                <div class="product-card">
                    <a href="cart.html?id=${p.id}" class="image-wrapper" style="display:block; text-decoration:none;">
                        <img src="${basePath}${p.image}" alt="${p.title}">
                        ${p.sale ? '<p>SALE</p>' : ''}
                    </a>
                    <p>${p.title}</p>
                    <span class="price">$${p.price.toFixed(2)}</span>
                    <button class="add-to-cart" data-name="${p.title}" data-price="${p.price}" data-img="${basePath}${p.image}">Add To Cart</button>
                </div>
            `).join('');
        }
    }
}

function addToCart(name, price, image, qty) {
    const existing = cart.find(item => item.name === name);
    if(existing) {
        existing.qty += qty;
    } else {
        cart.push({ name, price, image, qty });
    }
    localStorage.setItem('cartItems', JSON.stringify(cart));
    setupCartCounter();
    showToast(`Successfully added to your cart!`);
}

function setupCartCounter() {
    let totalQty = cart.reduce((acc, item) => acc + item.qty, 0);
    const cartIcons = document.querySelectorAll('.fa-cart-shopping');
    
    cartIcons.forEach(icon => {
        let badge = icon.nextElementSibling;
        if(!badge || !badge.classList.contains('cart-badge')) {
            badge = document.createElement('span');
            badge.classList.add('cart-badge');
            icon.parentNode.insertBefore(badge, icon.nextSibling);
            icon.parentNode.style.position = 'relative';
            
            badge.style.position = 'absolute';
            badge.style.top = '-8px';
            badge.style.right = '-8px';
            badge.style.background = '#e74c3c';
            badge.style.color = '#fff';
            badge.style.borderRadius = '50%';
            badge.style.padding = '2px 6px';
            badge.style.fontSize = '10px';
            badge.style.fontWeight = 'bold';
        }
        badge.innerText = totalQty;
        if(totalQty === 0) badge.style.display = 'none';
        else badge.style.display = 'block';

        icon.style.cursor = 'pointer';
        icon.addEventListener('click', () => {
            const currentPath = window.location.pathname;
            if(currentPath.includes('/pages/')) {
                window.location.href = 'checkout.html';
            } else {
                window.location.href = 'pages/checkout.html';
            }
        });
    });
}

function showToast(message) {
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    toast.className = 'awesome-toast';
    toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>${message}</span>`;
    
    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('show');
    }, 10);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
