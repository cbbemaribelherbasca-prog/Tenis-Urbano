import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { money, products } from '../data/products';
import { useShop } from '../context/ShopContext';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';
export default function Cart() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, changeQuantity, clearCart } = useShop();
  const [purchaseComplete, setPurchaseComplete] = useState(false);
  const total = cart.reduce(
    (sum, item) =>
      sum + products.find((product) => product.id === item.id).price * item.qty,
    0
  );
  return (
    <section className="catalog">
      <p className="eyebrow">Tu selección</p>
      <h1>Carrito</h1>
      {cart.length ? (
        <div className="cart-page">
          {cart.map((item) => {
            const product = products.find((value) => value.id === item.id);
            return (
              <article className="drawer-item" key={`${item.id}-${item.size}`}>
                <img src={product.image} alt={product.name} />
                <div className="drawer-item-info">
                  <Link
                    to={`/producto/${product.id}`}
                    state={{ backgroundLocation: location }}
                    data-product-link={product.id}
                  >
                    {product.name}
                  </Link>
                  <small>
                    Talla {item.size} · {money(product.price)}
                  </small>
                  <div className="qty">
                    <button
                      aria-label={`Reducir cantidad de ${product.name}`}
                      onClick={() => changeQuantity(item.id, item.size, -1)}
                    >
                      −
                    </button>
                    <span>{item.qty}</span>
                    <button
                      aria-label={`Aumentar cantidad de ${product.name}`}
                      onClick={() => changeQuantity(item.id, item.size, 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  className="remove-btn"
                  aria-label={`Eliminar ${product.name}`}
                  onClick={() => changeQuantity(item.id, item.size, -item.qty)}
                >
                  ×
                </button>
              </article>
            );
          })}
          <p className="total-row" role="status">
            <span>Total</span>
            <strong>{money(total)}</strong>
          </p>
          <p>Compra de demostración: no se procesan pagos.</p>
          <button
            id="checkout-button"
            className="primary-button checkout-button"
            type="button"
            onClick={() => setPurchaseComplete(true)}
          >
            Finalizar compra
          </button>
          <Link className="hero-cta" to="/catalogo">
            Seguir explorando →
          </Link>
        </div>
      ) : (
        <EmptyState title="Tu carrito está vacío">
          Elige un modelo y una talla para comenzar.
        </EmptyState>
      )}
      {purchaseComplete && (
        <Modal
          className="checkout-modal"
          labelledBy="checkout-title"
          describedBy="checkout-description"
          closeLabel="Cerrar confirmación"
          returnFocusSelector="#checkout-button"
          onClose={() => setPurchaseComplete(false)}
        >
          <div className="checkout-success-icon" aria-hidden="true">
            ✓
          </div>
          <p className="eyebrow">Gracias por elegirnos</p>
          <h2 id="checkout-title">¡Compra exitosa!</h2>
          <p id="checkout-description">
            Tu selección se confirmó correctamente en esta demostración. No se realizó
            ningún cobro.
          </p>
          <div className="checkout-summary">
            <span>Total de tu selección</span>
            <strong>{money(total)}</strong>
          </div>
          <button
            className="primary-button"
            type="button"
            onClick={() => {
              clearCart();
              setPurchaseComplete(false);
              navigate('/catalogo?ver=coleccion', { replace: true });
            }}
          >
            Volver al catálogo
          </button>
        </Modal>
      )}
    </section>
  );
}
