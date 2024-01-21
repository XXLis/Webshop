async function addProduct() {
    const productName = document.getElementById('product-name').value;
    const productDescription = document.getElementById('product-description').value;
    const productPrice = parseFloat(document.getElementById('product-price').value);
    const productImage = document.getElementById('product-image').value;

    if (!productName) {
        alert('Productnaam is verplicht');
        return;
    }

    if (Number.isNaN(productPrice) || productPrice <= 0) {
        alert('Ongeldige prijs. Voer een geldige prijs in.');
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
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newProduct),
        });

        if (!response.ok) {
            throw new Error('Fout bij het toevoegen van het product');
        }

        const updatedProducts = await response.json();
        console.log('Nieuw product toegevoegd:', updatedProducts);
        goToAdminPage();
    } catch (error) {
        console.error('Fout bij het toevoegen van het product:', error);
    }
}

function goToAdminPage() {
    window.location.href = '../html/admin.html';
}
