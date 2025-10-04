document.addEventListener('DOMContentLoaded', () => {
    const summaryItemsContainer = document.getElementById('summary-items');
    const summaryTotalPriceEl = document.getElementById('summary-total-price');
    const checkoutForm = document.getElementById('checkoutForm');
    
    const checkoutItems = JSON.parse(localStorage.getItem('checkoutItems')) || [];

    if (checkoutItems.length === 0) {
        window.location.href = 'dashboard.html';
    }

    let totalPrice = 0;
    summaryItemsContainer.innerHTML = '';

    checkoutItems.forEach(item => {
        totalPrice += item.price;
        const itemDiv = document.createElement('div');
        itemDiv.className = 'summary-item';
        itemDiv.innerHTML = `
            <img src="${item.imageUrl}" alt="${item.name}">
            <div class="summary-item-details">
                <p>${item.name} (Size: ${item.selectedSize})</p>
                <p>₹${item.price.toFixed(2)}</p>
            </div>
        `;
        summaryItemsContainer.appendChild(itemDiv);
    });

    summaryTotalPriceEl.textContent = `₹${totalPrice.toFixed(2)}`;

    checkoutForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const shippingAddress = {
            address: document.getElementById('address').value,
            city: document.getElementById('city').value,
            postalCode: document.getElementById('postalCode').value,
            phone: document.getElementById('phone').value,
        };

        const orderData = {
            orderItems: checkoutItems.map(item => ({
                name: item.name,
                qty: 1,
                imageUrl: item.imageUrl,
                price: item.price,
                selectedSize: item.selectedSize,
                product: item._id
            })),
            shippingAddress,
            paymentMethod: 'Cash on Delivery',
            totalPrice,
        };

        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                showToast('You must be logged in to place an order.');
                return;
            }

            const res = await fetch('http://localhost:5000/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(orderData),
            });

            if (res.ok) {
                localStorage.removeItem('checkoutItems');
                showToast('Order placed successfully!');
                setTimeout(() => window.location.href = 'orders.html', 2000);
            } else {
                const data = await res.json();
                showToast(data.msg || 'Failed to place order.');
            }
        } catch (error) {
            showToast('Server error. Please try again.');
        }
    });

    function showToast(message) {
        const toast = document.getElementById('toast-notification');
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => { toast.classList.remove('show'); }, 3000);
    }
});