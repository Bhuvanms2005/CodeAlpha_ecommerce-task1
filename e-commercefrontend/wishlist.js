/*document.addEventListener('DOMContentLoaded', async () => {
    const wishlistGrid = document.getElementById('wishlist-grid');
    const token = localStorage.getItem('authToken');

    function showToast(message) {
        const toast = document.getElementById('toast-notification');
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => { toast.classList.remove('show'); }, 3000);
    }

    async function fetchWishlist() {
        if (!token) {
            wishlistGrid.innerHTML = '<h2>Please log in to see your wishlist.</h2>';
            return;
        }
        try {
            const res = await fetch('http://localhost:5000/api/users/wishlist', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const items = await res.json();
                displayWishlist(items);
            } else {
                wishlistGrid.innerHTML = '<h2>Could not fetch wishlist.</h2>';
            }
        } catch (error) {
            wishlistGrid.innerHTML = '<h2>Server error. Please try again.</h2>';
        }
    }

    function displayWishlist(items) {
        if (items.length === 0) {
            wishlistGrid.innerHTML = '<h2>Your wishlist is empty.</h2>';
            return;
        }
        wishlistGrid.innerHTML = '';
        items.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <img src="${product.imageUrl}" alt="${product.name}">
                <div class="product-card-content">
                    <h3>${product.name}</h3>
                    <p class="product-price">₹${product.price.toFixed(2)}</p>
                    <div class="product-actions">
                        <button class="btn-primary btn-remove-wishlist" data-id="${product._id}">Remove from Wishlist</button>
                    </div>
                </div>
            `;
            wishlistGrid.appendChild(productCard);
        });
    }

    wishlistGrid.addEventListener('click', async (e) => {
        if (e.target.classList.contains('btn-remove-wishlist')) {
            const productId = e.target.dataset.id;
            try {
                const res = await fetch(`http://localhost:5000/api/users/wishlist/${productId}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    showToast('Item removed from wishlist.');
                    fetchWishlist();
                } else {
                    showToast('Failed to remove item.');
                }
            } catch (error) {
                console.error('Failed to remove item');
            }
        }
    });

    await fetchWishlist();
});*/
document.addEventListener('DOMContentLoaded', async () => {
    const wishlistGrid = document.getElementById('wishlist-grid');
    const token = localStorage.getItem('authToken');
    let wishlistItems = [];

    function showToast(message) {
        const toast = document.getElementById('toast-notification');
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => { toast.classList.remove('show'); }, 3000);
    }

    async function fetchWishlist() {
        if (!token) {
            wishlistGrid.innerHTML = '<h2>Please log in to see your wishlist.</h2>';
            return;
        }
        try {
            const res = await fetch('http://localhost:5000/api/users/wishlist', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                wishlistItems = await res.json();
                displayWishlist(wishlistItems);
            } else {
                wishlistGrid.innerHTML = '<h2>Could not fetch wishlist.</h2>';
            }
        } catch (error) {
            wishlistGrid.innerHTML = '<h2>Server error. Please try again.</h2>';
        }
    }

    function displayWishlist(items) {
        if (items.length === 0) {
            wishlistGrid.innerHTML = '<h2>Your wishlist is empty.</h2>';
            return;
        }
        wishlistGrid.innerHTML = '';
        items.forEach(product => {
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
                        <button class="btn-primary btn-buy-now" data-id="${product._id}">Buy Now</button>
                        <button class="btn-remove-wishlist" data-id="${product._id}">Remove</button>
                    </div>
                </div>
            `;
            wishlistGrid.appendChild(productCard);
        });
    }

    wishlistGrid.addEventListener('click', async (e) => {
        const target = e.target;
        if (!target.matches('button')) return;

        const productId = target.dataset.id;
        
        if (target.classList.contains('btn-remove-wishlist')) {
            try {
                const res = await fetch(`http://localhost:5000/api/users/wishlist/${productId}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    showToast('Item removed from wishlist.');
                    fetchWishlist();
                } else {
                    showToast('Failed to remove item.');
                }
            } catch (error) {
                console.error('Failed to remove item');
            }
        }

        if (target.classList.contains('btn-buy-now')) {
            const sizeSelect = document.getElementById(`size-select-${productId}`);
            const selectedSize = sizeSelect ? sizeSelect.value : null;

            if (!selectedSize) {
                showToast('Please select a size.');
                return;
            }

            const itemToBuy = wishlistItems.find(item => item._id === productId);

            if (itemToBuy) {
                const checkoutItem = {
                    ...itemToBuy,
                    selectedSize: selectedSize
                };
                localStorage.setItem('checkoutItems', JSON.stringify([checkoutItem]));
                window.location.href = 'checkout.html';
            }
        }
    });

    await fetchWishlist();
});