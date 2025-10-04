/*document.addEventListener('DOMContentLoaded', async () => {

    let products = {};
    let cart = [];
    let wishlist=[];

    const menuBtn = document.getElementById('menu-btn');
    const closeMenuBtn = document.getElementById('close-menu-btn');
    const sideMenu = document.getElementById('side-menu');
    const cartBtn = document.getElementById('cart-btn');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const cartDrawer = document.getElementById('cart-drawer');
    const categoryGrid = document.getElementById('category-grid');
    const productGrid = document.getElementById('product-grid');
    const categoriesSection = document.getElementById('categories-section');
    const productListingSection = document.getElementById('product-listing-section');
    const productListingTitle = document.getElementById('product-listing-title');
    const backToCategoriesBtn = document.getElementById('back-to-categories-btn');
    const cartItemsContainer = document.getElementById('cart-items');

    function showToast(message) {
        const toast = document.getElementById('toast-notification');
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    function updateCart() {
        const cartCount = document.getElementById('cart-count');
        const cartTotalPrice = document.getElementById('cart-total-price');
        
        cartCount.textContent = cart.length;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
            cartTotalPrice.textContent = '₹0.00';
            return;
        }

        cartItemsContainer.innerHTML = '';
        let total = 0;
        cart.forEach(item => {
            total += item.price;
            const cartItemDiv = document.createElement('div');
            cartItemDiv.className = 'cart-item';
            cartItemDiv.innerHTML = `
                <img src="${item.imageUrl}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <p class="cart-item-name">${item.name} <span class="cart-item-size">(Size: ${item.selectedSize})</span></p>
                    <p class="cart-item-price">₹${item.price.toFixed(2)}</p>
                </div>
                <button class="cart-item-delete" data-id="${item._id}">&times;</button>
            `;
            cartItemsContainer.appendChild(cartItemDiv);
        });
        cartTotalPrice.textContent = `₹${total.toFixed(2)}`;
    }

    function renderCategories() {
        categoryGrid.innerHTML = ''; 
        for (const category in products) {
            const categoryCard = document.createElement('div');
            categoryCard.className = 'category-card';
            categoryCard.dataset.category = category;
            categoryCard.innerHTML = `
                <img src="${products[category][0].imageUrl}" alt="${category}">
                <h3>${category}</h3>
            `;
            categoryGrid.appendChild(categoryCard);
        }
    }

    function renderProducts(category) {
        productListingTitle.textContent = category;
        productGrid.innerHTML = ''; 
        products[category].forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            
            const sizeOptions = product.sizes.split(', ').map(size => 
                `<option value="${size}">${size}</option>`
            ).join('');

            productCard.innerHTML = `
                <img src="${product.imageUrl}" alt="${product.name}">
                <div class="product-card-content">
                    <h3>${product.name}</h3>
                    <p class="product-price">₹${product.price.toFixed(2)}</p>
                    <div class="product-size-selector">
                      <label for="size-select-${product._id}">Size:</label>
                      <select id="size-select-${product._id}" class="size-select">
                        <option value="">Select</option>
                        ${sizeOptions}
                      </select>
                    </div>
                    <div class="product-actions">
                        <button class="btn-wishlist" data-id="${product._id}">
                            <i class="fa-regular fa-heart"></i> Wishlist
                        </button>
                        <button class="btn-add-to-cart" data-id="${product._id}">
                            <i class="fa-solid fa-cart-plus"></i> Add to Cart
                        </button>
                        <button class="btn-primary btn-buy-now" data-id="${product._id}">Buy Now</button>
                    </div>
                </div>
            `;
            productGrid.appendChild(productCard);
        });
        categoriesSection.classList.add('hidden');
        productListingSection.classList.remove('hidden');
    }

    async function loadProducts() {
        try {
            const response = await fetch('http://localhost:5000/api/products');
            if (!response.ok) throw new Error('Network response was not ok');
            products = await response.json(); 
            renderCategories(); 
        } catch (error) {
            console.error("Failed to load products:", error);
            categoryGrid.innerHTML = "<p>Could not load products. Is the server running?</p>";
        }
    }

    menuBtn.addEventListener('click', () => sideMenu.classList.add('open'));
    closeMenuBtn.addEventListener('click', () => sideMenu.classList.remove('open'));

    cartBtn.addEventListener('click', () => cartDrawer.classList.add('open'));
    closeCartBtn.addEventListener('click', () => cartDrawer.classList.remove('open'));

    categoryGrid.addEventListener('click', (e) => {
        const categoryCard = e.target.closest('.category-card');
        if (categoryCard) {
            renderProducts(categoryCard.dataset.category);
        }
    });

    backToCategoriesBtn.addEventListener('click', () => {
        productListingSection.classList.add('hidden');
        categoriesSection.classList.remove('hidden');
    });

    productGrid.addEventListener('click', (e) => {
        const target = e.target.closest('button');
        if (!target) return;
        
        const productId = target.dataset.id;
        const sizeSelect = document.getElementById(`size-select-${productId}`);
        const selectedSize = sizeSelect ? sizeSelect.value : null;

        if (target.classList.contains('btn-add-to-cart') || target.classList.contains('btn-buy-now')) {
            if (!selectedSize) {
                showToast('Please select a size.');
                return;
            }

            let productToAdd;
            for (const category in products) {
                const found = products[category].find(p => p._id === productId);
                if (found) {
                    productToAdd = found;
                    break;
                }
            }

            if (productToAdd) {
                const itemToAdd = {
                    ...productToAdd,
                    selectedSize: selectedSize 
                };

                if (target.classList.contains('btn-add-to-cart')) {
                    cart.push(itemToAdd);
                    updateCart();
                    showToast('Added to Cart!');
                } else if (target.classList.contains('btn-buy-now')) {
                    localStorage.setItem('checkoutItems', JSON.stringify([itemToAdd]));
                    window.location.href = 'checkout.html';
                }
            }
        } else if (target.classList.contains('btn-wishlist')) {
    let productToAdd;
    for (const category in products) {
        const found = products[category].find(p => p._id === productId);
        if (found) {
            productToAdd = found;
            break;
        }
    }

    if (productToAdd) {
        if (!wishlist.some(item => item._id === productId)) {
            wishlist.push(productToAdd);
            localStorage.setItem('wishlistItems', JSON.stringify(wishlist));
            showToast('Added to Wishlist!');
        } else {
            showToast('Already in Wishlist!');
        }
    }
}
    });

    cartItemsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('cart-item-delete')) {
            const productId = e.target.dataset.id;
            cart = cart.filter(item => item._id !== productId); 
            updateCart();
            showToast('Item removed from cart');
        }
    });

    document.querySelector('.checkout-btn').addEventListener('click', () => {
        if (cart.length > 0) {
            localStorage.setItem('checkoutItems', JSON.stringify(cart));
            window.location.href = 'checkout.html';
        } else {
            showToast('Your cart is empty.');
        }
    });

    await loadProducts();
    updateCart();
});*/
document.addEventListener('DOMContentLoaded', async () => {

    let products = {};
    let cart = [];
    let wishlist = [];
    const token = localStorage.getItem('authToken'); // Auth token for wishlist API

    const menuBtn = document.getElementById('menu-btn');
    const closeMenuBtn = document.getElementById('close-menu-btn');
    const sideMenu = document.getElementById('side-menu');
    const cartBtn = document.getElementById('cart-btn');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const cartDrawer = document.getElementById('cart-drawer');
    const categoryGrid = document.getElementById('category-grid');
    const productGrid = document.getElementById('product-grid');
    const categoriesSection = document.getElementById('categories-section');
    const productListingSection = document.getElementById('product-listing-section');
    const productListingTitle = document.getElementById('product-listing-title');
    const backToCategoriesBtn = document.getElementById('back-to-categories-btn');
    const cartItemsContainer = document.getElementById('cart-items');

    function showToast(message) {
        const toast = document.getElementById('toast-notification');
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    function updateCart() {
        const cartCount = document.getElementById('cart-count');
        const cartTotalPrice = document.getElementById('cart-total-price');
        
        cartCount.textContent = cart.length;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
            cartTotalPrice.textContent = '₹0.00';
            return;
        }

        cartItemsContainer.innerHTML = '';
        let total = 0;
        cart.forEach(item => {
            total += item.price;
            const cartItemDiv = document.createElement('div');
            cartItemDiv.className = 'cart-item';
            cartItemDiv.innerHTML = `
                <img src="${item.imageUrl}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <p class="cart-item-name">${item.name} <span class="cart-item-size">(Size: ${item.selectedSize})</span></p>
                    <p class="cart-item-price">₹${item.price.toFixed(2)}</p>
                </div>
                <button class="cart-item-delete" data-id="${item._id}">&times;</button>
            `;
            cartItemsContainer.appendChild(cartItemDiv);
        });
        cartTotalPrice.textContent = `₹${total.toFixed(2)}`;
    }

    function renderCategories() {
        categoryGrid.innerHTML = ''; 
        for (const category in products) {
            const categoryCard = document.createElement('div');
            categoryCard.className = 'category-card';
            categoryCard.dataset.category = category;
            categoryCard.innerHTML = `
                <img src="${products[category][0].imageUrl}" alt="${category}">
                <h3>${category}</h3>
            `;
            categoryGrid.appendChild(categoryCard);
        }
    }

    function renderProducts(category) {
        productListingTitle.textContent = category;
        productGrid.innerHTML = ''; 
        products[category].forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            
            const sizeOptions = product.sizes.split(', ').map(size => 
                `<option value="${size}">${size}</option>`
            ).join('');

            productCard.innerHTML = `
                <img src="${product.imageUrl}" alt="${product.name}">
                <div class="product-card-content">
                    <h3>${product.name}</h3>
                    <p class="product-price">₹${product.price.toFixed(2)}</p>
                    <div class="product-size-selector">
                      <label for="size-select-${product._id}">Size:</label>
                      <select id="size-select-${product._id}" class="size-select">
                        <option value="">Select</option>
                        ${sizeOptions}
                      </select>
                    </div>
                    <div class="product-actions">
                        <button class="btn-wishlist" data-id="${product._id}">
                            <i class="fa-regular fa-heart"></i> Wishlist
                        </button>
                        <button class="btn-add-to-cart" data-id="${product._id}">
                            <i class="fa-solid fa-cart-plus"></i> Add to Cart
                        </button>
                        <button class="btn-primary btn-buy-now" data-id="${product._id}">Buy Now</button>
                    </div>
                </div>
            `;
            productGrid.appendChild(productCard);
        });
        categoriesSection.classList.add('hidden');
        productListingSection.classList.remove('hidden');
    }

    async function loadProducts() {
        try {
            const response = await fetch('http://localhost:5000/api/products');
            if (!response.ok) throw new Error('Network response was not ok');
            products = await response.json(); 
            renderCategories(); 
        } catch (error) {
            console.error("Failed to load products:", error);
            categoryGrid.innerHTML = "<p>Could not load products. Is the server running?</p>";
        }
    }

    menuBtn.addEventListener('click', () => sideMenu.classList.add('open'));
    closeMenuBtn.addEventListener('click', () => sideMenu.classList.remove('open'));

    cartBtn.addEventListener('click', () => cartDrawer.classList.add('open'));
    closeCartBtn.addEventListener('click', () => cartDrawer.classList.remove('open'));

    categoryGrid.addEventListener('click', (e) => {
        const categoryCard = e.target.closest('.category-card');
        if (categoryCard) {
            renderProducts(categoryCard.dataset.category);
        }
    });

    backToCategoriesBtn.addEventListener('click', () => {
        productListingSection.classList.add('hidden');
        categoriesSection.classList.remove('hidden');
    });

    productGrid.addEventListener('click', async (e) => {
        const target = e.target.closest('button');
        if (!target) return;
        
        const productId = target.dataset.id;
        const sizeSelect = document.getElementById(`size-select-${productId}`);
        const selectedSize = sizeSelect ? sizeSelect.value : null;

        if (target.classList.contains('btn-add-to-cart') || target.classList.contains('btn-buy-now')) {
            if (!selectedSize) {
                showToast('Please select a size.');
                return;
            }

            let productToAdd;
            for (const category in products) {
                const found = products[category].find(p => p._id === productId);
                if (found) {
                    productToAdd = found;
                    break;
                }
            }

            if (productToAdd) {
                const itemToAdd = {
                    ...productToAdd,
                    selectedSize: selectedSize 
                };

                if (target.classList.contains('btn-add-to-cart')) {
                    cart.push(itemToAdd);
                    updateCart();
                    showToast('Added to Cart!');
                } else if (target.classList.contains('btn-buy-now')) {
                    localStorage.setItem('checkoutItems', JSON.stringify([itemToAdd]));
                    window.location.href = 'checkout.html';
                }
            }
        } else if (target.classList.contains('btn-wishlist')) {
            if (!token) {
                showToast('Please login to use wishlist.');
                return;
            }

            let productToAdd;
            for (const category in products) {
                const found = products[category].find(p => p._id === productId);
                if (found) {
                    productToAdd = found;
                    break;
                }
            }

            if (productToAdd) {
                try {
                    const res = await fetch('http://localhost:5000/api/users/wishlist', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ productId: productToAdd._id })
                    });
                    if (res.ok) {
                        showToast('Added to Wishlist!');
                    } else {
                        showToast('Failed to add to Wishlist.');
                    }
                } catch (error) {
                    console.error(error);
                    showToast('Server error. Could not add to wishlist.');
                }
            }
        }
    });

    cartItemsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('cart-item-delete')) {
            const productId = e.target.dataset.id;
            cart = cart.filter(item => item._id !== productId); 
            updateCart();
            showToast('Item removed from cart');
        }
    });

    document.querySelector('.checkout-btn').addEventListener('click', () => {
        if (cart.length > 0) {
            localStorage.setItem('checkoutItems', JSON.stringify(cart));
            window.location.href = 'checkout.html';
        } else {
            showToast('Your cart is empty.');
        }
    });

    await loadProducts();
    updateCart();
});
