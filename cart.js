
function addToCart(product) {
    let cartItems = localStorage.getItem("cartItems");
    cartItems = cartItems ? JSON.parse(cartItems) : [];

    const existingItem = cartItems.find((item) => item.id === product.id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        product.quantity = 1;
        cartItems.push(product);
    }

    localStorage.setItem("cartItems", JSON.stringify(cartItems));

    updateCartItemCount();
}

function updateCartItemCount() {
    let cartItems = localStorage.getItem("cartItems");
    cartItems = cartItems ? JSON.parse(cartItems) : [];

    const cartItemCount = document.getElementById("cart-item-count");
    if (cartItemCount) {
        const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        cartItemCount.textContent = totalCount.toString();
    }
}

function displayCartItems() {
    let cartItems = localStorage.getItem("cartItems");
    cartItems = cartItems ? JSON.parse(cartItems) : [];

    const cartItemsContainer = document.getElementById("cart-items-container");

    if (cartItemsContainer) {
        cartItemsContainer.innerHTML = "";

        cartItems.forEach((cartItem) => {
            const cartItemElement = document.createElement("div");
            cartItemElement.classList.add("cart-item");

            const itemImage = document.createElement("img");
            itemImage.src = cartItem.image;
            itemImage.alt = cartItem.name;

            const itemTitle = document.createElement("h4");
            itemTitle.textContent = cartItem.name;

            const itemPrice = document.createElement("span");
            itemPrice.textContent = `€${(cartItem.price * cartItem.quantity).toFixed(2)}`;

            const itemQuantity = document.createElement("span");
            itemQuantity.textContent = `Antal: ${cartItem.quantity}`;

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
            deleteItemButton.textContent = "Verwijderen";
            deleteItemButton.addEventListener("click", () => {
                cartItems = cartItems.filter((item) => item.id !== cartItem.id);
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

function updateCartTotal() {
    let cartItems = localStorage.getItem("cartItems");
    cartItems = cartItems ? JSON.parse(cartItems) : [];

    const totalPriceElement = document.getElementById("total-price");
    if (totalPriceElement) {
        const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        totalPriceElement.textContent = `Total: €${total.toFixed(2)}`;
    }
}

function initializeCheckout() {
    displayOrderSummary();
}

window.onload = initializeCheckout;

function displayOrderSummary() {

}

displayCartItems();


const placeOrderButton = document.getElementById("place-order-button");
if (placeOrderButton) {
    placeOrderButton.addEventListener("click", () => {
        window.location.href = "order-confirmation.html";
    });
}


