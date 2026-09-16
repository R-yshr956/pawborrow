import { useNavigate } from 'react-router-dom';
import { IonContent, IonPage, IonIcon } from '@ionic/react';
import { chevronBackOutline, trashOutline, addOutline, removeOutline } from 'ionicons/icons';
import { useCart } from '../context/CartContext';
import { products } from '../data/products';
import '../style/Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const { items, itemCount, clearCart, increaseQty, decreaseQty, removeItem } = useCart();

  const cartItems = items
    .map((item) => {
      const product = products.find((entry) => entry.id === item.productId);
      return product ? { ...product, quantity: item.quantity } : null;
    })
    .filter(Boolean) as Array<(typeof products)[number] & { quantity: number }>;

  const subtotal = cartItems.reduce((total, product) => total + product.price * product.quantity, 0);

  return (
    <IonPage>
      <IonContent fullscreen className="cart-content">
        <div className="cart-page">
          <header className="cart-header">
            <button className="cart-back" aria-label="Go back" onClick={() => navigate(-1)}>
              <IonIcon icon={chevronBackOutline} />
            </button>
            <h1>Cart</h1>
          </header>

          <div className="cart-summary">
            <span>{itemCount} items</span>
            <strong>₱{subtotal.toLocaleString()}</strong>
          </div>

          {cartItems.length === 0 ? (
            <div className="cart-empty">
              <p>Your cart is empty.</p>
              <button onClick={() => navigate('/shop')}>Browse products</button>
            </div>
          ) : (
            <>
              <div className="cart-list">
                {cartItems.map((product) => (
                  <div className="cart-item" key={product.id}>
                    <img src={product.image} alt={product.name} />

                    <div className="cart-item-body">
                      <div className="cart-item-topline">
                        <h2>{product.name}</h2>
                        <button aria-label={`Remove ${product.name}`} onClick={() => removeItem(product.id)}>
                          <IonIcon icon={trashOutline} />
                        </button>
                      </div>

                      <p>{product.category}</p>

                      <div className="cart-item-controls">
                        <div className="qty-control">
                          <button onClick={() => decreaseQty(product.id)} aria-label={`Decrease quantity of ${product.name}`}>
                            <IonIcon icon={removeOutline} />
                          </button>
                          <span>{product.quantity}</span>
                          <button onClick={() => increaseQty(product.id)} aria-label={`Increase quantity of ${product.name}`}>
                            <IonIcon icon={addOutline} />
                          </button>
                        </div>

                        <strong>₱{(product.price * product.quantity).toLocaleString()}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-footer">
                <div>
                  <span>Subtotal</span>
                  <strong>₱{subtotal.toLocaleString()}</strong>
                </div>
                <button className="checkout-button">Checkout</button>
              </div>

              <button className="clear-cart-button" onClick={clearCart}>Clear cart</button>
            </>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Cart;
