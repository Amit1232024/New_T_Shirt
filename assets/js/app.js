const productGrid = document.querySelector('.product-grid');
const searchInput = document.querySelector('#search');
const categorySelect = document.querySelector('#category');
const fitSelect = document.querySelector('#fit');
const cartButton = document.querySelector('[data-action="view-cart"]');
const searchButton = document.querySelector('[data-action="open-search"]');
const searchModal = document.querySelector('.search-modal');
const cartModal = document.querySelector('.cart-modal');
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('#nav-menu');
const yearSpan = document.querySelector('#year');
const animateTargets = document.querySelectorAll('[data-animate]');
const lookbookSlider = document.querySelector('.lookbook-slider');
const lookbookControls = document.querySelectorAll('[data-scroll]');

const products = [
    {
        id: 'azf-01',
        name: 'Lagos Dawn Tee',
        price: 48,
        category: 'everyday',
        fit: 'classic',
        color: 'Sage Green',
        image: 'https://images.unsplash.com/photo-1475180098004-ca77a66827be?auto=format&fit=crop&w=900&q=80',
        badges: ['Best Seller', 'Organic'],
    },
    {
        id: 'azf-02',
        name: 'Pixel Beat Graphic Tee',
        price: 56,
        category: 'statement',
        fit: 'relaxed',
        color: 'Ink Black',
        image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80',
        badges: ['Limited', 'Artist Collab'],
    },
    {
        id: 'azf-03',
        name: 'Celestial Fade Tee',
        price: 52,
        category: 'statement',
        fit: 'oversized',
        color: 'Cosmic Purple',
        image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=80',
        badges: ['New', 'Hand-dyed'],
    },
    {
        id: 'azf-04',
        name: 'Canvas Core Tee',
        price: 42,
        category: 'everyday',
        fit: 'classic',
        color: 'Bone White',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80',
        badges: ['Essential', 'Unisex'],
    },
    {
        id: 'azf-05',
        name: 'Bio-Dye Drift Tee',
        price: 60,
        category: 'eco',
        fit: 'relaxed',
        color: 'Ocean Mist',
        image: 'https://images.unsplash.com/photo-1495107334309-fcf20504a5ab?auto=format&fit=crop&w=900&q=80',
        badges: ['Eco Luxe', 'Waterless'],
    },
    {
        id: 'azf-06',
        name: 'Archive Script Tee',
        price: 50,
        category: 'statement',
        fit: 'classic',
        color: 'Charcoal',
        image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=900&q=80',
        badges: ['Typography', 'Limited'],
    },
    {
        id: 'azf-07',
        name: 'Solar Bloom Tee',
        price: 58,
        category: 'eco',
        fit: 'oversized',
        color: 'Marigold',
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=80',
        badges: ['Plant Dye', 'Vegan'],
    },
    {
        id: 'azf-08',
        name: 'Monochrome Atlas Tee',
        price: 46,
        category: 'everyday',
        fit: 'relaxed',
        color: 'Steel Grey',
        image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=80',
        badges: ['Restock', 'Heavyweight'],
    },
];

const cart = [];

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);
}

function createProductCard(product) {
    const card = document.createElement('article');
    card.classList.add('product-card');
    card.innerHTML = `
        <img src="${product.image}" alt="${product.name}" loading="lazy" />
        <div class="product-meta">
            <h3>${product.name}</h3>
            <span>${formatCurrency(product.price)}</span>
        </div>
        <p class="product-color">${product.color}</p>
        <div class="badges">
            ${product.badges.map((badge) => `<span class="badge">${badge}</span>`).join('')}
        </div>
        <button class="btn primary" type="button" data-product="${product.id}">Add to cart</button>
    `;
    return card;
}

function renderProducts(items) {
    productGrid.innerHTML = '';
    if (!items.length) {
        productGrid.innerHTML = '<p>No products match your filters yet. Try a different combination.</p>';
        return;
    }

    const fragment = document.createDocumentFragment();
    items.forEach((product) => {
        fragment.appendChild(createProductCard(product));
    });
    productGrid.appendChild(fragment);
}

function filterProducts() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const category = categorySelect.value;
    const fit = fitSelect.value;

    const filtered = products.filter((product) => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm) || product.color.toLowerCase().includes(searchTerm);
        const matchesCategory = category === 'all' || product.category === category;
        const matchesFit = fit === 'all' || product.fit === fit;

        return matchesSearch && matchesCategory && matchesFit;
    });

    renderProducts(filtered);
}

function toggleCartModal() {
    if (typeof cartModal.showModal === 'function') {
        cartModal.hasAttribute('open') ? cartModal.close() : cartModal.showModal();
    }
}

function toggleSearchModal() {
    if (typeof searchModal.showModal === 'function') {
        searchModal.hasAttribute('open') ? searchModal.close() : searchModal.showModal();
    }
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelector('.cart-count').textContent = count;
}

