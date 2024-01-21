// Asynchronously adds a new product. This function is called when the user submits the product addition form.
async function addProduct() {
    // Retrieve product details from the form fields
    const productName = document.getElementById('product-name').value;
    const productDescription = document.getElementById('product-description').value;
    const productPrice = parseFloat(document.getElementById('product-price').value);
    const productImage = document.getElementById('product-image').value;

    // Validate the product name
    if (!productName) {
        alert('Product name is required');
        return;
    }

    // Validate the product price
    if (Number.isNaN(productPrice) || productPrice <= 0) {
        alert('Invalid price. Please enter a valid price.');
        return;
    }

    // Create a new product object
    const newProduct = {
        name: productName,
        description: productDescription,
        price: productPrice,
        image: productImage,
    };

    // Try to send the new product to the server
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

        // Log the added product and redirect to the admin page
        const updatedProducts = await response.json();
        console.log('New product added:', updatedProducts);
        goToAdminPage();
    } catch (error) {
        // Log any errors that occur during the fetch operation
        console.error('Error adding the product:', error);
    }
}

// Redirects to the admin page. This function is typically called after successful actions.
function goToAdminPage() {
    window.location.href = '../html/admin.html';
}
