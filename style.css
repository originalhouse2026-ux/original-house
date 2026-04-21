const GOOGLE_SHEETS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRHh-u6rZPLRMNhaw2ILjUFgHULwrpkDogwQBREHx6fHIh7k_mduLn4DjftOkRbpAEY8lUrkajwaxQK/pub?output=csv';

let allProducts = [];
let filteredProducts = [];

document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    setupFilters();
    setupLogo();
});

async function loadProducts() {
    const loadingEl = document.getElementById('loading');
    const errorEl = document.getElementById('error');
    const productsGrid = document.getElementById('products-grid');

    try {
        loadingEl.style.display = 'block';
        errorEl.style.display = 'none';
        productsGrid.innerHTML = '';

        const response = await fetch(GOOGLE_SHEETS_CSV_URL);
        const csvText = await response.text();

        allProducts = parseCSV(csvText);
        filteredProducts = [...allProducts];

        renderProducts(filteredProducts);
        loadingEl.style.display = 'none';

    } catch (error) {
        loadingEl.style.display = 'none';
        errorEl.style.display = 'block';
    }
}

function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));

    return lines.slice(1).map(line => {
        const values = line.split(',');
        const product = {};

        headers.forEach((header, index) => {
            product[header] = values[index] || '';
        });

        return {
            name: product['NOMBRE'] || 'Sin nombre',
            price: product['PRECIO'] || '0',
            category: product['CATEGORÍA'] || 'Otros',
            image: product['LINK_IMAGEN'] || '',
            description: product['DESCRIPCIÓN'] || '',
            fabric: '250g Catar Fabric'
        };
    });
}

function renderProducts(products) {
    const grid = document.getElementById('products-grid');
    grid.innerHTML = products.map(p => createProductCard(p)).join('');
}

function createProductCard(product) {
    const whatsappUrl = `https://wa.me/573337318929?text=Quiero%20comprar%20${encodeURIComponent(product.name)}`;

    return `
    <article class="product-card">
        <img src="${product.image}" class="product-image">
        <div class="product-category">${product.category}</div>
        <h3 class="product-name">${product.name}</h3>
        <div class="product-price">$${product.price}</div>

        <p class="product-description">${product.description}</p>

        <div class="product-fabric">${product.fabric}</div>

        <button class="whatsapp-btn" onclick="window.open('${whatsappUrl}')">
            Comprar por WhatsApp
        </button>
    </article>
    `;
}

function setupFilters() {
    const buttons = document.querySelectorAll('.filter-btn');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            if (filter === 'all') {
                renderProducts(allProducts);
            } else {
                const filtered = allProducts.filter(p =>
                    p.category.toLowerCase().includes(filter.toLowerCase())
                );
                renderProducts(filtered);
            }
        });
    });
}

function setupLogo() {
    const logo = document.getElementById('logo-container');

    logo.addEventListener('click', () => {
        logo.style.transform = 'scale(0.9)';
        setTimeout(() => {
            logo.style.transform = 'scale(1)';
        }, 150);
    });
}
