// Function to fetch orders from the server asynchronously
async function fetchOrders() {
    try {
        // Fetching data from the API endpoint
        const response = await fetch('http://localhost:3000/api/orders');
        // Check if the response is OK, otherwise throw an error
        if (!response.ok) {
            throw new Error('Error loading orders');
        }
        // Parsing the JSON response into a JavaScript object
        const orders = await response.json();
        console.log('Fetched orders:', orders);
        return orders;
    } catch (error) {
        // Log the error if fetching or parsing fails
        console.error('Error loading orders:', error);
        return [];
    }
}

// Function to display orders in the HTML table
async function displayOrders() {
    // Fetching orders from the server
    const orders = await fetchOrders();
    // Getting the table element from the DOM
    const ordersTable = document.getElementById('ordersTable');
    // Getting the tbody element of the table
    const tbody = ordersTable.getElementsByTagName('tbody')[0];
    // Clearing the tbody content
    tbody.innerHTML = '';

    // Check if there are no orders and display a message if so
    if (orders.length === 0) {
        const noOrdersRow = document.createElement('tr');
        noOrdersRow.innerHTML = '<td colspan="4">No orders.</td>';
        tbody.appendChild(noOrdersRow);
    } else {
        // Iterate over each order
        orders.forEach(order => {
            // Check if order.items is an array and iterate over it
            if (Array.isArray(order.items)) {
                order.items.forEach(item => {
                    // Creating a new row for each item
                    let row = tbody.insertRow();
                    // Inserting cells and filling them with item data
                    row.insertCell(0).innerHTML = item.id;
                    row.insertCell(1).innerHTML = item.name;
                    row.insertCell(2).innerHTML = item.quantity;

                    // Calculate the total by multiplying 'price' with 'quantity'
                    const totalPrice = item.price * item.quantity;
                    // Display total with 2 decimal places
                    row.insertCell(3).innerHTML = totalPrice.toFixed(2);
                    console.log('Order item:', item);
                });
            } else {
                console.log('Order without items:', order);
            }
        });
    }
}

// Event listener for the window load event
window.addEventListener('load', () => {
    // Call displayOrders when the window is fully loaded
    displayOrders();
});

// Function to navigate to the admin page
function goToAdminPage() {
    window.location.href = '../html/admin.html';
}
