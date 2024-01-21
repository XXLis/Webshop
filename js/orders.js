// Function to fetch orders from the server
async function fetchOrders() {
    try {
        const response = await fetch('http://localhost:3000/api/orders');
        if (!response.ok) {
            throw new Error('Error loading orders');
        }
        const orders = await response.json();
        console.log('Pobrane zamówienia:', orders);
        return orders;
    } catch (error) {
        console.error('Error loading orders:', error);
        return [];
    }
}

//  Function to display orders in the HTML table
async function displayOrders() {
    const orders = await fetchOrders();
    const ordersTable = document.getElementById('ordersTable');
    const tbody = ordersTable.getElementsByTagName('tbody')[0];
    tbody.innerHTML = '';

    if (orders.length === 0) {
        const noOrdersRow = document.createElement('tr');
        noOrdersRow.innerHTML = '<td colspan="4">Geen bestellingen.</td>';
        tbody.appendChild(noOrdersRow);
    } else {
        orders.forEach(order => {
            order.items.forEach(item => {
                let row = tbody.insertRow();
                row.insertCell(0).innerHTML = item.id;
                row.insertCell(1).innerHTML = item.name;
                row.insertCell(2).innerHTML = item.quantity;

                // Calculate the total by multiplying 'price' with 'quantity'
                const totalPrice = item.price * item.quantity;
                row.insertCell(3).innerHTML = totalPrice.toFixed(2); // Display total with 2 decimal places
                console.log('Zamówienie:', item);
            });
        });
    }
}

window.addEventListener('load', () => {
    displayOrders();
});

function goToAdminPage() {
    window.location.href = '../html/admin.html';
}
