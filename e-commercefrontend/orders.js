/*document.addEventListener('DOMContentLoaded', async () => {
    const ordersContainer = document.getElementById('orders-container');

    async function fetchMyOrders() {
        const token = localStorage.getItem('authToken');
        if (!token) {
            ordersContainer.innerHTML = '<h2>Please log in to see your orders.</h2>';
            return;
        }

        try {
            const res = await fetch('http://localhost:5000/api/orders/myorders', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                const orders = await res.json();
                displayOrders(orders);
            } else {
                ordersContainer.innerHTML = '<h2>Could not fetch orders.</h2>';
            }
        } catch (error) {
            ordersContainer.innerHTML = '<h2>Server error. Please try again.</h2>';
        }
    }

    function displayOrders(orders) {
        if (orders.length === 0) {
            ordersContainer.innerHTML = '<h2>You have no orders yet.</h2>';
            return;
        }

        ordersContainer.innerHTML = '';
        orders.forEach(order => {
            const orderCard = document.createElement('div');
            orderCard.className = 'order-card';

            const orderDate = new Date(order.createdAt).toLocaleDateString();

            const itemsHtml = order.orderItems.map(item => `
                <div class="order-item">
                    <img src="${item.imageUrl}" alt="${item.name}">
                    <div>
                        <p><strong>${item.name}</strong> (Size: ${item.selectedSize})</p>
                        <p>₹${item.price.toFixed(2)}</p>
                    </div>
                </div>
            `).join('');

            orderCard.innerHTML = `
                <div class="order-header">
                    <div>
                        <strong>Order Date:</strong> ${orderDate}
                    </div>
                    <div>
                        <strong>Total:</strong> ₹${order.totalPrice.toFixed(2)}
                    </div>
                </div>
                <div class="order-body">
                    ${itemsHtml}
                </div>
            `;
            ordersContainer.appendChild(orderCard);
        });
    }

    await fetchMyOrders();
});*/
document.addEventListener('DOMContentLoaded', async () => {
    const ordersContainer = document.getElementById('orders-container');

    function showToast(message) {
        const toast = document.getElementById('toast-notification');
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => { toast.classList.remove('show'); }, 3000);
    }

    async function fetchMyOrders() {
        const token = localStorage.getItem('authToken');
        if (!token) {
            ordersContainer.innerHTML = '<h2>Please log in to see your orders.</h2>';
            return;
        }

        try {
            const res = await fetch('http://localhost:5000/api/orders/myorders', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                const orders = await res.json();
                displayOrders(orders);
            } else {
                ordersContainer.innerHTML = '<h2>Could not fetch orders.</h2>';
            }
        } catch (error) {
            ordersContainer.innerHTML = '<h2>Server error. Please try again.</h2>';
        }
    }

    function displayOrders(orders) {
        if (orders.length === 0) {
            ordersContainer.innerHTML = '<h2>You have no orders yet.</h2>';
            return;
        }

        ordersContainer.innerHTML = '';
        orders.forEach(order => {
            const orderCard = document.createElement('div');
            orderCard.className = 'order-card';

            const orderDate = new Date(order.createdAt).toLocaleDateString();
            const statusClass = order.status.toLowerCase();

            const itemsHtml = order.orderItems.map(item => `
                <div class="order-item">
                    <img src="${item.imageUrl}" alt="${item.name}">
                    <div>
                        <p><strong>${item.name}</strong> (Size: ${item.selectedSize})</p>
                        <p>₹${item.price.toFixed(2)}</p>
                    </div>
                </div>
            `).join('');
            
            const cancelButtonHtml = order.status === 'Processing' 
                ? `<button class="cancel-order-btn" data-id="${order._id}">Cancel Order</button>`
                : `<button class="cancel-order-btn" disabled>${order.status}</button>`;

            orderCard.innerHTML = `
                <div class="order-header">
                    <div>
                        <strong>Order Date:</strong> ${orderDate}
                    </div>
                    <div>
                        <strong>Total:</strong> ₹${order.totalPrice.toFixed(2)}
                    </div>
                     <div>
                        <strong>Status:</strong> <span class="order-status ${statusClass}">${order.status}</span>
                    </div>
                </div>
                <div class="order-body">
                    ${itemsHtml}
                </div>
                <div class="order-footer">
                    ${cancelButtonHtml}
                </div>
            `;
            ordersContainer.appendChild(orderCard);
        });
    }
    
    ordersContainer.addEventListener('click', async (e) => {
        if (e.target.classList.contains('cancel-order-btn')) {
            const orderId = e.target.dataset.id;
            const token = localStorage.getItem('authToken');

            if (confirm('Are you sure you want to cancel this order?')) {
                try {
                    const res = await fetch(`http://localhost:5000/api/orders/${orderId}/cancel`, {
                        method: 'PUT',
                        headers: { 'Authorization': `Bearer ${token}` }
                    });

                    if (res.ok) {
                        showToast('Order cancelled successfully.');
                        fetchMyOrders();
                    } else {
                        showToast('Failed to cancel order.');
                    }
                } catch (error) {
                    showToast('Server error. Please try again.');
                }
            }
        }
    });

    await fetchMyOrders();
});