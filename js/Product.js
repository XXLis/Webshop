// Asynchronously adds a new product using the values entered in the form.
// It validates the inputs, creates a product object, and sends it to the server.
async function addProduct() {
    // Retrieve product details from form inputs
    const productName = document.getElementById('product-name').value;
    const productDescription = document.getElementById('product-description').value;
    const productPrice = parseFloat(document.getElementById('product-price').value);
    const productImage = document.getElementById('product-image').value;

    // Validate product name input
    if (!productName) {
        alert('Product name is required');
        return;
    }

    // Validate product price input
    if (Number.isNaN(productPrice) || productPrice <= 0) {
        alert('Invalid price. Please enter a valid price.');
        return;
    }

    // Create new product object
    const newProduct = {
        name: productName,
        description: productDescription,
        price: productPrice,
        image: productImage,
    };

    // Try to send the new product to the backend
    try {
        const response = await fetch('http://localhost:3000/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newProduct),
        });

        // Check if the request was successful
        if (!response.ok) {
            throw new Error('Error adding the product');
        }

        // Log the added product returned from the server
        const addedProduct = await response.json();
        console.log('New product added:', addedProduct);

        // Reload products on the home page
        loadProducts(); // Reload products after successful addition

        // Redirect to the admin page
        goToAdminPage();
    } catch (error) {
        // Log any errors that occur during the fetch operation
        console.error('Error adding the product:', error);
    }
}

// Redirects to the admin page. This function is called after successfully adding a product.
function goToAdminPage() {
    window.location.href = '../html/admin.html';
}

// Function to display products on the web page.
function displayProducts(products) {
    // Your existing code for displaying products...
    // Ensure this code correctly appends product details to the DOM
}

// Function to load products when the window is loaded.
window.onload = loadProducts;

// Function to fetch products from a JSON file and display them.
function loadProducts() {
    // Your existing code for loading products...
    // This function should call `displayProducts`
}

// Additional functions (addToCart, updateCartItemCount, displayCartItems, etc.)
// ...

// Event listener for DOMContentLoaded to handle login.
document.addEventListener('DOMContentLoaded', function () {
    // Your existing code for login handling...
});

// Function to check the login status.
function checkLoginStatus() {
    // Your existing code for checking login status...
}
