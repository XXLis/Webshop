
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

function createTableHeader(headers) {
    const headerRow = document.createElement('tr');
    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
    });
    return headerRow;
}

function goToHomePage() {
    window.location.href = '../html/index.html';
}

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

async function handleRemoveProduct(productId) {
    const result = await deleteProduct(productId);
    if (result) {
        console.log('Product deleted:', productId);
        displayAdminProducts();
    }
}

window.onload = displayAdminProducts;
document.addEventListener('DOMContentLoaded', () => {
    const addProductForm = document.getElementById('add-product-form');
    addProductForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevents the default form behavior (page reload)

        // Get data from the form
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

        // Generate a new unique product ID
        const newProduct = {
            id: generateUniqueProductId(),
            name: productName,
            description: productDescription,
            price: productPrice,
            image: productImage,
        };

        try {
            // Call the function to add the product
            await addProduct(newProduct);
            alert('Product added successfully');
        } catch (error) {
            console.error('Error adding the product:', error);
            alert('An error occurred while adding the product.');
        }
    });

    // Function to add a product
    async function addProduct(productData) {
        try {
            const products = await fetchProducts();
            let maxId = 0;
            // Find the maximum existing ID
            products.forEach(product => {
                if (product.id > maxId) {
                    maxId = product.id;
                }
            });
            // Increment the maximum ID to get the next available ID
            const nextId = maxId + 1;
            productData.id = nextId;
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
            return null;
        }
    }
    // Function to generate a unique product ID (customize as needed)
    function generateUniqueProductId() {
        return Date.now();
    }
});
document.addEventListener('DOMContentLoaded', () => {
    const addProductForm = document.getElementById('add-product-form');

    // "Orders"
    const goToOrdersButton = document.getElementById('go-to-orders');
    goToOrdersButton.addEventListener('click', () => {
        window.location.href = '/html/orders.html';
    });
    // "Terug naar hoofdpagina"
    const goToHomePageButton = document.getElementById('go-to-home');
    goToHomePageButton.addEventListener('click', () => {
        window.location.href = '/html/index.html';
    });
});

