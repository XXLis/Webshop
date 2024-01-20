// Displays all products on the product page by creating HTML elements for each product and appending them to the container.
function displayProducts(products) {
    const productContainer = document.getElementById("product-container");
    productContainer.innerHTML = "";

    products.forEach((product) => {
        // Create a div for each product and set its class
        const productItem = document.createElement("div");
        productItem.classList.add("product-item");

        // Create and configure the image for the product
        const productImage = document.createElement("img");
        productImage.src = `../foto/${product.image}`;
        productImage.alt = product.name;

        // Create and set the title for the product
        const productTitle = document.createElement("h3");
        productTitle.textContent = product.name;

        // Create and set the description for the product
        const productDescription = document.createElement("p");
        productDescription.textContent = product.description;

        // Create and set the price for the product
        const productPrice = document.createElement("span");
        productPrice.textContent = `€${product.price.toFixed(2)}`;

        // Create the 'add to cart' button and set its event listener
        const addToCartButton = document.createElement("button");
        addToCartButton.textContent = "In winkelwagen";
        addToCartButton.addEventListener("click", () => addToCart(product));

        // Append all elements to the product item
        productItem.appendChild(productImage);
        productItem.appendChild(productTitle);
        productItem.appendChild(productDescription);
        productItem.appendChild(productPrice);
        productItem.appendChild(addToCartButton);

        // Append the product item to the product container
        productContainer.appendChild(productItem);
    });
}

// Adds a product to the shopping cart in local storage or updates its quantity if it's already there.
function addToCart(product) {
    let cartItems = localStorage.getItem("cartItems");
    cartItems = cartItems ? JSON.parse(cartItems) : [];

    // Find the product in the cart by its ID
    const existingItem = cartItems.find((item) => item.id === product.id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        product.quantity = 1;
        cartItems.push(product);
    }

    // Update the cart items in local storage
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    updateCartItemCount();
}

// Updates the cart item count display by calculating the total quantity of all items.
function updateCartItemCount() {
    let cartItems = localStorage.getItem("cartItems");
    cartItems = cartItems ? JSON.parse(cartItems) : [];

    // Calculate the total count of items in the cart
    const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    // Display the total count on the cart item count element
    const cartItemCount = document.getElementById("cart-item-count");
    cartItemCount.textContent = totalCount.toString();
}

// Displays cart items in the cart page by creating HTML elements for each cart item and appending them to the container.
function displayCartItems() {
    let cartItems = localStorage.getItem("cartItems");
    cartItems = cartItems ? JSON.parse(cartItems) : [];
    const cartItemsContainer = document.getElementById("cart-items-container");
    cartItemsContainer.innerHTML = ""; // Clear the cart items container

    cartItems.forEach((cartItem) => {
        // Similar process to displayProducts, but for cart items
        // ...
        // Append the cart item to the cart items container
        cartItemsContainer.appendChild(cartItemElement);
    });
}

// Redirects to the home page when called. Typically used after successful actions or to redirect from admin page.
function goToHomePage() {
    window.location.href = '/html/index.html';
}

// Loads products from the server and displays them on the product page.
window.onload = loadProducts;

// Initializes the cart items display. This function is called when the window loads.
displayCartItems();

// Fetches products from the server using XMLHttpRequest and displays them by calling displayProducts.
function loadProducts() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "../json/products.json", true);
    xhr.onload = function () {
        if (xhr.status === 200) {
            const products = JSON.parse(xhr.responseText);
            displayProducts(products);
            updateCartItemCount();
        }
    };
    xhr.send();
}

// Checks the login status and sets event listeners for login form submission. Redirects to admin page if login is successful.
document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();
    // ...
});

// Checks if the user is logged in and redirects to login page if the session has expired.
function checkLoginStatus() {
    // ...
}
