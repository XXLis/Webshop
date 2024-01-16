// Function to add a product to the cart
function addToCart(product) {
    let cartItems = localStorage.getItem("cartItems");
    cartItems = cartItems ? JSON.parse(cartItems) : [];

    const existingItem = cartItems.find(item => item.id === product.id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        product.quantity = 1;
        cartItems.push(product);
    }

    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    updateCartItemCount();
}

// Function to update the cart item count
function updateCartItemCount() {
    let cartItems = localStorage.getItem("cartItems");
    cartItems = cartItems ? JSON.parse(cartItems) : [];

    const cartItemCount = document.getElementById("cart-item-count");
    if (cartItemCount) {
        const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        cartItemCount.textContent = totalCount.toString();
    }
}

// Function to display cart items
function displayCartItems() {
    let cartItems = localStorage.getItem("cartItems");
    cartItems = cartItems ? JSON.parse(cartItems) : [];

    const cartItemsContainer = document.getElementById("cart-items-container");
    if (cartItemsContainer) {
        cartItemsContainer.innerHTML = "";

        cartItems.forEach((cartItem, index) => { // Added index for better item management
            const cartItemElement = document.createElement("div");
            cartItemElement.classList.add("cart-item");

            const itemImage = document.createElement("img");
            itemImage.src = `../foto/${cartItem.image}`;

            itemImage.alt = cartItem.name;

            const itemTitle = document.createElement("h4");
            itemTitle.textContent = cartItem.name;

            const itemPrice = document.createElement("span");
            itemPrice.textContent = `€${(cartItem.price * cartItem.quantity).toFixed(2)}`;

            const itemQuantity = document.createElement("span");
            itemQuantity.textContent = `Quantity: ${cartItem.quantity}`;

            const increaseQuantityButton = document.createElement("button");
            increaseQuantityButton.textContent = "+";
            increaseQuantityButton.addEventListener("click", () => {
                cartItem.quantity += 1;
                localStorage.setItem("cartItems", JSON.stringify(cartItems));
                displayCartItems();
                updateCartItemCount();
            });

            const decreaseQuantityButton = document.createElement("button");
            decreaseQuantityButton.textContent = "-";
            decreaseQuantityButton.addEventListener("click", () => {
                if (cartItem.quantity > 1) {
                    cartItem.quantity -= 1;
                    localStorage.setItem("cartItems", JSON.stringify(cartItems));
                    displayCartItems();
                    updateCartItemCount();
                }
            });

            const deleteItemButton = document.createElement("button");
            deleteItemButton.textContent = "Delete";
            deleteItemButton.addEventListener("click", () => {
                cartItems = cartItems.filter(item => item.id !== cartItem.id);
                localStorage.setItem("cartItems", JSON.stringify(cartItems));
                displayCartItems();
                updateCartItemCount();
            });


            cartItemElement.appendChild(itemImage);
            cartItemElement.appendChild(itemTitle);
            cartItemElement.appendChild(itemPrice);
            cartItemElement.appendChild(itemQuantity);
            cartItemElement.appendChild(increaseQuantityButton);
            cartItemElement.appendChild(decreaseQuantityButton);
            cartItemElement.appendChild(deleteItemButton);

            cartItemsContainer.appendChild(cartItemElement);
        });

        updateCartTotal();
    }
}

// Function to update the total price of the cart
function updateCartTotal() {
    let cartItems = localStorage.getItem("cartItems");
    cartItems = cartItems ? JSON.parse(cartItems) : [];

    const totalPriceElement = document.getElementById("total-price");
    if (totalPriceElement) {
        const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        totalPriceElement.textContent = `Total: €${total.toFixed(2)}`;
    }
}

// Function to handle the order placement
function placeOrder() {
    let cartItems = localStorage.getItem("cartItems");
    if (!cartItems) {
        alert("No products in the cart.");
        return;
    }

    fetch('http://localhost:3000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: JSON.parse(cartItems) }), // Updated to properly format the request body
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Problem processing your order');
            }
            return response.json();
        })
        .then(data => {
            console.log('Order placed:', data);
            localStorage.removeItem("cartItems");
            alert("Order placed successfully");
            window.location.href = "index.html";
        })
        .catch(error => {
            console.error('Error:', error);
            alert("There was a problem placing your order.");
        });
}

// Initialize the checkout process
function initializeCheckout() {
    displayOrderSummary();
    displayCartItems();
}

window.onload = initializeCheckout;

// Function to display order summary (to be implemented)
function displayOrderSummary() {
    // Order summary logic here
}

// Event listener for the place order button
const placeOrderButton = document.getElementById("place-order-button");
if (placeOrderButton) {
    placeOrderButton.addEventListener("click", placeOrder);
}

window.onload = initializeCheckout;