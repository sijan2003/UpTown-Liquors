const products = [
    {
        "id": 1,
        "name": "Old Durbar Black Chimney Whiskey 750ml",
        "category": "Whiskey",
        "price": 3500,
        "image": "images\\old durbar.png"
    },
    {
        "id": 2,
        "name": "Jack Daniel's Old No. 7 750ml",
        "category": "Whiskey",
        "price": 5850,
        "image": "images\\jd.png"
    },
    {
        "id": 11,
        "name": "Golden Oak 750ml",
        "category": "Whiskey",
        "price": 1850,
        "image": "images/66604476509171663638037233787565871453288.png"
    },
    {
        "id": 3,
        "name": "Big Master Red Wine 750ml",
        "category": "Wine",
        "price": 750,
        "image": "images/23156200088726937132501059709713398776839668.png"
    },
    {
        "id": 4,
        "name": "Divine Wine (Red) 750ml",
        "category": "Wine",
        "price": 800,
        "image": "images/558738887147736860546432177695416418667468644.png"
    },
    {
        "id": 5,
        "name": "Tuborg Beer Can 500ml",
        "category": "Beer",
        "price": 280,
        "image": "images\\tuborg.png"
    },
    {
        "id": 6,
        "name": "Gorkha Beer Bottle 650ml",
        "category": "Beer",
        "price": 310,
        "image": "images\\gorkha.png"
    },
    {
        "id": 12,
        "name": "Nepal Ice Natura Beer Can 500ml",
        "category": "Beer",
        "price": 260,
        "image": "images/72590397552272494279041117405584769390508.png"
    },
    {
        "id": 7,
        "name": "Absolute Vodka 750ml",
        "category": "Vodka",
        "price": 4200,
        "image": "images/absolut.png"
    },
    {
        "id": 13,
        "name": "Ruslan Vodka 750ml",
        "category": "Vodka",
        "price": 1650,
        "image": "images/ruslan.png"
    },
    {
        "id": 8,
        "name": "Khukri XXX Rum 750ml",
        "category": "Rum",
        "price": 1150,
        "image": "images\\khukri.png"
    },
    {
        "id": 14,
        "name": "Old Monk Rum 750ml",
        "category": "Rum",
        "price": 1250,
        "image": "images\\old monk.png"
    },
    {
        "id": 9,
        "name": "Coca-Cola Bottle 2.25L",
        "category": "Softdrinks",
        "price": 180,
        "image": "images\\coca cola.png"
    },
    {
        "id": 10,
        "name": "Sprite Bottle 1.5L",
        "category": "Softdrinks",
        "price": 150,
        "image": "images/sprite.png"
    }
];

// Age Verification
const ageVerification = document.getElementById('age-verification');
const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');

const now = Date.now();
const oneDay = 24 * 60 * 60 * 1000;
const storedAge = JSON.parse(localStorage.getItem('ageVerified'));

if (!storedAge || storedAge.timestamp < now - oneDay) {
    ageVerification.style.display = 'flex';
}

yesBtn.addEventListener('click', () => {
    localStorage.setItem('ageVerified', JSON.stringify({ verified: true, timestamp: now }));
    ageVerification.style.display = 'none';
    document.querySelector('#search-input').focus();
});

noBtn.addEventListener('click', () => {
    window.location.href = 'https://www.google.com';
});

// Cart Logic
let cart = JSON.parse(localStorage.getItem('cart')) || [];
const cartElement = document.getElementById('cart');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const cartIcon = document.getElementById('cart-icon');
const cartCount = document.getElementById('cart-count');
const checkoutBtn = document.querySelector('.checkout-btn');
const toast = document.getElementById('toast');
const loading = document.getElementById('loading');

cartIcon.addEventListener('click', () => {
    cartElement.classList.toggle('open');
});

cartIcon.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        cartElement.classList.toggle('open');
    }
});

const closeCartBtn = document.querySelector('.close-cart');
closeCartBtn.addEventListener('click', () => {
    cartElement.classList.remove('open');
});

cartElement.addEventListener('click', (e) => {
    if (e.target === cartElement) {
        cartElement.classList.remove('open');
    }
});

// Swipe to close
let touchStartX = 0;
cartElement.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
});
cartElement.addEventListener('touchmove', (e) => {
    let touchEndX = e.touches[0].clientX;
    if (touchStartX - touchEndX > 50) {
        cartElement.classList.remove('open');
    }
});

