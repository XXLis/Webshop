// Function to generate a unique product ID based on the current timestamp
function generateUniqueProductId(products) {
    let maxId = 0;
    products.forEach(product => {
        if (product.id > maxId) {
            maxId = product.id;
        }
    });
    return maxId + 1;
}

// Asynchronously fetch products from the server
async function fetchProducts() {
    try {
        const response = await fetch('http://localhost:3000/api/products');
        if (!response.ok) {
            throw new Error('Error fetching products');
        }
        const products = await response.json();
        console.log('Fetched products:', products);
        return products;
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
        const data = await response.json();
        console.log('Deleted product:', data);
        return data;
    } catch (error) {
        console.error('Error deleting product:', error);
        return null;
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
        const isConfirmed = confirm('Are you sure you want to delete this product?');
        if (isConfirmed) {
            const deleteResult = await deleteProduct(product.id);
            if (deleteResult) {
                row.remove();
            }
        }
    };
    deleteCell.appendChild(deleteButton);
}

// Display all products in the admin panel
async function displayAdminProducts() {
    const products = await fetchProducts();
    const adminProductContainer = document.getElementById('admin-product-container');
    adminProductContainer.innerHTML = ''; // Clear the container

    if (products.length === 0) {
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

// Handle the submission of the product addition form
async function handleProductFormSubmit(e) {
    e.preventDefault();
    const productName = document.getElementById('product-name').value.trim();
    const productDescription = document.getElementById('product-description').value.trim();
    const productPrice = parseFloat(document.getElementById('product-price').value);
    const productImage = document.getElementById('product-image').value.trim();

    if (!productName || Number.isNaN(productPrice) || productPrice <= 0) {
        alert('Please fill out the name and provide a valid price for the product.');
        return;
    }

    const newProduct = {
        name: productName,
        description: productDescription,
        price: productPrice,
        image: productImage,
    };

    try {
        const response = await fetch('http://localhost:3000/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newProduct),
        });
        if (!response.ok) {
            throw new Error('Error adding product');
        }
        await response.json();
        displayAdminProducts(); // Refresh the product list immediately after adding
    } catch (error) {
        console.error('Error adding the product:', error);
        alert('An error occurred while adding the product.');
    } finally {
        e.target.reset(); // Clear the form fields
    }
}


// Add event listeners after the DOM content is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Display products when the page is fully loaded
    displayAdminProducts();

    // Event listener for the product addition form
    const addProductForm = document.getElementById('add-product-form');
    addProductForm.addEventListener('submit', handleProductFormSubmit);

    // Event delegation for dynamic buttons (Orders and Terug)
    document.addEventListener('click', function(event) {
        if (event.target.matches('#go-to-orders')) {
            window.location.href = '/html/orders.html';
        } else if (event.target.matches('#go-to-home')) {
            goToHomePage();
        }
    });
});
