document.addEventListener('DOMContentLoaded', () => {
    const cartItemsList = document.getElementById('cart-items-list');
    const emptyCartState = document.getElementById('empty-cart-state');
    const cartGridContainer = document.getElementById('cart-grid-container');
    const summarySubtotal = document.getElementById('summary-subtotal');
    const summaryTotal = document.getElementById('summary-total');
    
    const checkoutForm = document.getElementById('checkout-form');
    const placeOrderBtn = document.getElementById('place-order-btn');
    const clearCartBtn = document.getElementById('clear-cart-btn');

    // Phone Number to send WhatsApp message to
    const WHATSAPP_NUMBER = '917798510600';

    // Retrieve cart from localStorage
    function getCart() {
        return JSON.parse(localStorage.getItem('achal_cart')) || [];
    }

    // Save cart to localStorage
    function saveCart(cart) {
        localStorage.setItem('achal_cart', JSON.stringify(cart));
        // Update header count as well
        updateHeaderCartCount();
    }

    // Render cart items
    function renderCart() {
        const cart = getCart();
        
        if (cart.length === 0) {
            cartGridContainer.style.display = 'none';
            emptyCartState.style.display = 'block';
            return;
        }

        cartGridContainer.style.display = 'grid';
        emptyCartState.style.display = 'none';
        cartItemsList.innerHTML = '';

        let subtotal = 0;
        let hasCustomPricing = false;

        cart.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item-card';

            const priceNum = parseFloat(item.price);
            let priceDisplay = `₹${priceNum.toLocaleString('en-IN')}`;
            let itemTotalDisplay = `₹${(priceNum * item.quantity).toLocaleString('en-IN')}`;
            
            if (priceNum === 0) {
                priceDisplay = 'Custom Price (Enquire)';
                itemTotalDisplay = 'Price on Request';
                hasCustomPricing = true;
            } else {
                subtotal += priceNum * item.quantity;
            }

            itemElement.innerHTML = `
                <div class="cart-item-img">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-header">
                        <h4>${item.name}</h4>
                        <button class="btn-remove-item" data-index="${index}"><i class="far fa-trash-alt"></i></button>
                    </div>
                    <p class="cart-item-size"><i class="fas fa-up-down-left-right"></i> Size: ${item.size}</p>
                    <div class="cart-item-price-quantity">
                        <span class="unit-price">${priceDisplay}</span>
                        <div class="quantity-controller">
                            <button class="qty-btn btn-minus" data-index="${index}"><i class="fas fa-minus"></i></button>
                            <span class="qty-num">${item.quantity}</span>
                            <button class="qty-btn btn-plus" data-index="${index}"><i class="fas fa-plus"></i></button>
                        </div>
                        <span class="item-total-price">${itemTotalDisplay}</span>
                    </div>
                </div>
            `;
            cartItemsList.appendChild(itemElement);
        });

        // Update totals
        summarySubtotal.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
        if (hasCustomPricing) {
            summaryTotal.textContent = `₹${subtotal.toLocaleString('en-IN')} + Custom Items`;
        } else {
            summaryTotal.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
        }

        // Add event listeners for item quantity adjustment
        document.querySelectorAll('.btn-plus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(btn.getAttribute('data-index'));
                adjustQuantity(idx, 1);
            });
        });

        document.querySelectorAll('.btn-minus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(btn.getAttribute('data-index'));
                adjustQuantity(idx, -1);
            });
        });

        document.querySelectorAll('.btn-remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(btn.getAttribute('data-index'));
                removeItem(idx);
            });
        });
    }

    // Adjust item quantity
    function adjustQuantity(index, amount) {
        const cart = getCart();
        cart[index].quantity += amount;
        
        // Remove item if quantity falls to 0 or less
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }
        
        saveCart(cart);
        renderCart();
    }

    // Remove single item
    function removeItem(index) {
        const cart = getCart();
        cart.splice(index, 1);
        saveCart(cart);
        renderCart();
    }

    // Clear cart entirely
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', () => {
            if (confirm("Are you sure you want to clear your shopping cart?")) {
                saveCart([]);
                renderCart();
            }
        });
    }

    // Checkout / Place Order via WhatsApp
    if (placeOrderBtn) {
        placeOrderBtn.addEventListener('click', (e) => {
            e.preventDefault();

            // Validate delivery info fields
            const custName = document.getElementById('cust-name').value.trim();
            const custAddress = document.getElementById('cust-address').value.trim();
            const custNotes = document.getElementById('cust-notes').value.trim();

            if (!custName || !custAddress) {
                alert("Please fill out all required fields (*): Name and Delivery Address.");
                
                // Highlight invalid fields
                if (!custName) document.getElementById('cust-name').focus();
                else if (!custAddress) document.getElementById('cust-address').focus();
                return;
            }

            const cart = getCart();
            if (cart.length === 0) {
                alert("Your cart is empty!");
                return;
            }

            // Build the WhatsApp Order Message
            let message = `Hi Achal Artworks! I would like to place an order:\n\n`;
            message += `*Customer Details:*\n`;
            message += `- *Name:* ${custName}\n`;
            message += `- *Delivery Address:* ${custAddress}\n`;
            if (custNotes) {
                message += `- *Special Instructions:* ${custNotes}\n`;
            }
            message += `\n*Order Summary:*\n`;

            let grandTotal = 0;
            let containsCustom = false;

            cart.forEach((item, index) => {
                const priceNum = parseFloat(item.price);
                if (priceNum === 0) {
                    message += `${index + 1}. *${item.name}* (Qty: ${item.quantity}) - Size: ${item.size} - [Price on Request]\n`;
                    containsCustom = true;
                } else {
                    const itemTotal = priceNum * item.quantity;
                    grandTotal += itemTotal;
                    message += `${index + 1}. *${item.name}* (Qty: ${item.quantity}) - Size: ${item.size} - ₹${itemTotal.toLocaleString('en-IN')}\n`;
                }
            });

            message += `\n*Estimated Subtotal:* ₹${grandTotal.toLocaleString('en-IN')}\n`;
            if (containsCustom) {
                message += `*Note:* Order contains items with custom pricing. Please verify details.\n`;
            }
            message += `*Shipping:* Calculated based on delivery location.\n\n`;
            message += `Please confirm availability and share payment details. Thank you!`;

            // Encode message for URL query
            const encodedMsg = encodeURIComponent(message);
            const whatsappUrl = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodedMsg}`;

            // Clear the cart in localStorage after order placement
            saveCart([]);
            
            // Redirect to WhatsApp
            window.open(whatsappUrl, '_blank');

            // Redirect this page back to order success / homepage
            alert("Redirecting to WhatsApp to send your order. Your cart has been cleared!");
            window.location.href = "index.html";
        });
    }

    // Initial page render
    renderCart();
});
