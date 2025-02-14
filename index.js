// Initialize EmailJS
emailjs.init({
    publicKey: 'sd6n7C7kp18O5X_9E',
    blockHeadless: true,
    blockList: {
        list: ['foo@emailjs.com', 'bar@emailjs.com'],
        watchVariable: 'userEmail',
    },
    limitRate: {
        id: 'app',
        throttle: 10000,
    },
});

// Fetch products from JSON
fetch('products.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(products => {
        const productGrid = document.getElementById('product-grid');

        // Check if productGrid exists
        if (!productGrid) {
            console.error('Product grid element not found in the DOM.');
            return;
        }

        // Check if products array is empty
        if (!products || products.length === 0) {
            productGrid.innerHTML = '<p>No products available.</p>';
            return;
        }

        // Loop through products and create product cards
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');

            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}" onerror="this.src='assets/placeholder-image.jpg';">
                <h3>${product.name}</h3>
                <p>$${product.price}</p>
                <button onclick="addToCart(${product.id})">Add to Cart</button>
            `;

            productGrid.appendChild(productCard);
        });
    })
    .catch(error => {
        console.error('Error loading products:', error);

        // Display an error message in the product grid
        const productGrid = document.getElementById('product-grid');
        if (productGrid) {
            productGrid.innerHTML = '<p>Failed to load products. Please try again later.</p>';
        }
    });

// Cart functionality
let cart = [];

// Open cart modal
document.querySelector('.cart-icon').addEventListener('click', () => {
    document.getElementById('cart-modal').style.display = 'block';
    updateCartDisplay();
});

// Close cart modal
document.getElementById('close-cart').addEventListener('click', () => {
    document.getElementById('cart-modal').style.display = 'none';
});

// Add to cart
function addToCart(productId) {
    fetch('products.json')
        .then(response => response.json())
        .then(products => {
            const product = products.find(p => p.id === productId);
            if (!product) {
                console.error('Product not found:', productId);
                return;
            }

            const existingItem = cart.find(item => item.id === productId);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ ...product, quantity: 1 });
            }

            // Save cart to localStorage
            localStorage.setItem('cart', JSON.stringify(cart));

            updateCartCount();
            updateCartDisplay();
        })
        .catch(error => console.error('Error adding to cart:', error));
}

// Update cart count
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    cartCount.textContent = cart.length;
}

// Update cart display
function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    const cartTotalPrice = document.getElementById('cart-total-price');
    let total = 0;

    cartItems.innerHTML = '';
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p>$${item.price} x ${item.quantity}</p>
            </div>
            <span class="cart-item-remove" onclick="removeFromCart(${item.id})">Remove</span>
        `;
        cartItems.appendChild(cartItem);
        total += item.price * item.quantity;
    });

    cartTotalPrice.textContent = total.toFixed(2);
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart)); // Save updated cart to localStorage
    updateCartCount();
    updateCartDisplay();
}

// Redirect to checkout page
function checkout() {
    // Save cart data to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    window.location.href = 'checkout.html';
}