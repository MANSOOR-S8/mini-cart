// --- Global Data and Utility Functions ---

// Example Product Array as provided in the task
const products = [
  {
    id: 1,
    name: "Nike",
    price: 500,
    text: "Description will be here, If we provide any description about product",
    image: "Assets/1.jpg",
  },
  {
    id: 2,
    name: "Nike",
    price: 750,
    text: "Description will be here, If we provide any description about product",
    image: "Assets/2.jpg",
  },
  {
    id: 3,
    name: "Nike",
    price: 300,
    text: "Description will be here, If we provide any description about product",
    image: "Assets/3.jpg",
  },
  {
    id: 4,
    name: "Nike",
    price: 900,
    text: "Description will be here, If we provide any description about product",
    image: "Assets/3.jpg",
  },
];

/**
 * Retrieves the cart data from localStorage.
 * If no data exists, returns an empty array.
 * @returns {Array<Object>} The cart array.
 */
function getCart() {
  const cart = localStorage.getItem("cart");
  return cart ? JSON.parse(cart) : [];
}

/**
 * Saves the cart data to localStorage.
 * @param {Array<Object>} cart The cart array to save.
 */
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// --- Page 1: Product Listing Page (`index.html`) Logic ---

/**
 * Renders the product cards on the page.
 */
function renderProductCards() {
  const container = document.getElementById("product-list-container");
  if (!container) return; // Exit if not on the product page

  // Loop through the products array to create a card for each
  products.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
            <img class="product-image" src="${product.image}" alt="${product.name}">
            <h2 class="product-name">${product.name}</h2>
            <p class="description">${product.text}</p>
            <div class="price">
            <p class="product-price">$${product.price}</p>
            <button class="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
            </div>
        `;
    container.appendChild(card);
  });

  // Add event listeners to all "Add to Cart" buttons
  document.querySelectorAll(".add-to-cart-btn").forEach((button) => {
    button.addEventListener("click", (event) => {
      const productId = parseInt(event.target.dataset.id);
      const productToAdd = products.find((p) => p.id === productId);
      addToCart(productToAdd);
    });
  });
}

/**
 * Adds a product to the cart.
 * If the product is already in the cart, increments its quantity.
 * Updates localStorage and the cart count display.
 * @param {Object} product The product object to add.
 */
function addToCart(product) {
  const cart = getCart();
  const existingProduct = cart.find((item) => item.id === product.id);

  if (existingProduct) {
    existingProduct.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart(cart);
  updateCartCount();
}

/**
 * Updates the cart count displayed in the header.
 */
function updateCartCount() {
  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartCountElement = document.getElementById("cart-count");
  if (cartCountElement) {
    cartCountElement.textContent = totalItems;
  }
}

// --- Page 2: Cart Details Page (`cart.html`) Logic ---

/**
 * Renders the cart items and summary on the cart page.
 */
function renderCart() {
  const cart = getCart();
  const itemsContainer = document.getElementById("cart-items-container");
  const summaryContainer = document.getElementById("cart-summary");
  const emptyMessage = document.getElementById("empty-cart-message");

  if (!itemsContainer || !summaryContainer) return; // Exit if not on the cart page

  if (cart.length === 0) {
    // Show empty message and hide cart contents
    itemsContainer.style.display = "none";
    summaryContainer.style.display = "none";
    emptyMessage.style.display = "block";
    return;
  }

  // Hide empty message and show cart contents
  itemsContainer.style.display = "block";
  summaryContainer.style.display = "block";
  emptyMessage.style.display = "none";

  // Clear previous items before re-rendering
  itemsContainer.innerHTML = "";

  let totalQuantity = 0;
  let totalPrice = 0;

  // Loop through the cart to create a list item for each product
  cart.forEach((item) => {
    const itemElement = document.createElement("div");
    itemElement.className = "cart-item";
    itemElement.innerHTML = `
            <div class="item-details">
                <span class="item-name">${item.name}</span>
                <span class="item-price">$${item.price}</span>
            </div>
            <div class="item-quantity-controls">
                <button class="quantity-btn decrease-btn" data-id="${item.id}">-</button>
                <span class="quantity-display">${item.quantity}</span>
                <button class="quantity-btn increase-btn" data-id="${item.id}">+</button>
            </div>
        `;
    itemsContainer.appendChild(itemElement);

    totalQuantity += item.quantity;
    totalPrice += item.quantity * item.price;
  });

  // Add event listeners for quantity buttons
  document.querySelectorAll(".increase-btn").forEach((button) => {
    button.addEventListener("click", (event) => {
      const productId = parseInt(event.target.dataset.id);
      updateQuantity(productId, 1);
    });
  });

  document.querySelectorAll(".decrease-btn").forEach((button) => {
    button.addEventListener("click", (event) => {
      const productId = parseInt(event.target.dataset.id);
      updateQuantity(productId, -1);
    });
  });

  // Render the cart summary totals
  summaryContainer.innerHTML = `
        <h2>Cart Summary</h2>
        <div class="summary-row">
            <span>Total Items:</span>
            <span>${totalQuantity}</span>
        </div>
        <div class="summary-row total">
            <span>Total Price:</span>
            <span>$${totalPrice}</span>
        </div>
    `;
}

/**
 * Updates the quantity of a product in the cart.
 * Removes the product if quantity becomes zero.
 * @param {number} productId The ID of the product to update.
 * @param {number} change The quantity change (+1 or -1).
 */
function updateQuantity(productId, change) {
  let cart = getCart();
  const itemIndex = cart.findIndex((item) => item.id === productId);

  if (itemIndex > -1) {
    cart[itemIndex].quantity += change;

    // Remove item if quantity drops to 0 or less
    if (cart[itemIndex].quantity <= 0) {
      cart.splice(itemIndex, 1);
    }

    saveCart(cart);
    renderCart(); // Re-render the cart to show changes
  }
}

// --- Main Execution Logic ---

// Run the appropriate functions based on the current page
window.onload = () => {
  // Check if the current page is index.html
  if (
    window.location.pathname.endsWith("index.html") ||
    window.location.pathname === "/"
  ) {
    updateCartCount();
    renderProductCards();
  }

  // Check if the current page is cart.html
  if (window.location.pathname.endsWith("cart.html")) {
    renderCart();
  }
};
