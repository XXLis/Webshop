// Asynchronously adds a new product. This function is called when the user submits the product addition form.
async function addProduct(event) {
    event.preventDefault(); // Prevent the form from submitting the default way

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
        const response = await fetch('/api/products', { // Assuming you're hosting the server and client on the same domain
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newProduct),
        });

        // Check if the request was successful
        if (!response.ok) {
            const errorDetails = await response.text(); // Attempt to get the error message from response
            throw new Error(`Error adding the product: ${errorDetails}`);
        }

        // Log the added product and clear the form
        const addedProduct = await response.json();
        console.log('New product added:', addedProduct);

        // Clear the form so the user can add another product
        document.getElementById('product-name').value = '';
        document.getElementById('product-description').value = '';
        document.getElementById('product-price').value = '';
        document.getElementById('product-image').value = '';

        // Redirect to the admin page
        goToAdminPage();
    } catch (error) {
        // Log any errors that occur during the fetch operation
        console.error('Error adding the product:', error);
        alert(error.message); // Show the error message to the user
    }
}

// Redirects to the admin page. This function is typically called after successful actions.
function goToAdminPage() {
    window.location.href = '/html/admin.html'; // Ensure this path is correct
}

// Add event listener to the form submit
const productForm = document.getElementById('product-add-form'); // Make sure this is the correct ID of your form
if (productForm) {
    productForm.addEventListener('submit', addProduct);
}
