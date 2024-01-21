
function displayProducts(products) {
  const productContainer = document.getElementById("product-container");

  productContainer.innerHTML = "";

  products.forEach((product) => {
    const productItem = document.createElement("div");
    productItem.classList.add("product-item");

    const productImage = document.createElement("img");
    productImage.src = product.image;
    productImage.alt = product.name;

    const productTitle = document.createElement("h3");
    productTitle.textContent = product.name;

    const productDescription = document.createElement("p");
    productDescription.textContent = product.description;

    const productPrice = document.createElement("span");
    productPrice.textContent = `€${product.price.toFixed(2)}`;

    const addToCartButton = document.createElement("button");
    addToCartButton.textContent = "In winkelwagen";
    addToCartButton.addEventListener("click", () => addToCart(product));

    productItem.appendChild(productImage);
    productItem.appendChild(productTitle);
    productItem.appendChild(productDescription);
    productItem.appendChild(productPrice);
    productItem.appendChild(addToCartButton);

    productContainer.appendChild(productItem);
  });
}

function addToCart(product) {
  let cartItems = localStorage.getItem("cartItems");
  cartItems = cartItems ? JSON.parse(cartItems) : [];

  const existingItem = cartItems.find((item) => item.id === product.id);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    product.quantity = 1;
    cartItems.push(product);
  }

  localStorage.setItem("cartItems", JSON.stringify(cartItems));

  updateCartItemCount();
}

function updateCartItemCount() {
  let cartItems = localStorage.getItem("cartItems");
  cartItems = cartItems ? JSON.parse(cartItems) : [];

  const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const cartItemCount = document.getElementById("cart-item-count");
  cartItemCount.textContent = totalCount.toString();
}

function displayCartItems() {
  let cartItems = localStorage.getItem("cartItems");
  cartItems = cartItems ? JSON.parse(cartItems) : [];

  const cartItemsContainer = document.getElementById("cart-items-container");

  cartItemsContainer.innerHTML = "";

  cartItems.forEach((cartItem) => {
    const cartItemElement = document.createElement("div");
    cartItemElement.classList.add("cart-item");

    const itemImage = document.createElement("img");
    itemImage.src = cartItem.image;
    itemImage.alt = cartItem.name;

    const itemTitle = document.createElement("h4");
    itemTitle.textContent = cartItem.name;

    const itemPrice = document.createElement("span");
    itemPrice.textContent = `€${(cartItem.price * cartItem.quantity).toFixed(2)}`;

    const itemQuantity = document.createElement("span");
    itemQuantity.textContent = `Antal: ${cartItem.quantity}`;

    const increaseQuantityButton = document.createElement("button");
    increaseQuantityButton.textContent = "+";
    increaseQuantityButton.addEventListener("click", () => {
      cartItem.quantity += 1;
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      displayCartItems();
      updateCartItemCount();
    });

    const decreaseQuantityButton = document.createElement("button");
    decreaseQuantityButton.textContent = "-";
    decreaseQuantityButton.addEventListener("click", () => {
      if (cartItem.quantity > 1) {
        cartItem.quantity -= 1;
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
        displayCartItems();
        updateCartItemCount();
      }
    });

    const deleteItemButton = document.createElement("button");
    deleteItemButton.textContent = "Verwijderen";
    deleteItemButton.addEventListener("click", () => {
      cartItems = cartItems.filter((item) => item.id !== cartItem.id);
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      displayCartItems();
      updateCartItemCount();
    });

    cartItemElement.appendChild(itemImage);
    cartItemElement.appendChild(itemTitle);
    cartItemElement.appendChild(itemPrice);
    cartItemElement.appendChild(itemQuantity);
    cartItemElement.appendChild(increaseQuantityButton);
    cartItemElement.appendChild(decreaseQuantityButton);
    cartItemElement.appendChild(deleteItemButton);

    cartItemsContainer.appendChild(cartItemElement);
  });
}

function goToHomePage() {
  window.location.href = "index.html";
}

window.onload = loadProducts;

displayCartItems();

function loadProducts() {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "products.json", true);
  xhr.onload = function () {
    if (xhr.status === 200) {
      const products = JSON.parse(xhr.responseText);

      displayProducts(products);
      updateCartItemCount();
    }
  };
  xhr.send();
}

function redirectToAdmin() {
  window.location.href = 'admin.html';
}

