const products = [
  { id: 1, name: 'Órbita Cobalto', audience: 'Niños', style: 'Running', color: 'Blanco / Cobalto', price: 429, oldPrice: 529, image: 'assets/zapatillas neon.png', badge: '-19%', description: 'Tenis ligero con amortiguación suave y malla respirable para acompañar tus recorridos diarios.' },
  { id: 2, name: 'Pulso Negro', audience: 'Hombre', style: 'Running', color: 'Negro / Crema', price: 389, oldPrice: 469, image: 'assets/tenis-negro.png', badge: '-17%', description: 'Silueta robusta con suela de gran tracción y soporte estable para moverte con seguridad.' },
  { id: 3, name: 'Arena Club', audience: 'Mujer', style: 'Casual', color: 'Arena / Goma', price: 349, oldPrice: null, image: 'assets/botin-cafe.png', badge: 'Nuevo', description: 'Perfil casual, tonos neutros y plantilla acolchada para combinar comodidad y estilo todos los días.' },
  { id: 4, name: 'Vector Azul', audience: 'Hombre', style: 'Urbano', color: 'Blanco / Azul', price: 419, oldPrice: null, image: 'assets/tenis-cobalto.png', badge: 'Nuevo', description: 'Una propuesta urbana limpia con detalles azules y una suela flexible pensada para la ciudad.' },
  { id: 5, name: 'Noche Uno', audience: 'Niños', style: 'Urbano', color: 'Negro / Marfil', price: 359, oldPrice: 449, image: 'assets/zapatillas princesa.png', badge: '-20%', description: 'Volumen contemporáneo y contraste sutil para llevar desde la mañana hasta la noche.' },
  { id: 6, name: 'Duna 02', audience: 'Hombre', style: 'Casual', color: 'Beige / Goma', price: 329, oldPrice: null, image: 'assets/tenis-arena.png', badge: 'Esencial', description: 'Tenis versátil con acabado suave, suela de goma y una estética minimalista fácil de combinar.' },
  { id: 7, name: 'Cima Pro', audience: 'Mujer', style: 'Running', color: 'Blanco / Cobalto', price: 459, oldPrice: 549, image: 'assets/botas cafe.png', badge: '-16%', description: 'Respuesta ágil, ajuste cómodo y una base estable para entrenamientos y días de mucho movimiento.' },
  { id: 8, name: 'Distrito', audience: 'Mujer', style: 'Urbano', color: 'Negro / Crema', price: 379, oldPrice: null, image: 'assets/tenis beige.png', badge: 'Nuevo', description: 'Diseño urbano de líneas marcadas con comodidad interior para recorrer la ciudad sin pausa.' },
  { id: 9, name: 'Lino Natural', audience: 'Niños', style: 'Casual', color: 'Arena / Miel', price: 319, oldPrice: 379, image: 'assets/zapatillas drew.png', badge: '-16%', description: 'Texturas naturales y tonos cálidos en una silueta relajada para tus planes de fin de semana.' }
];