function updateCartTotal() {
    const total = cart.reduce((sum, item) => sum + item.quantity * item.price, 0);
    document.querySelector('[data-cart-total]').textContent = formatCurrency(total);
}

function renderCart() {
    const cartList = document.querySelector('.cart-items');
    cartList.innerHTML = '';

    if (cart.length === 0) {
        cartList.innerHTML = '<li>Your cart is empty. Add your favorite Azf-T Shirts!</li>';
        updateCartTotal();
        return;
    }

    const fragment = document.createDocumentFragment();

    cart.forEach((item) => {
        const li = document.createElement('li');
        li.classList.add('cart-item');
        li.innerHTML = `
            <img src="${item.image}" alt="${item.name}" />
            <div>
                <h3>${item.name}</h3>
                <p>${item.quantity} × ${formatCurrency(item.price)}</p>
            </div>
            <button class="btn ghost" type="button" data-remove="${item.id}">Remove</button>
        `;
        fragment.appendChild(li);
    });

    cartList.appendChild(fragment);
    updateCartTotal();
}

function addToCart(productId) {
    const product = products.find((item) => item.id === productId);
    if (!product) return;

    const existing = cart.find((item) => item.id === productId);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    updateCartCount();
    renderCart();
    toggleCartModal();
}

function removeFromCart(productId) {
    const index = cart.findIndex((item) => item.id === productId);
    if (index >= 0) {
        cart.splice(index, 1);
        updateCartCount();
        renderCart();
    }
}

function handleCartClick(event) {
    const productId = event.target.dataset.product;
    if (productId) {
        addToCart(productId);
    }

    const removeId = event.target.dataset.remove;
    if (removeId) {
        removeFromCart(removeId);
    }
}

function initNavigation() {
    navToggle?.addEventListener('click', () => {
        const isOpen = navMenu.dataset.open === 'true';
        navMenu.dataset.open = String(!isOpen);
        navToggle.setAttribute('aria-expanded', String(!isOpen));
    });

    navMenu?.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            navMenu.dataset.open = 'false';
            navToggle.setAttribute('aria-expanded', 'false');
        });
    });
}

function initModals() {
    cartButton?.addEventListener('click', toggleCartModal);
    searchButton?.addEventListener('click', toggleSearchModal);

    searchModal?.addEventListener('cancel', () => searchModal.close());
    cartModal?.addEventListener('cancel', () => cartModal.close());

    searchModal?.querySelector('form')?.addEventListener('submit', (event) => {
        event.preventDefault();
        const value = event.currentTarget.querySelector('input').value;
        searchInput.value = value;
        filterProducts();
        searchModal.close();
    });

    cartModal?.querySelector('form')?.addEventListener('submit', (event) => {
        event.preventDefault();
        alert('Checkout feature coming soon!');
        cartModal.close();
    });
}

function initFilters() {
    searchInput?.addEventListener('input', filterProducts);
    categorySelect?.addEventListener('change', filterProducts);
    fitSelect?.addEventListener('change', filterProducts);
}

function initReveal() {
    if (!animateTargets.length) {
        return;
    }

    if (!('IntersectionObserver' in window)) {
        animateTargets.forEach((target) => {
            target.classList.add('is-visible');
        });
        return;
    }

    const observer = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const delay = Number.parseInt(entry.target.dataset.animateDelay || '0', 10);
                    if (delay) {
                        entry.target.style.transitionDelay = `${delay / 1000}s`;
                    }
                    entry.target.classList.add('is-visible');
                    obs.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.15,
            rootMargin: '0px 0px -10% 0px',
        }
    );

    animateTargets.forEach((target) => observer.observe(target));
}

function initLookbook() {
    if (!lookbookSlider || !lookbookControls.length) {
        return;
    }

    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)');

    lookbookControls.forEach((button) => {
        button.addEventListener('click', () => {
            const direction = button.dataset.scroll;
            if (!direction) return;

            const offset = lookbookSlider.clientWidth * 0.85;
            lookbookSlider.scrollBy({
                left: direction === 'next' ? offset : -offset,
                behavior: prefersReducedMotion?.matches ? 'auto' : 'smooth',
            });
        });
    });
}

function initYear() {
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}

function init() {
    renderProducts(products);
    updateCartCount();
    renderCart();
    initFilters();
    initNavigation();
    initModals();
    initReveal();
    initLookbook();
    initYear();

    productGrid?.addEventListener('click', handleCartClick);
    cartModal?.addEventListener('click', (event) => {
        const dialogDimensions = cartModal.getBoundingClientRect();
        if (
            event.clientX < dialogDimensions.left ||
            event.clientX > dialogDimensions.right ||
            event.clientY < dialogDimensions.top ||
            event.clientY > dialogDimensions.bottom
        ) {
            cartModal.close();
        }
    });
}

document.addEventListener('DOMContentLoaded', init);