function updateCart() {
    cartItems.innerHTML = '';
    let total = 0;
    let totalItems = 0;

    cart.forEach(item => {
        const price = Number(item.price) || 0;
        const quantity = Number(item.quantity) || 1;
        total += price * quantity;
        totalItems += quantity;
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <span>${item.name}</span>
            <span>
                NPR ${price} ×
                <input type="number" min="1" value="${quantity}" data-id="${item.id}" class="quantity-input">
            </span>
            <button class="remove-item" data-id="${item.id}" aria-label="Remove ${item.name} from cart">Remove</button>
        `;
        cartItems.appendChild(div);
    });

    cartTotal.textContent = `Total: NPR ${total.toFixed(2)}`;
    cartCount.textContent = totalItems;
    checkoutBtn.disabled = cart.length === 0;
    localStorage.setItem('cart', JSON.stringify(cart));

    // Quantity update
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', (e) => {
            const id = parseInt(e.target.dataset.id);
            const quantity = parseInt(e.target.value) || 1;
            const item = cart.find(i => i.id === id);
            if (item) {
                item.quantity = quantity;
                updateCart();
                showToast('Quantity updated!');
            }
        });
    });

    // Remove item
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            cart = cart.filter(item => item.id !== id);
            updateCart();
            showToast('Item removed from cart!');
        });
    });
}

// Products Display
const productsElement = document.getElementById('products');
function displayProducts(filteredProducts) {
    productsElement.innerHTML = '';
    if (filteredProducts.length === 0) {
        productsElement.innerHTML = '<p>No products found.</p>';
        return;
    }

    filteredProducts.forEach(product => {
        const div = document.createElement('div');
        div.className = 'product-card';
        const imgSrc = product.image || '';
        div.innerHTML = `
            <img src="${imgSrc.replace(/\\/g, '/')}" alt="${product.name}" onerror="this.src='';this.alt='Image not available';">
            <h3>${product.name}</h3>
            <p>NPR ${product.price}</p>
            <button class="add-to-cart" data-id="${product.id}" aria-label="Add ${product.name} to cart">Add to Cart</button>
        `;
        productsElement.appendChild(div);
    });

    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            const product = products.find(p => p.id === id);
            const cartItem = cart.find(item => item.id === id);
            if (cartItem) {
                cartItem.quantity += 1;
            } else {
                cart.push({ ...product, quantity: 1 });
            }
            updateCart();
            showToast('Item added to cart!');
        });
    });
}

// Categories Filter
const categoryButtons = document.querySelectorAll('.category-btn');
categoryButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        categoryButtons.forEach(b => {
            b.classList.remove('active');
            b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        const category = btn.dataset.category;
        loading.style.display = 'block';
        setTimeout(() => {
            const filteredProducts = category === 'all' ? products : products.filter(p => p.category === category);
            displayProducts(filteredProducts);
            loading.style.display = 'none';
        }, 300);
    });
});

// Search Functionality
const searchInput = document.getElementById('search-input');
searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase().trim();
    loading.style.display = 'block';
    setTimeout(() => {
        const filteredProducts = products.filter(p => 
            p.name.toLowerCase().includes(query) || 
            p.category.toLowerCase().includes(query)
        );
        displayProducts(filteredProducts);
        loading.style.display = 'none';
    }, 300);
});

// Toast Notification
let toastQueue = [];
function showToast(message) {
    toastQueue.push(message);
    if (toastQueue.length === 1) {
        displayNextToast();
    }
}

function displayNextToast() {
    if (toastQueue.length === 0) return;
    toast.textContent = toastQueue[0];
    toast.style.display = 'block';
    setTimeout(() => {
        toast.style.display = 'none';
        toastQueue.shift();
        displayNextToast();
    }, 2000);
}

// Checkout with Enhanced Flow
checkoutBtn.addEventListener('click', () => {
    if (cart.length > 0) {
        // Step 1: Show cart summary in an alert
        let cartSummary = 'Order Summary:\n\n';
        let total = 0;
        cart.forEach(item => {
            const price = Number(item.price) || 0;
            const quantity = Number(item.quantity) || 1;
            const itemTotal = price * quantity;
            total += itemTotal;
            cartSummary += `${item.name} - NPR ${price} × ${quantity} = NPR ${itemTotal.toFixed(2)}\n`;
        });
        cartSummary += `\nTotal: NPR ${total.toFixed(2)}`;

        // Step 2: Confirm order placement
        const confirmOrder = window.confirm(`${cartSummary}\n\nAre you sure you want to place this order with Cash on Delivery?`);
        if (confirmOrder) {
            // Step 3: Prompt for phone number
            const phoneNumber = window.prompt('Please enter your phone number for delivery coordination:');
            if (phoneNumber) {
                // Step 4: Simulate order placement
                const orderId = Math.floor(Math.random() * 1000000); // Random order ID
                const confirmationMessage = `Thank you for your order!\n\nOrder ID: ${orderId}\nTotal: NPR ${total.toFixed(2)}\nPhone: ${phoneNumber}\n\nWe will call you to confirm the order and arrange delivery.`;
                window.alert(confirmationMessage);
                
                // Step 5: Clear cart and close
                cart = [];
                updateCart();
                cartElement.classList.remove('open');
            } else {
                showToast('Order cancelled. Please provide a phone number to proceed.');
            }
        }
    }
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
            target.focus({ preventScroll: true });
        }
    });
});

// Initial Load
setTimeout(() => {
    displayProducts(products);
    updateCart();
    loading.style.display = 'none';
}, 300);