// scripts/api.js

const allProductsList = [
    { id: 1, image: 'assets/images/Product-1.jpg', title: 'Signature Oversized Black Hoodie', price: 70.00, sale: true },
    { id: 2, image: 'assets/images/Product-2.jpg', title: 'Oversized Premium Streetwear', price: 140.00, sale: false },
    { id: 3, image: 'assets/images/Product-3.jpg', title: 'Classic Streetwear Crewneck', price: 50.00, sale: true },
    { id: 4, image: 'assets/images/Product-4.jpg', title: 'Vintage Graphic Crewneck', price: 100.00, sale: false },
    { id: 5, image: 'assets/images/item-1.jpg', title: 'Lightweight Essential Hoodie', price: 130.00, sale: true },
    { id: 6, image: 'assets/images/item-2.jpg', title: 'Classic Gray Minimalist Crewneck', price: 190.00, sale: false },
    { id: 7, image: 'assets/images/item-3.jpg', title: 'Premium Zip-Up Urban Jacket', price: 150.00, sale: true },
    { id: 8, image: 'assets/images/item-4.jpg', title: 'Limited Edition Graphic Print', price: 200.00, sale: false },
    { id: 9, image: 'assets/images/Product-5.jpg', title: 'Streetwear Cargo Jacket', price: 250.00, sale: true },
    { id: 10, image: 'assets/images/Product-6.jpg', title: 'Signature Logo Heavyweight V2', price: 230.00, sale: false },
    { id: 11, image: 'assets/images/Product-7.jpg', title: 'Essential Tech Fleece Zip', price: 290.00, sale: true },
    { id: 12, image: 'assets/images/Product-8.jpg', title: 'Premium Comfort Dropped Shoulder', price: 240.00, sale: false },
];

const api = {
    getCollections: async () => {
        return [
            { id: 1, title: 'Oversize Hoodies', description: 'Maximum comfort with a relaxed drop-shoulder fit.', className: '' },
            { id: 2, title: 'Classic Crewnecks', description: 'Essential basics for your daily streetwear look.', className: 'bg-model-2' },
            { id: 3, title: 'Zip-Up Jackets', description: 'Easy to layer, perfect for changing weather.', className: 'bg-model-3' },
            { id: 4, title: 'Graphic Prints', description: 'Express yourself with our unique back and chest prints.', className: 'bg-model-4' },
        ];
    },
    getProducts: async () => {
        return allProductsList.slice(0, 4);
    },
    getAllProducts: async () => {
        return allProductsList;
    },
    getTestimonials: async () => {
        return [
            { id: 1, image: 'assets/images/customer1.jpeg', text: "The material is insanely good. Best oversize hoodie I've ever bought. Highly recommend!", author: "Nick Wade, New York" },
            { id: 2, image: 'assets/images/customer2.jpeg', text: "Fits perfectly and the color didn't fade after washing. Great value for the price.", author: "Sarah M., London" },
            { id: 3, image: 'assets/images/customer3.jpeg', text: "Super fast delivery and the packaging was really cool. Will definitely order again.", author: "John D., LA" },
        ];
    }
};

// Render logic for Home Page and Products Page
document.addEventListener('DOMContentLoaded', async () => {
    // Determine base path for images depending on whether we are in a subfolder or root
    const isSubpage = window.location.pathname.includes('/pages/');
    const basePath = isSubpage ? '../' : './';

    // Render Collections
    const collectionsContainer = document.querySelector('.collections-grid');
    if (collectionsContainer) {
        const collections = await api.getCollections();
        collectionsContainer.innerHTML = collections.map(collection => `
            <div class="collection-card ${collection.className}">
                <div class="card-text">
                    <h5>${collection.title}</h5>
                    <p>${collection.description}</p>
                </div>
            </div>
        `).join('');
    }

    // Render Selected Products (Home Page)
    const selectedProductsContainer = document.getElementById('selected-products');
    if (selectedProductsContainer) {
        const products = await api.getProducts();
        selectedProductsContainer.innerHTML = products.map(product => `
            <div class="product-card">
                <a href="${isSubpage ? '' : 'pages/'}cart.html?id=${product.id}" class="image-wrapper" style="display:block; text-decoration:none;">
                    <img src="${basePath}${product.image}" alt="${product.title}">
                </a>
                <p>${product.title}</p>
                <span class="price">$${product.price.toFixed(2)}</span>
                <button class="add-to-cart" data-name="${product.title}" data-price="${product.price}" data-img="${basePath}${product.image}">Add To Cart</button>
            </div>
        `).join('');
    }

    // Render All Products (Products Page)
    const allProductsContainer = document.getElementById('all-products');
    if (allProductsContainer) {
        const allProducts = await api.getAllProducts();
        allProductsContainer.innerHTML = allProducts.map(product => `
            <div class="product-card">
                <a href="${isSubpage ? '' : 'pages/'}cart.html?id=${product.id}" class="image-wrapper" style="display:block; text-decoration:none;">
                    <img src="${basePath}${product.image}" alt="${product.title}">
                    ${product.sale ? '<p>SALE</p>' : ''}
                </a>
                <p>${product.title}</p>
                <span class="price">$${product.price.toFixed(2)}</span>
                <button class="add-to-cart" data-name="${product.title}" data-price="${product.price}" data-img="${basePath}${product.image}">Add To Cart</button>
            </div>
        `).join('');
    }

    // Render Testimonials
    const testimonialsContainer = document.querySelector('.Customers');
    if (testimonialsContainer) {
        const testimonials = await api.getTestimonials();
        testimonialsContainer.innerHTML = testimonials.map(testimonial => `
            <div class="testimonial-card">
                <img width="80px" height="80px" src="${basePath}${testimonial.image}" alt="Customer">
                <p>${testimonial.text}</p>
                <span style="color: red;">${testimonial.author}</span>
            </div>
        `).join('');
    }
});
