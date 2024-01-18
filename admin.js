async function fetchProducts() {
    try {
        const response = await fetch('http://localhost:3000/api/products');
        if (!response.ok) {
            throw new Error('Fout bij het laden van producten');
        }
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        return [];
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