const state = {
  category: 'Todos',
  style: 'Todos',
  search: '',
  sort: 'featured',
  favorites: new Set(JSON.parse(localStorage.getItem('tenis-favoritos') || '[]')),
  cart: JSON.parse(localStorage.getItem('tenis-carrito') || '[]'),
  selectedProduct: null,
  selectedSize: null
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const money = (value) => 'Bs ' + value.toLocaleString('es-BO');

function saveState() {
  localStorage.setItem('tenis-favoritos', JSON.stringify([...state.favorites]));
  localStorage.setItem('tenis-carrito', JSON.stringify(state.cart));
}

function getVisibleProducts() {
  let result = products.filter((product) => {
    const categoryMatch = state.category === 'Todos' || state.category === 'Ofertas' && product.oldPrice || product.audience === state.category;
    const styleMatch = state.style === 'Todos' || product.style === state.style;
    const text = (product.name + ' ' + product.style + ' ' + product.color).toLowerCase();
    return categoryMatch && styleMatch && text.includes(state.search.toLowerCase());
  });
  if (state.sort === 'low') result.sort((a, b) => a.price - b.price);
  if (state.sort === 'high') result.sort((a, b) => b.price - a.price);
  return result;
}

function productCard(product) {
  const favorite = state.favorites.has(product.id);
  return '<article class="product-card">' +
    '<div class="product-media" data-detail="' + product.id + '" tabindex="0" role="button" aria-label="Ver detalles de ' + product.name + '">' +
      '<img src="' + product.image + '" alt="' + product.name + '" loading="lazy">' +
      '<span class="badge">' + product.badge + '</span>' +
      '<button class="favorite-btn ' + (favorite ? 'active' : '') + '" data-favorite="' + product.id + '" aria-label="' + (favorite ? 'Quitar de favoritos' : 'Agregar a favoritos') + '">' + (favorite ? '♥' : '♡') + '</button>' +
      '<button class="quick-view" data-detail="' + product.id + '">Ver detalles</button>' +
    '</div>' +
    '<div class="product-info">' +
      '<span class="product-category">' + product.audience + ' · ' + product.style + '</span>' +
      '<h3>' + product.name + '</h3>' +
      '<div class="product-price">' + (product.oldPrice ? '<span class="old-price">' + money(product.oldPrice) + '</span>' : '') + money(product.price) + '</div>' +
      '<span class="product-color">' + product.color + '</span>' +
    '</div>' +
  '</article>';
}

function renderProducts() {
  const visible = getVisibleProducts();
  $('#productGrid').innerHTML = visible.map(productCard).join('');
  $('#resultsText').textContent = visible.length + (visible.length === 1 ? ' modelo disponible' : ' modelos disponibles');
  $('#emptyState').classList.toggle('hidden', visible.length > 0);
}

function toggleFavorite(id) {
  if (state.favorites.has(id)) {
    state.favorites.delete(id);
    showToast('Producto eliminado de favoritos');
  } else {
    state.favorites.add(id);
    showToast('Producto guardado en favoritos');
  }
  saveState();
  renderProducts();
  renderFavorites();
  updateCounters();
  if (state.selectedProduct && state.selectedProduct.id === id) updateModalFavorite();
}

function openProduct(id) {
  state.selectedProduct = products.find((product) => product.id === id);
  state.selectedSize = null;
  const product = state.selectedProduct;
  $('#modalImage').src = product.image;
  $('#modalImage').alt = product.name;
  $('#modalTitle').textContent = product.name;
  $('#modalOldPrice').textContent = product.oldPrice ? money(product.oldPrice) : '';
  $('#modalPrice').textContent = money(product.price);
  $('#modalDiscount').textContent = product.oldPrice ? product.badge : '';
  $('#modalDiscount').classList.toggle('hidden', !product.oldPrice);
  $('#modalDescription').textContent = product.description;
  $('#modalColor').textContent = product.color;
  $('#sizeOptions').innerHTML = [35, 36, 37, 38, 39, 40, 41, 42].map((size) => '<button class="size-button" data-size="' + size + '" type="button">' + size + '</button>').join('');
  $('#sizeError').classList.add('hidden');
  updateModalFavorite();
  openLayer($('#productModal'));
}

function updateModalFavorite() {
  const active = state.selectedProduct && state.favorites.has(state.selectedProduct.id);
  $('#modalFavorite').classList.toggle('active', active);
  $('#modalFavorite').textContent = active ? '♥' : '♡';
}

function addToCart(product, size) {
  const existing = state.cart.find((item) => item.id === product.id && item.size === size);
  if (existing) existing.qty += 1;
  else state.cart.push({ id: product.id, size: size, qty: 1 });
  saveState();
  updateCounters();
  renderCart();
  showToast(product.name + ' fue agregado al carrito');
}

function renderCart() {
  if (!state.cart.length) {
    $('#cartItems').innerHTML = '<div class="drawer-empty"><span>🛒</span><h3>Tu carrito está vacío</h3><p>Encuentra el par perfecto en nuestro catálogo.</p></div>';
    $('#cartTotal').textContent = money(0);
    $('#checkoutButton').disabled = true;
    return;
  }
  $('#checkoutButton').disabled = false;
  $('#cartItems').innerHTML = state.cart.map((item, index) => {
    const product = products.find((entry) => entry.id === item.id);
    return '<article class="drawer-item">' +
      '<img src="' + product.image + '" alt="' + product.name + '">' +
      '<div class="drawer-item-info"><strong>' + product.name + '</strong><small>Talla ' + item.size + ' · ' + money(product.price) + '</small>' +
      '<div class="qty"><button data-qty="' + index + '" data-change="-1" aria-label="Reducir cantidad">−</button><span>' + item.qty + '</span><button data-qty="' + index + '" data-change="1" aria-label="Aumentar cantidad">+</button></div></div>' +
      '<button class="remove-btn" data-remove="' + index + '" aria-label="Eliminar producto">×</button></article>';
  }).join('');
  const total = state.cart.reduce((sum, item) => sum + products.find((product) => product.id === item.id).price * item.qty, 0);
  $('#cartTotal').textContent = money(total);
}

function renderFavorites() {
  const favorites = products.filter((product) => state.favorites.has(product.id));
  if (!favorites.length) {
    $('#favoritesItems').innerHTML = '<div class="drawer-empty"><span>♡</span><h3>Aún no tienes favoritos</h3><p>Guarda los modelos que más te gusten.</p></div>';
    return;
  }
  $('#favoritesItems').innerHTML = favorites.map((product) =>
    '<article class="drawer-item"><img src="' + product.image + '" alt="' + product.name + '"><div class="drawer-item-info"><strong>' + product.name + '</strong><small>' + product.color + ' · ' + money(product.price) + '</small><button class="text-button" data-detail="' + product.id + '">Ver detalles</button></div><button class="remove-btn" data-favorite="' + product.id + '" aria-label="Quitar de favoritos">×</button></article>'
  ).join('');
}

function updateCounters() {
  $('#favoritesCount').textContent = state.favorites.size;
  $('#cartCount').textContent = state.cart.reduce((sum, item) => sum + item.qty, 0);
}

function openLayer(element) {
  closeAll(false);
  $('#overlay').classList.remove('hidden');
  element.classList.remove('hidden');
  if (element.classList.contains('drawer')) {
    element.classList.add('open');
    element.setAttribute('aria-hidden', 'false');
  }
  document.body.classList.add('locked');
}

function closeAll(hideOverlay = true) {
  $('#productModal').classList.add('hidden');
  $$('.drawer').forEach((drawer) => {
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
  });
  if (hideOverlay) {
    $('#overlay').classList.add('hidden');
    document.body.classList.remove('locked');
  }
}

let toastTimer;
function showToast(message) {
  const toast = $('#toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
}

document.addEventListener('click', (event) => {
  const favorite = event.target.closest('[data-favorite]');
  const detail = event.target.closest('[data-detail]');
  if (favorite) {
    event.stopPropagation();
    toggleFavorite(Number(favorite.dataset.favorite));
  } else if (detail) {
    openProduct(Number(detail.dataset.detail));
  }
  const size = event.target.closest('[data-size]');
  if (size) {
    state.selectedSize = Number(size.dataset.size);
    $$('.size-button').forEach((button) => button.classList.toggle('active', button === size));
    $('#sizeError').classList.add('hidden');
  }
  const qty = event.target.closest('[data-qty]');
  if (qty) {
    const item = state.cart[Number(qty.dataset.qty)];
    item.qty += Number(qty.dataset.change);
    if (item.qty <= 0) state.cart.splice(Number(qty.dataset.qty), 1);
    saveState(); renderCart(); updateCounters();
  }
  const remove = event.target.closest('[data-remove]');
  if (remove) {
    state.cart.splice(Number(remove.dataset.remove), 1);
    saveState(); renderCart(); updateCounters();
  }
  if (event.target.closest('[data-close]')) closeAll();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeAll();
  const detail = event.target.closest('[data-detail]');
  if (detail && (event.key === 'Enter' || event.key === ' ')) {
    event.preventDefault();
    openProduct(Number(detail.dataset.detail));
  }
});

$$('.nav-link').forEach((button) => button.addEventListener('click', () => {
  state.category = button.dataset.category;
  $$('.nav-link').forEach((item) => item.classList.toggle('active', item === button));
  $('#mainNav').classList.remove('open');
  $('#menuButton').setAttribute('aria-expanded', 'false');
  renderProducts();
  $('#catalogo').scrollIntoView({ behavior: 'smooth' });
}));

$$('.chip').forEach((button) => button.addEventListener('click', () => {
  state.style = button.dataset.filter;
  $$('.chip').forEach((item) => item.classList.toggle('active', item === button));
  renderProducts();
}));

$('#searchInput').addEventListener('input', (event) => { state.search = event.target.value; renderProducts(); });
$('#sortSelect').addEventListener('change', (event) => { state.sort = event.target.value; renderProducts(); });
$('#searchToggle').addEventListener('click', () => { $('#catalogo').scrollIntoView({ behavior: 'smooth' }); setTimeout(() => $('#searchInput').focus(), 450); });
$('#menuButton').addEventListener('click', () => { const open = $('#mainNav').classList.toggle('open'); $('#menuButton').setAttribute('aria-expanded', String(open)); });
$('#overlay').addEventListener('click', () => closeAll());
$('#cartButton').addEventListener('click', () => { renderCart(); openLayer($('#cartDrawer')); });
$('#favoritesButton').addEventListener('click', () => { renderFavorites(); openLayer($('#favoritesDrawer')); });
$('#modalFavorite').addEventListener('click', () => toggleFavorite(state.selectedProduct.id));
$('#modalAdd').addEventListener('click', () => {
  if (!state.selectedSize) { $('#sizeError').classList.remove('hidden'); return; }
  addToCart(state.selectedProduct, state.selectedSize);
  closeAll();
});
$('#clearFilters').addEventListener('click', () => {
  state.category = 'Todos'; state.style = 'Todos'; state.search = '';
  $('#searchInput').value = '';
  $$('.nav-link').forEach((button) => button.classList.toggle('active', button.dataset.category === 'Todos'));
  $$('.chip').forEach((button) => button.classList.toggle('active', button.dataset.filter === 'Todos'));
  renderProducts();
});
$('#checkoutButton').addEventListener('click', () => showToast('Demostración: conecta una pasarela de pago para completar la compra.'));

function registerCatalogTools() {
  const context = document.modelContext;
  if (!context || !context.registerTool) return;
  const register = (tool) => {
    try { Promise.resolve(context.registerTool(tool)).catch(() => {}); } catch (_) {}
  };
  register({
    name: 'buscar_catalogo',
    title: 'Buscar en el catálogo',
    description: 'Busca tenis disponibles por nombre, estilo, público o color sin modificar el carrito.',
    inputSchema: {
      type: 'object',
      properties: { consulta: { type: 'string', description: 'Texto que se desea buscar.' } },
      required: ['consulta'],
      additionalProperties: false
    },
    annotations: { readOnlyHint: true, untrustedContentHint: false },
    execute(input) {
      if (!input || typeof input.consulta !== 'string') throw new Error('La consulta debe ser texto.');
      const query = input.consulta.trim().toLowerCase();
      return products.filter((product) => (product.name + ' ' + product.style + ' ' + product.audience + ' ' + product.color).toLowerCase().includes(query))
        .map((product) => ({ id: product.id, nombre: product.name, precio: product.price, estilo: product.style, color: product.color }));
    }
  });
  register({
    name: 'guardar_favorito',
    title: 'Guardar favorito',
    description: 'Agrega un producto del catálogo a la lista visible de favoritos.',
    inputSchema: {
      type: 'object',
      properties: { producto_id: { type: 'integer', minimum: 1 } },
      required: ['producto_id'],
      additionalProperties: false
    },
    annotations: { readOnlyHint: false, untrustedContentHint: false },
    execute(input) {
      const product = products.find((item) => item.id === input.producto_id);
      if (!product) throw new Error('Producto no encontrado.');
      if (!state.favorites.has(product.id)) toggleFavorite(product.id);
      return { guardado: true, producto_id: product.id, nombre: product.name };
    }
  });
  register({
    name: 'agregar_al_carrito',
    title: 'Agregar al carrito',
    description: 'Agrega un producto y una talla válidos al carrito visible de la tienda.',
    inputSchema: {
      type: 'object',
      properties: {
        producto_id: { type: 'integer', minimum: 1 },
        talla: { type: 'integer', minimum: 35, maximum: 42 }
      },
      required: ['producto_id', 'talla'],
      additionalProperties: false
    },
    annotations: { readOnlyHint: false, untrustedContentHint: false },
    execute(input) {
      const product = products.find((item) => item.id === input.producto_id);
      if (!product) throw new Error('Producto no encontrado.');
      if (!Number.isInteger(input.talla) || input.talla < 35 || input.talla > 42) throw new Error('La talla debe estar entre 35 y 42.');
      addToCart(product, input.talla);
      return { agregado: true, producto_id: product.id, nombre: product.name, talla: input.talla };
    }
  });
}

renderProducts();
renderCart();
renderFavorites();
updateCounters();
registerCatalogTools();
