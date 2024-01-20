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
        return await response.json();
    } catch (error) {
        console.error('Error deleting product:', error);
        return [];
    }
}

// Create the header row of a table
function createTableHeader(headers) {
    const headerRow = document.createElement('tr');
    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
    });
    return headerRow;
}

// Redirect to the home page
function goToHomePage() {
    window.location.href = '../html/index.html';
}

// Create a row in the product table for each product
function createProductRow(product) {
    const row = document.createElement('tr');
    row.insertCell().textContent = product.id;
    row.insertCell().textContent = product.name;
    row.insertCell().textContent = product.price ? `€${product.price.toFixed(2)}` : 'Price unknown';
    row.insertCell().textContent = product.image;

    const actionsCell = row.insertCell();
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => handleRemoveProduct(product.id));
    actionsCell.appendChild(deleteButton);

    return row;
}

// Display all products in the admin panel
async function displayAdminProducts() {
    const adminProductContainer = document.getElementById('admin-product-container');
    adminProductContainer.innerHTML = '';

    const products = await fetchProducts();
    if (!products || products.length === 0) {
        const noProductsMessage = document.createElement('p');
        noProductsMessage.textContent = 'No products available.';
        adminProductContainer.appendChild(noProductsMessage);
        return;
    }

    const table = document.createElement('table');
    table.classList.add('admin-product-table');
    const headers = ['ID', 'Name', 'Price', 'Image URL', 'Actions'];
    table.appendChild(createTableHeader(headers));

    products.forEach(product => {
        table.appendChild(createProductRow(product));
    });

    adminProductContainer.appendChild(table);
}

// Handle the removal of a product and refresh the list
async function handleRemoveProduct(productId) {
    const result = await deleteProduct(productId);
    if (result) {
        console.log('Product deleted:', productId);
        displayAdminProducts();
    }
}

// Event listener for page load to display products
window.onload = displayAdminProducts;

// Using event delegation for dynamically added content
document.addEventListener('click', function(event) {
    if (event.target.matches('#go-to-orders')) {
        window.location.href = '/html/orders.html';
    } else if (event.target.matches('#go-to-home')) {
        goToHomePage();
    }
});

// Handle the submission of the product addition form
document.addEventListener('DOMContentLoaded', () => {
    const addProductForm = document.getElementById('add-product-form');
    addProductForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const productName = document.getElementById('product-name').value;
        const productDescription = document.getElementById('product-description').value;
        const productPrice = parseFloat(document.getElementById('product-price').value);
        const productImage = document.getElementById('product-image').value;

        if (!productName) {
            alert('Product name is required');
            return;
        }

        if (Number.isNaN(productPrice) || productPrice <= 0) {
            alert('Invalid price. Please enter a valid price.');
            return;
        }

        const newProduct = {
            name: productName,
            description: productDescription,
            price: productPrice,
            image: productImage,
        };

        try {
            const addedProduct = await addProduct(newProduct);
            if (addedProduct) {
                alert('Product added successfully');
                setTimeout(() => {
                    displayAdminProducts();
                }, 0);
            }
        } catch (error) {
            console.error('Error adding the product:', error);
            alert('An error occurred while adding the product.');
        } finally {
            addProductForm.reset();
        }
    });

    async function addProduct(productData) {
        try {
            const response = await fetch('http://localhost:3000/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productData),
            });
            if (!response.ok) {
                throw new Error('Error adding product');
            }
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error; // Rethrow the error to be caught in the calling function
        }
    }
});
