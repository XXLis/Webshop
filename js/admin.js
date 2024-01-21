async function fetchProducts() {
    try {
        const response = await fetch('http://localhost:3000/api/products');
        if (!response.ok) {
            throw new Error('Fout bij het laden van producten');
        }
        const products = await response.json();
        console.log('Opgehaalde producten:', products);
        return products;
    } catch (error) {
        console.error('Error bij het ophalen van producten:', error);
        return [];
    }
}

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
            throw new Error('Fout bij het toevoegen van product');
        }

        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

async function deleteProduct(productId) {
    try {
        const response = await fetch(`http://localhost:3000/api/products/${productId}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Fout bij het verwijderen van product');
        }
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
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
    window.location.href = 'index.html';
}


function createProductRow(product, onDelete) {
    const row = document.createElement('tr');

    row.insertCell().textContent = product.id;
    row.insertCell().textContent = product.name;
    row.insertCell().textContent = `€${product.price.toFixed(2)}`;
    row.insertCell().textContent = product.image;

    const actionsCell = row.insertCell();

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Verwijderen';
    deleteButton.addEventListener('click', () => handleRemoveProduct(product.id));
    actionsCell.appendChild(deleteButton);

    return row;
}

async function displayAdminProducts() {
    const adminProductContainer = document.getElementById('admin-product-container');
    adminProductContainer.innerHTML = '';

    const products = await fetchProducts();
    if (!products) return;

    const table = document.createElement('table');
    table.classList.add('admin-product-table');

    const headers = ['ID', 'Naam', 'Prijs', 'Afbeelding URL', 'Acties'];
    table.appendChild(createTableHeader(headers));

    products.forEach(product => {
        table.appendChild(createProductRow(product, handleRemoveProduct));
    });

    adminProductContainer.appendChild(table);
}

async function handleRemoveProduct(productId) {
    const result = await deleteProduct(productId);
    if (result) {
        console.log('Product verwijderd:', productId);
        displayAdminProducts();
    }
}

window.onload = displayAdminProducts;

// Functie om orders op te halen van de server
async function fetchOrders() {
    try {
        const response = await fetch('http://localhost:3000/api/orders');
        if (!response.ok) {
            throw new Error('Fout bij het ophalen van orders');
        }
        const orders = await response.json();
        console.log('Opgehaalde orders:', orders);
        return orders;
    } catch (error) {
        console.error('Error bij het ophalen van orders:', error);
        return [];
    }
}

// Functie om producten weer te geven in de HTML-tabel
async function displayProducts() {
    const products = await fetchProducts();
    const adminProductContainer = document.getElementById('admin-product-container');
    adminProductContainer.innerHTML = '';

    products.forEach(product => {
        const row = adminProductContainer.insertRow();
        row.insertCell(0).textContent = product.id;
        row.insertCell(1).textContent = product.name;
        row.insertCell(2).textContent = `€${product.price.toFixed(2)}`;
        row.insertCell(3).textContent = product.image;
        const actionsCell = row.insertCell();
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Verwijderen';
        deleteButton.addEventListener('click', () => handleRemoveProduct(product.id));
        actionsCell.appendChild(deleteButton);
    });
}

// Functie om orders weer te geven in de HTML-tabel
async function displayOrders() {
    const orders = await fetchOrders();
    const ordersTable = document.getElementById('ordersTable');
    const tbody = ordersTable.getElementsByTagName('tbody')[0];

    tbody.innerHTML = '';

    orders.forEach(order => {
        let row = tbody.insertRow();
        row.insertCell(0).innerHTML = order.id;
        row.insertCell(1).innerHTML = order.product;
        row.insertCell(2).innerHTML = order.quantity;
        row.insertCell(3).innerHTML = order.total;
    });
}

// Voeg eventlisteners toe om producten en orders weer te geven bij het laden van de pagina
window.addEventListener('load', () => {
    displayProducts();
    displayOrders();
});

// Functie om de knop "Orders" toe te voegen
function addOrdersButton() {
    const adminHeader = document.querySelector('header');

    const ordersButton = document.createElement('button');
    ordersButton.textContent = 'Orders';
    ordersButton.addEventListener('click', () => {
        window.location.href = 'orders.html';
    });

    // Voeg de knop toe aan de header
    adminHeader.appendChild(ordersButton);
}

addOrdersButton();
