async function addProduct() {
  const productName = document.getElementById('product-name').value;
  const productDescription = document.getElementById('product-description').value;
  const productPrice = parseFloat(document.getElementById('product-price').value);
  const productImage = document.getElementById('product-image').value;

  if (!productName || isNaN(productPrice)) {
    alert('Ongeldige gegevens. Probeer het opnieuw.');
    return;
  }

  const products = await fetchProducts();
  const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;

  const newProduct = {
    id: newId,
    name: productName,
    description: productDescription,
    price: productPrice,
    image: productImage,
  };

  fetch('http://localhost:3000/api/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newProduct),
  })
    .then(response => response.json())
    .then(updatedProducts => {
      console.log('Nieuw product toegevoegd:', updatedProducts);
      loadAdminProducts();
      goToAdminPage();
    })
    .catch(error => console.error('Fout bij het toevoegen van het product:', error));
}

function goToAdminPage() {
  window.location.href = 'admin.html';
}
