const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');
const year = document.getElementById('year');

if (year) {
  year.textContent = new Date().getFullYear();
}

if (menuToggle && nav) {
  const closeMenu = () => {
    nav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation');
  };

  menuToggle.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!expanded));
    menuToggle.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
    nav.classList.toggle('open', !expanded);
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenu();
    }
  });
}

const productGrid = document.querySelector('.product-grid');
const cartItems = document.querySelector('.cart-items');
const cartTotal = document.getElementById('cart-total');
const demoMessage = document.querySelector('.demo-message');
const cart = new Map();

const formatPrice = (amount) => amount.toLocaleString('en-US');

const renderCart = () => {
  if (!cartItems || !cartTotal) return;

  cartItems.replaceChildren();
  let total = 0;

  if (cart.size === 0) {
    const emptyMessage = document.createElement('li');
    emptyMessage.className = 'empty-cart';
    emptyMessage.textContent = 'Add an item to start a sample bill.';
    cartItems.append(emptyMessage);
  }

  cart.forEach((item, name) => {
    const lineTotal = item.price * item.quantity;
    total += lineTotal;

    const row = document.createElement('li');
    row.className = 'cart-row';
    row.innerHTML = `
      <div class="cart-row-main">
        <b></b>
        <div class="quantity-control">
          <button type="button" data-action="decrease" data-name="" aria-label="Remove one"></button>
          <span></span>
          <button type="button" data-action="increase" data-name="" aria-label="Add one"></button>
        </div>
      </div>
      <strong class="cart-line-price"></strong>
    `;

    const [decrease, increase] = row.querySelectorAll('.quantity-control button');
    row.querySelector('.cart-row-main > b').textContent = name;
    decrease.dataset.name = name;
    decrease.textContent = '−';
    decrease.setAttribute('aria-label', `Remove one ${name}`);
    increase.dataset.name = name;
    increase.textContent = '+';
    increase.setAttribute('aria-label', `Add one ${name}`);
    row.querySelector('.quantity-control span').textContent = String(item.quantity);
    row.querySelector('.cart-line-price').textContent = `Rs ${formatPrice(lineTotal)}`;
    cartItems.append(row);
  });

  cartTotal.textContent = formatPrice(total);
};

if (productGrid) {
  productGrid.addEventListener('click', (event) => {
    const tile = event.target.closest('.product-tile');
    if (!tile) return;

    const { product, price } = tile.dataset;
    if (!product || !price) return;

    const item = cart.get(product);
    cart.set(product, {
      price: Number(price),
      quantity: item ? item.quantity + 1 : 1,
    });

    if (demoMessage) demoMessage.textContent = `${product} added to your sample bill.`;
    renderCart();
  });
}

if (cartItems) {
  cartItems.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-action]');
    if (!button) return;

    const item = cart.get(button.dataset.name);
    if (!item) return;

    if (button.dataset.action === 'increase') {
      cart.set(button.dataset.name, { ...item, quantity: item.quantity + 1 });
    } else if (item.quantity > 1) {
      cart.set(button.dataset.name, { ...item, quantity: item.quantity - 1 });
    } else {
      cart.delete(button.dataset.name);
    }
    renderCart();
  });
}

document.querySelectorAll('.filter-button').forEach((button) => {
  button.addEventListener('click', () => {
    const { filter } = button.dataset;
    document.querySelectorAll('.filter-button').forEach((filterButton) => {
      const active = filterButton === button;
      filterButton.classList.toggle('active', active);
      filterButton.setAttribute('aria-pressed', String(active));
    });

    document.querySelectorAll('.product-tile').forEach((tile) => {
      tile.hidden = filter !== 'all' && tile.dataset.category !== filter;
    });
  });
});

document.querySelector('.clear-cart')?.addEventListener('click', () => {
  cart.clear();
  if (demoMessage) demoMessage.textContent = 'Sample bill cleared. No payment is taken in this preview.';
  renderCart();
});

document.querySelector('.charge-button')?.addEventListener('click', () => {
  if (cart.size === 0) {
    if (demoMessage) demoMessage.textContent = 'Add an item before completing a sample sale.';
    return;
  }

  cart.clear();
  if (demoMessage) demoMessage.textContent = 'Sample sale complete. No payment was taken.';
  renderCart();
});

const demoForm = document.getElementById('demo-form');
if (demoForm) {
  demoForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!demoForm.reportValidity()) return;

    const formData = new FormData(demoForm);
    const name = formData.get('name');
    const phone = formData.get('phone');
    const businessType = formData.get('businessType');
    const needs = formData.get('needs') || 'Not specified';
    const message = [
      'Hello Technaxa, I would like to discuss software for my business.',
      '',
      `Name: ${name}`,
      `Phone / WhatsApp: ${phone}`,
      `Business type: ${businessType}`,
      `What I need help with: ${needs}`,
    ].join('\n');

    const whatsappUrl = `https://wa.me/923219806556?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  });
}

renderCart();
