document.addEventListener('DOMContentLoaded', () => {
    const searchToggle = document.getElementById('search-toggle');
    const searchBar = document.getElementById('search-bar');
    const searchClose = document.getElementById('search-close');
    const searchInput = document.getElementById('search-input');

    if (!searchToggle || !searchBar || !searchInput) return;

    // Determine base path for images and links depending on subfolder depth
    const isSubpage = window.location.pathname.includes('/pages/');
    const basePath = isSubpage ? '../' : './';
    const productPagePath = isSubpage ? 'cart.html' : './pages/cart.html';

    // Create results container inside search bar
    const searchContainer = searchBar.querySelector('.container');
    const resultsDiv = document.createElement('div');
    resultsDiv.className = 'search-results';
    resultsDiv.id = 'search-results';
    resultsDiv.style.display = 'none';
    searchContainer.appendChild(resultsDiv);

    let allProducts = [];

    searchToggle.addEventListener('click', async (e) => {
        e.stopPropagation();
        searchBar.classList.toggle('active');
        if (searchBar.classList.contains('active')) {
            setTimeout(() => searchInput.focus(), 200);
            
            // Fetch products if not already fetched
            if (allProducts.length === 0 && typeof api !== 'undefined' && typeof api.getAllProducts === 'function') {
                allProducts = await api.getAllProducts();
            }
        }
    });

    const closeSearch = () => {
        searchBar.classList.remove('active');
        searchBar.classList.remove('has-results');
        searchInput.value = '';
        resultsDiv.style.display = 'none';
        resultsDiv.innerHTML = '';
    };

    if (searchClose) {
        searchClose.addEventListener('click', closeSearch);
    }

    // Close on click outside
    document.addEventListener('click', (e) => {
        if (!searchBar.contains(e.target) && !searchToggle.contains(e.target)) {
            closeSearch();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeSearch();
        }
    });

    // Live Search Functionality
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        
        if (query.length === 0) {
            resultsDiv.style.display = 'none';
            searchBar.classList.remove('has-results');
            resultsDiv.innerHTML = '';
            return;
        }

        if (allProducts.length === 0) return; // Wait for products to load

        const filtered = allProducts.filter(product => 
            product.title.toLowerCase().includes(query)
        );

        renderResults(filtered);
    });

    function renderResults(products) {
        if (products.length === 0) {
            resultsDiv.innerHTML = '<div class="search-no-results">No products found for your search.</div>';
        } else {
            // Limit to top 5 results to keep it clean
            const displayProducts = products.slice(0, 5);
            resultsDiv.innerHTML = displayProducts.map(product => `
                <a href="${productPagePath}?id=${product.id}" class="search-result-item">
                    <img src="${basePath}${product.image}" alt="${product.title}">
                    <div class="details">
                        <div class="title">${product.title}</div>
                        <div class="price">$${product.price.toFixed(2)}</div>
                    </div>
                </a>
            `).join('');
        }
        
        resultsDiv.style.display = 'flex';
        searchBar.classList.add('has-results');
    }
});
