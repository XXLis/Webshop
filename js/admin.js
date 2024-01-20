// Function to generate a unique product ID based on existing products
function generateUniqueProductId(products) {
    if (!products.length) return 1;
    return Math.max(...products.map(p => p.id)) + 1;
}

// Asynchronously fetch products from the server or local file
async function fetchProducts() {
    try {
        const response = await fetch('http://localhost:3000/api/products');
        if (!response.ok) {
            throw new Error('Server responded with an error!');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}

// Asynchronously delete a product by its ID
async function deleteProduct(productId) {
    try {
        const response = await fetch(`http://localhost:3000/api/products/${productId}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Error deleting product');
        }
        console.log('Product deleted');
        return await response.json();
    } catch (error) {
        console.error('Error deleting product:', error);
    }
}

// Create the header row of a table
function createTableHeader() {
    const headers = ['ID', 'Name', 'Price', 'Image URL', 'Actions'];
    const headerRow = document.createElement('tr');
    headers.forEach(headerText => {
        const headerCell = document.createElement('th');
        headerCell.textContent = headerText;
        headerRow.appendChild(headerCell);
    });
    return headerRow;
}

// Create a row in the product table for each product
function createProductRow(product) {
    const tbody = document.getElementById('admin-product-container');
    const row = tbody.insertRow();
    row.insertCell().textContent = product.id;
    row.insertCell().textContent = product.name;
    row.insertCell().textContent = `€${product.price.toFixed(2)}`;
    row.insertCell().textContent = product.image;

    const deleteCell = row.insertCell();
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.onclick = async () => {
        if (confirm('Are you sure you want to delete this product?')) {
            await deleteProduct(product.id);
            row.remove();
        }
    };
    deleteCell.appendChild(deleteButton);
}

// Display all products in the admin panel
async function displayAdminProducts() {
    const products = await fetchProducts();
    const adminProductContainer = document.getElementById('admin-product-container');
    adminProductContainer.innerHTML = ''; // Clear the container

    adminProductContainer.appendChild(createTableHeader());
    products.forEach(product => createProductRow(product));
}

// Function to handle the form submission for adding a product
async function handleAddProduct(event) {
    event.preventDefault();

    const productName = document.getElementById('product-name').value;
    const productDescription = document.getElementById('product-description').value;
    const productPrice = parseFloat(document.getElementById('product-price').value);
    const productImage = document.getElementById('product-image').value;

    // Validate form inputs
    if (!productName || Number.isNaN(productPrice) || productPrice <= 0) {
        alert('Please fill out the name and provide a valid price for the product.');
        return;
    }

    const products = await fetchProducts(); // Fetch existing products to generate a new ID
    const newProduct = {
        id: generateUniqueProductId(products),
        name: productName,
        description: productDescription,
        price: productPrice,
        image: productImage,
    };

    try {
        // Add the product
        const response = await fetch('http://localhost:3000/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newProduct),
        });
        if (!response.ok) {
            throw new Error('Server responded with an error!');
        }
        await response.json();
        displayAdminProducts(); // Refresh the product list
    } catch (error) {
        console.error('Error adding the product:', error);
        alert('An error occurred while adding the product.');
    } finally {
        event.target.reset(); // Clear the form fields
    }
}

// Add event listeners after the DOM content is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Display products when the page is fully loaded
    displayAdminProducts();

    // Event listener for the product addition form
    const addProductForm = document.getElementById('add-product-form');
    addProductForm.addEventListener('submit', handleAddProduct);

    // Event listeners for buttons
    document.getElementById('go-to-orders').addEventListener('click', () => {
        window.location.href = '/html/orders.html'; // Update to the correct path
    });

    document.getElementById('go-to-home').addEventListener('click', goToHomePage);
});
