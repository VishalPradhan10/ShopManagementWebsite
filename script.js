console.log('Script Loaded — VishalMart');

const products = [
  { id: 1, name: 'Wireless Headphones', price: 1299, image: 'https://images.unsplash.com/photo-1585386959984-a415522e3de8?auto=format&fit=crop&w=800&q=60' },
  { id: 2, name: 'Laptop', price: 55000, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=60' },
  { id: 3, name: 'Running Shoes', price: 1500, image: 'https://images.unsplash.com/photo-1528701800489-4762c4b30a40?auto=format&fit=crop&w=800&q=60' },
  { id: 4, name: 'Smartphone', price: 14999, image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=60' },
  { id: 5, name: 'Wireless Mouse', price: 699, image: 'https://images.unsplash.com/photo-1587825140708-86d7f0b6c9f5?auto=format&fit=crop&w=800&q=60' },
  { id: 6, name: 'Gaming Keyboard', price: 2499, image: 'https://images.unsplash.com/photo-1593642634315-48f5414c3ad9?auto=format&fit=crop&w=800&q=60' },
  { id: 7, name: 'Smartwatch', price: 4999, image: 'https://images.unsplash.com/photo-1519744792095-2f2205e87b6f?auto=format&fit=crop&w=800&q=60' },
  { id: 8, name: 'Bluetooth Speaker', price: 1999, image: 'https://images.unsplash.com/photo-1585386959984-a415522e3de8?auto=format&fit=crop&w=800&q=60' },
  { id: 9, name: 'Tablet', price: 25000, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=60' },
  { id: 10, name: 'Fitness Tracker', price: 2999, image: 'https://images.unsplash.com/photo-1600180758895-4a9cdd1b3d92?auto=format&fit=crop&w=800&q=60' },
];

function getCart() {
   return JSON.parse(localStorage.getItem('vm_cart') || '[]');
  }
function saveCart(cart) { 
  localStorage.setItem('vm_cart', JSON.stringify(cart)); updateCartCount();
}
function updateCartCount(){ const el = document.querySelector('#cart-count'); 
  if(el) el.textContent = getCart().length; 
}

const productListEl = document.getElementById('product-list');
if (productListEl) {
  const priceFilter = document.getElementById('price-filter');
  const priceValue = document.getElementById('price-value');
  const searchInput = document.getElementById('search-input');
  function displayProduct(productsToShow) {
    productListEl.innerHTML = '';
    productsToShow.forEach(p => {
      const productCard = document.createElement('div');
      productCard.className = 'product';
      productCard.innerHTML = `
        <img src="${p.image}" alt="${p.name}" class="product-img">
        <h3>${p.name}</h3>
        <p class="small">Price: ₹${p.price.toLocaleString()}</p>
        <button data-id="${p.id}" class="add-to-cart">Add to Cart</button>
      `;
      productListEl.appendChild(productCard);
    });

    document.querySelectorAll('.add-to-cart').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.getAttribute('data-id'));
        const prod = products.find(x => x.id === id);
        const cart = getCart();
        const existing = cart.find(i => i.id === id);
        if (existing) existing.qty += 1;
         else cart.push({
          id: prod.id, name: prod.name, price: prod.price, qty: 1 
        });
        saveCart(cart);
        alert(prod.name + ' added to cart');
      });
    });
  }

  displayProduct(products);
  priceValue.textContent = priceFilter.value;

  priceFilter.addEventListener('input', () => {
    const maxPrice = parseInt(priceFilter.value, 10);
    priceValue.textContent = maxPrice;
    const filtered = products.filter(p => p.price <= maxPrice);
    const q = searchInput.value.trim().toLowerCase();
    displayProduct(filtered.filter(p => p.name.toLowerCase().includes(q)));
  });

  searchInput.addEventListener('input', () => {
    const q = searchInput.value.trim().toLowerCase();
    const maxPrice = parseInt(priceFilter.value, 10);
    const filtered = products.filter(p => p.price <= maxPrice && p.name.toLowerCase().includes(q));
    displayProduct(filtered);
  });
}

const cartItemsEl = document.getElementById('cart-items');
if (cartItemsEl) {
  function renderCart() {
    const cart = getCart();
    cartItemsEl.innerHTML = '';
    let total = 0;
    if (cart.length === 0) {
      cartItemsEl.innerHTML = '<li>Your cart is empty.</li>';
    } else {
      cart.forEach(item => {
        total += item.price * item.qty;
        const li = document.createElement('li');
        li.innerHTML = `
          <span>${item.name} — ₹${item.price.toLocaleString()} x ${item.qty}</span>
          <span>
            <button class="qty-decrease" data-id="${item.id}">-</button>
            <button class="qty-increase" data-id="${item.id}">+</button>
            <button class="remove-item" data-id="${item.id}">Remove</button>
          </span>
        `;
        cartItemsEl.appendChild(li);
      });
    }
    const totalEl = document.getElementById('cart-total');
    if (totalEl) totalEl.textContent = total.toLocaleString();

    document.querySelectorAll('.qty-increase').forEach(b => b.addEventListener('click', () => {
      const id = parseInt(b.dataset.id,10);
      const cart = getCart();
      const item = cart.find(i=>i.id===id); 
      if(item){ item.qty++; saveCart(cart); 
      renderCart(); }
    }));
    document.querySelectorAll('.qty-decrease').forEach(b => b.addEventListener('click', () => {
      const id = parseInt(b.dataset.id,10);
      const cart = getCart();
      const item = cart.find(i=>i.id===id); 
      if(item){ item.qty = Math.max(1, item.qty-1);
      saveCart(cart); renderCart(); }
    }));
    document.querySelectorAll('.remove-item').forEach(b => b.addEventListener('click', () => {
      const id = parseInt(b.dataset.id,10);
      let cart = getCart(); 
      cart = cart.filter(i=>i.id!==id); 
      saveCart(cart); renderCart();
    }));
  }

  renderCart();

  const checkoutBtn = document.getElementById('checkout-btn');
  if (checkoutBtn) checkoutBtn.addEventListener('click', () => {
    const cart = getCart();
    if (cart.length === 0) return alert('Cart is empty');
    if (confirm('Proceed with payment (simulation)?')) {
      localStorage.removeItem('vm_cart');
      updateCartCount();
      alert('Payment successful (demo). Thank you!');
      renderCart();
    }
  });
}

updateCartCount();        