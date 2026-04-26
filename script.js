const GOOGLE_SHEETS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRHh-u6rZPLRMNhaw2ILjUFgHULwrpkDogwQBREHx6fHIh7k_mduLn4DjftOkRbpAEY8lUrkajwaxQK/pub?output=csv';

let allProducts = [];
let filteredProducts = [];

document.addEventListener('DOMContentLoaded', function () {
    loadProducts();
    setupFilters();
    setupLogo();
});

/* =================================
   CARGAR PRODUCTOS
================================= */
async function loadProducts() {
    const loadingEl = document.getElementById('loading');
    const errorEl = document.getElementById('error');
    const grid = document.getElementById('products-grid');

    try {
        if (loadingEl) loadingEl.style.display = 'block';
        if (errorEl) errorEl.style.display = 'none';
        if (grid) grid.innerHTML = '';

        const response = await fetch(GOOGLE_SHEETS_CSV_URL);
        const csvText = await response.text();

        allProducts = parseCSV(csvText);
        filteredProducts = [...allProducts];

        renderProducts(filteredProducts);

        if (loadingEl) loadingEl.style.display = 'none';

    } catch (error) {
        console.error('ERROR:', error);

        if (loadingEl) loadingEl.style.display = 'none';

        if (errorEl) {
            errorEl.style.display = 'block';
            errorEl.innerHTML = 'Error cargando productos';
        }
    }
}

/* =================================
   PARSE CSV
================================= */
function parseCSV(text) {
    const lines = text
        .split(/\r?\n/)
        .filter(line => line.trim() !== '');

    if (!lines.length) return [];

    const headers = splitCSVLine(lines[0]);

    return lines.slice(1).map(line => {
        const values = splitCSVLine(line);
        const product = {};

        headers.forEach((header, i) => {
            product[header.trim()] = values[i] || '';
        });

        /* 
        AQUÍ ESTÁ LA SOLUCIÓN REAL:
        soporta columnas con tilde y sin tilde
        */

        const category =
            product['CATEGORÍA'] ||
            product['CATEGORIA'] ||
            product['CATEGORY'] ||
            '';

        const description =
            product['DESCRIPCIÓN'] ||
            product['DESCRIPCION'] ||
            product['DESCRIPTION'] ||
            '';

        return {
            name:
                product['NOMBRE'] ||
                product['NAME'] ||
                'Sin nombre',

            price:
                product['PRECIO'] ||
                product['PRICE'] ||
                '0',

            category:
                category
                    .toString()
                    .trim()
                    .toLowerCase(),

            image:
                product['LINK_IMAGEN'] ||
                product['IMAGEN'] ||
                product['IMAGE'] ||
                '',

            description:
                description
                    .toString()
                    .trim(),

            fabric:
                'Algodón Catar 250 Gramos Oversize'
        };
    });
}

/* =================================
   DIVIDIR CSV CORRECTAMENTE
================================= */
function splitCSVLine(line) {
    const result = [];
    let current = '';
    let insideQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
            insideQuotes = !insideQuotes;
        } 
        else if (char === ',' && !insideQuotes) {
            result.push(current);
            current = '';
        } 
        else {
            current += char;
        }
    }

    result.push(current);

    return result.map(item =>
        item
            .replace(/^"|"$/g, '')
            .trim()
    );
}

/* =================================
   RENDER PRODUCTOS
================================= */
function renderProducts(products) {
    const grid = document.getElementById('products-grid');

    if (!grid) return;

    if (!products.length) {
        grid.innerHTML = `
            <div class="no-products">
                No products found
            </div>
        `;
        return;
    }

    grid.innerHTML = products
        .map(product => createProductCard(product))
        .join('');
}

/* =================================
   CARD PRODUCTO
================================= */
function createProductCard(product) {
    const mensaje = `Hola 👋, vengo desde la página web de Original House.

Estoy interesado(a) en este producto:
🧢 ${product.name}
💰 $${product.price}

¿Está disponible?
Gracias 🙌`;

    const whatsappUrl =
        `https://wa.me/573337318929?text=${encodeURIComponent(mensaje)}`;

    return `
        <article class="product-card" data-category="${product.category}">
            <img
                src="${product.image}"
                alt="${product.name}"
                class="product-image"
            >

            <div class="product-info">
                <h3 class="product-name">
                    ${product.name}
                </h3>

                <div class="product-price">
                    $${product.price}
                </div>

                <p class="product-description">
                    ${product.description}
                </p>

                <div class="product-fabric">
                    ${product.fabric}
                </div>

                <button
                    class="whatsapp-btn"
                    onclick="window.open('${whatsappUrl}', '_blank')"
                >
                    Comprar por WhatsApp
                </button>
            </div>
        </article>
    `;
}

/* =================================
   FILTROS (CORREGIDO)
================================= */
function setupFilters() {
    const buttons = document.querySelectorAll('.filter-btn');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(button =>
                button.classList.remove('active')
            );

            btn.classList.add('active');

            const filter = btn.dataset.filter
                .trim()
                .toLowerCase();

            if (filter === 'all') {
                filteredProducts = [...allProducts];
            } else {
                filteredProducts = allProducts.filter(product =>
                    product.category === filter
                );
            }

            renderProducts(filteredProducts);
        });
    });
}

/* =================================
   LOGO
================================= */
function setupLogo() {
    const logo = document.getElementById('logo-container');

    if (!logo) return;

    logo.addEventListener('click', () => {
        logo.style.transform = 'scale(0.95)';

        setTimeout(() => {
            logo.style.transform = 'scale(1)';
        }, 150);
    });
}
