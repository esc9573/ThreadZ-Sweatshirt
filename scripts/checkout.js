document.addEventListener('DOMContentLoaded', () => {
    const tbody = document.getElementById('invoice-body');
    const subtotalEl = document.getElementById('subtotal');
    const shippingEl = document.getElementById('shipping');
    const totalEl = document.getElementById('total');
    const checkoutArea = document.getElementById('checkout-area');

    function renderInvoice() {
        let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        
        if (cartItems.length === 0) {
            checkoutArea.innerHTML = `
                <div class="empty-cart">
                    <i class="fa-solid fa-cart-arrow-down"></i>
                    <h2>Your cart is empty</h2>
                    <p style="color: var(--text-muted); margin-top: 10px;">Looks like you haven't added any premium sweatshirts yet.</p>
                    <a href="./products.html" style="display: inline-block; margin-top: 20px; padding: 12px 24px; background: var(--primary-color); color: white; border-radius: var(--radius-md); text-decoration:none; font-weight:bold;">Return to Shop</a>
                </div>
            `;
            return;
        }

        tbody.innerHTML = '';
        let subtotal = 0;

        cartItems.forEach((item, index) => {
            const itemTotal = item.price * item.qty;
            subtotal += itemTotal;

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>
                    <div class="item-info">
                        <img src="${item.image}" alt="${item.name}">
                        <div>
                            <h4>${item.name}</h4>
                            <p>ThreadZ Premium</p>
                        </div>
                    </div>
                </td>
                <td><span class="item-price">$${parseFloat(item.price).toFixed(2)}</span></td>
                <td>
                    <div class="qty-controls">
                        <button onclick="updateQty(${index}, -1)">-</button>
                        <span>${item.qty}</span>
                        <button onclick="updateQty(${index}, 1)">+</button>
                    </div>
                </td>
                <td><span class="item-total">$${itemTotal.toFixed(2)}</span></td>
                <td style="text-align:center;">
                    <button class="btn-remove" onclick="removeItem(${index})"><i class="fa-solid fa-trash"></i></button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        const shipping = subtotal > 0 ? 15.00 : 0;
        const total = subtotal + shipping;

        subtotalEl.innerText = `$${subtotal.toFixed(2)}`;
        shippingEl.innerText = `$${shipping.toFixed(2)}`;
        totalEl.innerText = `$${total.toFixed(2)}`;

        // Update badge
        if(typeof setupCartCounter === 'function') setupCartCounter();
    }

    window.updateQty = (index, change) => {
        let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        if (cartItems[index].qty + change > 0) {
            cartItems[index].qty += change;
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            renderInvoice();
        }
    };

    window.removeItem = (index) => {
        let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        cartItems.splice(index, 1);
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        renderInvoice();
    };

    if(checkoutArea) {
        renderInvoice();
    }
});
