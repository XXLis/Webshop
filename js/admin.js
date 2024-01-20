// Function to generate a unique product ID based on existing products
function generateUniqueProductId(products) {
    if (!products.length) return 1;
    return Math.max(...products.map(p => p.id)) + 1;
}

// Asynchronously fetch products from the server
async function fetchProducts() {
    try {
        const response = await fetch('http://localhost:3000/api/products');
        if (!response.ok) {
            throw new Error('Server responded with an error!');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching products:', error);
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
        return await response.json();
    } catch (error) {
        console.error('Error deleting product:', error);
    }
}

// Create the header row of a table
function createTableHeader(headers) {
    const headerRow = document.createElement('tr');
    headers.forEach(headerText => {
        const headerCell = document.createElement('th');
        headerCell.textContent = headerText;
        headerRow.appendChild(headerCell);
    });
    return headerRow;
}

// Redirect to the home page
function goToHomePage() {
    window.location.href = '../html/index.html';
}

// Create a row in the product table for each product
function createProductRow(product, tbody) {
    const row = tbody.insertRow();
    row.insertCell().textContent = product.id;
    row.insertCell().textContent = product.name;
    row.insertCell().textContent = product.price ? `€${product.price.toFixed(2)}` : 'Price unknown';
    row.insertCell().textContent = product.image;

    const deleteCell = row.insertCell();
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'delete-btn';
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
    adminProductContainer.innerHTML = '';

    if (!products || products.length === 0) {
        adminProductContainer.textContent = 'No products available.';
        return;
    }

    const table = document.createElement('table');
    table.className = 'admin-product-table';
    const tbody = table.createTBody();
    const tableHeaders = ['ID', 'Name', 'Price', 'Image URL', 'Actions'];

    table.appendChild(createTableHeader(tableHeaders));
    products.forEach(product => createProductRow(product, tbody));
    adminProductContainer.appendChild(table);
}

// Function to handle the form submission for adding a product
async function handleAddProduct(event) {
    event.preventDefault();

    const productName = event.target.elements['product-name'].value;
    const productPrice = parseFloat(event.target.elements['product-price'].value);
    const productImage = event.target.elements['product-image'].value;

    // Validate form inputs
    if (!productName || Number.isNaN(productPrice) || productPrice <= 0) {
        alert('Please fill out the name and provide a valid price for the product.');
        return;
    }

    // Prepare new product data
    const products = await fetchProducts(); // Fetch existing products to generate a new ID
    const newProduct = {
        id: generateUniqueProductId(products),
        name: productName,
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
        // Clear the form fields
        event.target.reset();
    }
}

// Function to initialize the admin page
function initializeAdminPage() {
    displayAdminProducts();

    // Event listener for adding a product
    const addProductForm = document.getElementById('add-product-form');
    addProductForm.addEventListener('submit', handleAddProduct);
}

// Event listener for DOMContentLoaded to initialize the admin page
document.addEventListener('DOMContentLoaded', initializeAdminPage);
