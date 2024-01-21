// Function to display products on the web page.
function displayProducts(products) {
    const productContainer = document.getElementById("product-container");
    productContainer.innerHTML = "";

    products.forEach((product) => {
        // Create and configure the elements for each product
        const productItem = document.createElement("div");
        productItem.classList.add("product-item");

        const productImage = document.createElement("img");
        productImage.src = `../foto/${product.image}`;
        productImage.alt = product.name;

        const productTitle = document.createElement("h3");
        productTitle.textContent = product.name;

        const productDescription = document.createElement("p");
        productDescription.textContent = product.description;

        const productPrice = document.createElement("span");
        productPrice.textContent = `€${product.price.toFixed(2)}`;

        const addToCartButton = document.createElement("button");
        addToCartButton.textContent = "In winkelwagen";
        addToCartButton.addEventListener("click", () => addToCart(product));

        // Append product details to the product item
        productItem.appendChild(productImage);
        productItem.appendChild(productTitle);
        productItem.appendChild(productDescription);
        productItem.appendChild(productPrice);
        productItem.appendChild(addToCartButton);

        // Append the product item to the product container
        productContainer.appendChild(productItem);
    });
}

// Function to add a product to the shopping cart.
function addToCart(product) {
    let cartItems = localStorage.getItem("cartItems");
    cartItems = cartItems ? JSON.parse(cartItems) : [];

    // Check if the product is already in the cart
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

// Function to update the cart item count.
function updateCartItemCount() {
    let cartItems = localStorage.getItem("cartItems");
    cartItems = cartItems ? JSON.parse(cartItems) : [];

    const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const cartItemCount = document.getElementById("cart-item-count");
    cartItemCount.textContent = totalCount.toString();
}

// Function to display cart items on the cart page.
function displayCartItems() {
    let cartItems = localStorage.getItem("cartItems");
    cartItems = cartItems ? JSON.parse(cartItems) : [];
    const cartItemsContainer = document.getElementById("cart-items-container");
    cartItemsContainer.innerHTML = ""; // Clear the container

    cartItems.forEach((cartItem) => {
        // Create a new div element for each cart item
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("cart-item");
        
        cartItemsContainer.appendChild(cartItemElement);
    });
}


// Redirects to the home page.
function goToHomePage() {
    window.location.href = '/html/index.html';
}

// Function to load products when the window is loaded.
window.onload = loadProducts;

// Initializes the cart items display.
displayCartItems();

// Function to fetch products from a JSON file and display them.
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
xhr.open("GET", `../json/products.json?t=${new Date().getTime()}`, true);

// Event listener for DOMContentLoaded to handle login.
document.addEventListener('DOMContentLoaded', function () {
    checkLoginStatus();

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const password = document.getElementById('password').value;
            const correctPassword = '0000';

            if (password === correctPassword) {
                const now = new Date().getTime();
                localStorage.setItem('loggedIn', true);
                localStorage.setItem('loginTime', now);
                window.location.href = '../html/admin.html';
            } else {
                alert('Incorrect password!');
            }
        });
    }
});

// Function to check the login status.
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('loggedIn');
    const loginTime = localStorage.getItem('loginTime');

    if (isLoggedIn) {
        const now = new Date().getTime();
        const timeLimit = 5 * 60 * 1000; // 5 minutes in milliseconds

        if (now - loginTime > timeLimit) {
            localStorage.removeItem('loggedIn');
            localStorage.removeItem('loginTime');
        }
    }
}
