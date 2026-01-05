const bar = document.getElementById('bar');
const navbar = document.getElementById('navbar');
const closeBtn = document.querySelector('#navbar .close-btn');

if (bar && navbar) {
  bar.onclick = () => {
    navbar.classList.toggle('active');
  };
}

if (closeBtn && navbar) {
  closeBtn.onclick = () => {
    navbar.classList.remove('active');
  };
}








const CART_KEY = 'site_cart_v1';

// Get cart from localStorage
function getCart() {
  const raw = localStorage.getItem(CART_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) || [];
  } catch (e) {
    console.error('Invalid cart data', e);
    return [];
  }
}

// Save cart to localStorage
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
}

// Add or update item in cart
function addToCart(item) {
  const cart = getCart();
  const idx = cart.findIndex(i => i.id === item.id);
  if (idx > -1) {
    cart[idx].qty = (cart[idx].qty || 0) + (item.qty || 1);
  } else {
    cart.push({
      id: item.id,
      title: item.title,
      price: Number(item.price) || 0,
      qty: Number(item.qty) || 1,
      img: item.img || ''
    });
  }
  saveCart(cart);
  showTempMessage('Added to cart');
}

// Remove item from cart (helper - used in cart page)
function removeFromCart(id) {
  let cart = getCart();
  cart = cart.filter(i => i.id !== id);
  saveCart(cart);
  return cart;
}

// Utility: quick temporary message near top (simple)
function showTempMessage(text, timeout = 1400) {
  let el = document.getElementById('siteTempMsg');
  if (!el) {
    el = document.createElement('div');
    el.id = 'siteTempMsg';
    el.style.position = 'fixed';
    el.style.top = '18px';
    el.style.left = '50%';
    el.style.transform = 'translateX(-50%)';
    el.style.background = '#088178';
    el.style.color = '#fff';
    el.style.padding = '8px 14px';
    el.style.borderRadius = '6px';
    el.style.zIndex = 2000;
    el.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    document.body.appendChild(el);
  }
  el.textContent = text;
  el.style.display = 'block';
  setTimeout(() => {
    el.style.display = 'none';
  }, timeout);
}

// Update cart count badge in header / mobile cart links
function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((s, i) => s + (Number(i.qty) || 0), 0);

  // find each cart link (desktop and mobile)
  document.querySelectorAll('a[href="cart.html"]').forEach(a => {
    // ensure position relative so badge can be absolute
    a.style.position = a.style.position || 'relative';
    let badge = a.querySelector('.cart-count');
    if (!badge) {
      badge = document.createElement('span');
      badge.className = 'cart-count';
      badge.style.position = 'absolute';
      badge.style.top = '-6px';
      badge.style.right = '-6px';
      badge.style.background = '#e74c3c';
      badge.style.color = '#fff';
      badge.style.padding = '3px 7px';
      badge.style.fontSize = '12px';
      badge.style.borderRadius = '50%';
      badge.style.fontWeight = '700';
      a.appendChild(badge);
    }
    badge.textContent = count;
    badge.style.display = count > 0 ? 'inline-block' : 'none';
  });
}

// Wire up "add-to-cart" buttons on product lists
function attachAddToCartListeners() {
  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      const id = this.dataset.id || (this.getAttribute('data-id'));
      const title = this.dataset.title || this.getAttribute('data-title') || document.querySelector('.des h5')?.innerText || 'Product';
      const price = parseFloat(this.dataset.price || this.getAttribute('data-price') || '0') || 0;
      const img = this.dataset.img || this.getAttribute('data-img') || '';
      const qty = parseInt(this.dataset.qty || this.getAttribute('data-qty') || '1', 10) || 1;

      if (!id) {
        console.warn('Product missing data-id, cannot add to cart');
        return;
      }

      addToCart({ id, title, price, qty, img });
    });
  });
}

// Single product page: wire Add TO Cart button (id="addToCartBtn")
function attachSingleProductListener() {
  const btn = document.getElementById('addToCartBtn');
  if (!btn) return;

  btn.addEventListener('click', (e) => {
    e.preventDefault();

    // adjust selectors if your markup differs
    const titleEl = document.querySelector('.single-pro-details h4') || document.querySelector('.single-pro-details h2') || null;
    const priceEl = document.querySelector('.single-pro-details h2') || document.querySelector('.single-pro-details h4') || null;
    const qtyEl = document.getElementById('productQty') || document.querySelector('.single-pro-details input[type="number"]');

    const title = titleEl ? titleEl.innerText.trim() : 'Product';
    const priceText = priceEl ? priceEl.innerText.replace('$', '').trim() : '0';
    const price = parseFloat(priceText) || 0;
    const qty = qtyEl ? Math.max(1, parseInt(qtyEl.value || '1', 10)) : 1;
    const img = document.getElementById('mainimg') ? document.getElementById('mainimg').src : '';

    // create an id (if none present, try to generate)
    let id = btn.dataset.id || btn.getAttribute('data-id');
    if (!id) {
      // fallback id from title
      id = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '').slice(0, 30);
    }

    addToCart({ id, title, price, qty, img });
  });
}

// call on page load
document.addEventListener('DOMContentLoaded', () => {
  attachAddToCartListeners();
  attachSingleProductListener();
  updateCartCount();
});