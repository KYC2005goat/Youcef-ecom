// Load cart data on checkout page
document.addEventListener('DOMContentLoaded', function () {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const orderSummary = document.getElementById('order-summary');
    const orderTotal = document.getElementById('order-total');
    let total = 0;

    if (!orderSummary || !orderTotal) {
        console.error('Order summary or total element not found in the DOM.');
        return;
    }

    orderSummary.innerHTML = ''; // Clear previous content
    cart.forEach(item => {
        const orderItem = document.createElement('div');
        orderItem.innerHTML = `
            <span>${item.name} x ${item.quantity}</span>
            <span>$${(item.price * item.quantity).toFixed(2)}</span>
        `;
        orderSummary.appendChild(orderItem);
        total += item.price * item.quantity;
    });

    orderTotal.textContent = total.toFixed(2);

    // Handle form submission
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const address = document.getElementById('address').value;

            const orderId = generateOrderId();
            const orderDate = new Date().toLocaleString();
            
            const orderDetails = {
                orderId,
                orderDate,
                customer: { name, email, phone, address },
                items: cart,
                total: total.toFixed(2)
            };

            // Send order details via EmailJS
            sendOrderEmail(orderDetails);
        });
    } else {
        console.error('Checkout form not found in the DOM.');
    }
});

// Generate a random order ID
function generateOrderId() {
    return 'ORD' + Math.floor(Math.random() * 1000000);
}


// Send order email using EmailJS
function sendOrderEmail(orderDetails) {
    // Format the items into an HTML table
    const itemsTable = `
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
            <thead>
                <tr style="background-color: #f2f2f2;">
                    <th style="padding: 8px; border: 1px solid #ddd;">Item Name</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Quantity</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Price</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Total</th>
                </tr>
            </thead>
            <tbody>
                ${orderDetails.items.map(item => `
                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;">${item.name}</td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${item.quantity}</td>
                        <td style="padding: 8px; border: 1px solid #ddd;">$${item.price}</td>
                        <td style="padding: 8px; border: 1px solid #ddd;">$${item.quantity*item.price}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    const emailParams = {
        from_name: orderDetails.customer.name,
        orderId: orderDetails.orderId,
        orderDate: orderDetails.orderDate,
        name: orderDetails.customer.name,
        email: orderDetails.customer.email,
        phone: orderDetails.customer.phone,
        address: orderDetails.customer.address,
        itemsTable: itemsTable, // Pass the formatted table
        total: orderDetails.total
    };

    console.log("Email Params:", emailParams); // Debugging

    emailjs.send('service_a8cnirg', 'template_zxuo9wd', emailParams)
        .then(() => {
            alert('Order placed successfully!');
            localStorage.removeItem('cart');
            window.location.href = 'index.html';
        }, (error) => {
            alert('Failed to place order. Please try again.');
            console.error('EmailJS Error:', error);
        });
}