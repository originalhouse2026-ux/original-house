/**
 * Original House - Product Data Loader & WhatsApp Integration
 * ========================================================
 * 
 * PASTE YOUR GOOGLE SHEETS CSV LINK HERE:
 * Make your Google Sheet public, then use this format:
 * https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/export?format=csv&gid=0
 */
const GOOGLE_SHEETS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRHh-u6rZPLRMNhaw2ILjUFgHULwrpkDogwQBREHx6fHIh7k_mduLn4DjftOkRbpAEY8lUrkajwaxQK/pub?output=csv'; 

/**
 * Product data structure
 * Expected CSV columns: name, price, category, image, fabric
 */
let allProducts = [];
let filteredProducts = [];

/**
 * Initialize the store
 */
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    setupFilters();
    setupLogo();
});

/**
 * Load products from Google Sheets CSV
 */
async function loadProducts() {
    const loadingEl = document.getElementById('loading');
    const errorEl = document.getElementById('error');
    const productsGrid = document.getElementById('products-grid');

    try {
        loadingEl.style.display = 'block';
        errorEl.style.display = 'none';
        productsGrid.innerHTML = '';

        // Validate CSV URL
        if (GOOGLE_SHEETS_CSV_URL === 'PASTE_YOUR_GOOGLE_SHEETS_CSV_LINK_HERE') {
            throw new Error('Please paste your Google Sheets CSV link in the GOOGLE_SHEETS_CSV_URL constant above.');
        }

        const response = await fetch(GOOGLE_SHEETS_CSV_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const csvText = await response.text();
        allProducts = parseCSV(csvText);
        
        if (allProducts.length === 0) {
            throw new Error('No products found in CSV. Please check your data format.');
        }

        filteredProducts = [...allProducts];
        renderProducts(filteredProducts);
        loadingEl.style.display = 'none';

    } catch (error) {
        console.error('Error loading products:', error);
        loadingEl.style.display = 'none';
        errorEl.textContent = error.message || 'Failed to load products. Please check your CSV link.';
        errorEl.style.display = 'block';
    }
}

/**
 * Parse CSV text into product objects
 */
function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].toLowerCase().split(',').map(h => h.trim().replace(/"/g, ''));
    
    return lines.slice(1).map(line => {
        const values = line.includes(';') ? line.split(';') : line.split(',');
        const product = {};
        
        headers.forEach((header, index) => {
            product[header] = values[index] || '';
        });
        
        // Ensure required fields
     product.name = product['NOMBRE'] || 'Sin nombre';
product.price = product['PRECIO'] || '0';
product.category = product['CATEGORÍA'] || 'Otros';
product.image = product['LINK_IMAGEN'] || '';
product.fabric = product['DESCRIPCIÓN'] || '250g Catar Fabric';
        
        return product;
    }).filter(product => product.name && product.price);
}

/**
 * Render products in the grid
 */
function renderProducts(products) {
    const productsGrid = document.getElementById('products-grid');
    
    if (products.length === 0) {
        productsGrid.innerHTML = '<div class="no-products">No products found in this category.</div>';
        return;
    }

    productsGrid.innerHTML = products.map(product => createProductCard(product)).join('');
}

/**
 * Create individual product card HTML
 */
function createProductCard(product) {
    const whatsappUrl = `https://wa.me/573337318929?text=Hello%20Original%20House!%20I%20want%20to%20buy%20the%20${encodeURIComponent(product.name)}%20for%20$${product.price}.%20Please%20send%20me%20the%20payment%20details%20for%20Nequi,%20Daviplata,%20or%20Bancolombia.`;
    
    return `
        <article class="product-card" data-category="${product.category.toLowerCase()}">
            <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy">
            <div class="product-category">${product.category}</div>
            <h3 class="product-name">${product.name}</h3>
            <div class="product-price">$${product.price}</div>
            <div class="product-fabric">${product.fabric}</div>
            <button class="whatsapp-btn" onclick="window.open('${whatsappUrl}', '_blank')">
                Buy via WhatsApp
            </button>
        </article>
    `;
}

/**
 * Setup filter buttons
 */
function setupFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filter products
            const filterValue = this.dataset.filter;
            filterProducts(filterValue);
        });
    });
}

/**
 * Filter products by category
 */
function filterProducts(filter) {
    if (filter === 'all') {
        filteredProducts = [...allProducts];
    } else {
        filteredProducts = allProducts.filter(product => 
            product.category.toLowerCase().includes(filter.toLowerCase())
        );
    }
    
    renderProducts(filteredProducts);
}

/**
 * Logo interaction effects
 */
function setupLogo() {
    const logoContainer = document.getElementById('logo-container');
    
    logoContainer.addEventListener('click', function() {
        this.style.animation = 'none';
        setTimeout(() => {
            this.style.animation = 'logoPulse 0.5s ease-in-out';
        }, 10);
    });
    
    // Logo image error handling
    const logoImg = document.getElementById('logo-img');
    logoImg.addEventListener('error', function() {
        this.src = 'https://via.placeholder.com/120/1a1a1a/00ff88?text=OH';
    });
}

/**
 * Smooth scroll and performance optimizations
 */
function optimizePerformance() {
    // Intersection Observer for lazy loading effects
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.product-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

// Re-optimize after rendering products
document.addEventListener('productsRendered', optimizePerformance);

/**
 * Export functions for debugging (remove in production)
 */
window.OriginalHouse = {
    loadProducts,
    filterProducts,
    allProducts: () => allProducts,
    filteredProducts: () => filteredProducts
};
