// Constants for DOM elements
const cartButton = document.querySelector('.cart-button button');
const cartModal = document.querySelector('.cart-modal');
const cartCloseButton = document.querySelector('.cart-close');
const authorModal = document.querySelector('.author-modal');
const authorCloseButton = document.querySelector('.author-close');
const cartItemsList = document.querySelector('#cart-items-list');
const checkoutButton = document.querySelector('#checkout-btn');
const yearSpan = document.querySelector('#year');
const productContainer = document.querySelector('.product-container');

// Cart-related functionality
let cart = [];

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Load cart from localStorage
function loadCart() {
    const storedCart = JSON.parse(localStorage.getItem('cart'));
    if (storedCart) {
        cart = storedCart;
    }
}

// Update the cart button text and visibility
function updateCartButton() {
    if (cart.length > 0) {
        cartButton.textContent = `Cart (${cart.length})`;
        cartButton.style.display = 'block';
    } else {
        cartButton.style.display = 'none';
    }
}

// Add item to cart
function addToCart(product) {
    cart.push(product);
    saveCart();
    updateCartButton();
    renderCartItems();
}

// Render cart items
function renderCartItems() {
    cartItemsList.innerHTML = ''; // Clear existing list
    let total = 0;

    cart.forEach((item) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <span>${item.name}</span>
            <span>$${item.price.toFixed(2)}</span>
        `;
        cartItemsList.appendChild(listItem);
        total += item.price;
    });

    const totalElement = document.createElement('li');
    totalElement.innerHTML = `<strong>Total: $${total.toFixed(2)}</strong>`;
    cartItemsList.appendChild(totalElement);
}

// Handle cart modal display
cartButton.addEventListener('click', () => {
    cartModal.style.display = 'flex';
});

cartCloseButton.addEventListener('click', () => {
    cartModal.style.display = 'none';
});

// Close modal when clicking outside the content
cartModal.addEventListener('click', (e) => {
    if (e.target === cartModal) {
        cartModal.style.display = 'none';
    }
});

function clearCart() {
    cart = [];
    saveCart();
    updateCartButton();
    renderCartItems();
    console.log("Cart has been cleared.");
}

// Handle checkout button (For now, it's just a placeholder)
checkoutButton.addEventListener('click', () => {
    alert('Proceeding to checkout...');
});

// Load products and generate product cards
function fetchProducts() {
    fetch('assets/json/products.json')
        .then(response => response.json())
        .then(products => {
            generateProductCards(products);
        })
        .catch(error => {
            console.error('Error fetching the products:', error);
        });
}

// Generate product cards dynamically
function generateProductCards(products) {
    productContainer.innerHTML = ''; // Clear existing products

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>by ${product.author}</p>
            <p>$${product.price.toFixed(2)}</p>
            <button class="add-to-cart" data-product-id="${product.id}">Add to Cart</button>
        `;
        
        const addToCartButton = productCard.querySelector('.add-to-cart');
        addToCartButton.addEventListener('click', () => {
            addToCart({
                id: product.id,
                name: product.name,
                price: product.price
            });
        });

        productContainer.appendChild(productCard);
    });
}

function setupFilters(products) {
    const categoryFilter = document.querySelector('#category');
    const searchInput = document.querySelector('#search');
    const productContainer = document.querySelector('.product-container');

    function applyFilters() {
        const category = categoryFilter.value.trim().toLowerCase();
        const searchQuery = searchInput.value.trim().toLowerCase();

        const filteredProducts = products.filter(product => {
            // Check category match (if "all", show everything)
            const categoryMatch = 
                category === 'all' || 
                product.tags.some(tag => tag.toLowerCase() === category);

            // Check search match (searching in multiple fields)
            const searchMatch = [product.name, product.author, product.id, product.isbn, product.description, ...product.tags]
                .some(field => field && field.toString().toLowerCase().includes(searchQuery));

            return categoryMatch && searchMatch;
        });

        generateProductCards(filteredProducts);
    }

    // Attach event listeners
    categoryFilter.addEventListener('change', applyFilters);
    searchInput.addEventListener('input', applyFilters);

    // Initial call to show products
    generateProductCards(products);
}

fetch('assets/json/products.json')
    .then(response => response.json())
    .then(products => {
        setupFilters(products);
    })
    .catch(error => console.error('Error loading products:', error));

// Load cart and products on page load
document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    updateCartButton();
    renderCartItems();
    fetchProducts();
    yearSpan.textContent = new Date().getFullYear();
});