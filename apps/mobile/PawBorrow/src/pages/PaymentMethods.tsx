import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IonContent, IonPage, IonIcon } from '@ionic/react';
import { chevronBackOutline, cardOutline, addOutline, trashOutline } from 'ionicons/icons';
import { Card, mockCards } from '../data/paymentMethods';
import '../style/PaymentMethods.css';

const PaymentMethods = () => {
  const navigate = useNavigate();
  const [cards, setCards] = useState<Card[]>(mockCards);

  // TODO: no real payment integration yet — generates a mock card for UI demo purposes only
  const handleAddCard = () => {
    const nextLast4 = Math.floor(1000 + Math.random() * 9000).toString();
    setCards((prev) => [...prev, { id: `${Date.now()}`, brand: 'Mastercard', last4: nextLast4 }]);
  };

  const handleRemoveCard = (id: string) => {
    setCards((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <IonPage>
      <IonContent fullscreen className="payment-content">
        <div className="payment">
          <header className="payment-header">
            <button className="payment-back" aria-label="Go back" onClick={() => navigate(-1)}>
              <IonIcon icon={chevronBackOutline} />
            </button>
            <h1>Payment Methods</h1>
          </header>

          <div className="payment-list">
            {cards.map((card) => (
              <div className="payment-card" key={card.id}>
                <span className="payment-card-icon"><IonIcon icon={cardOutline} /></span>
                <div className="payment-card-info">
                  <p className="payment-card-brand">{card.brand}</p>
                  <p className="payment-card-number">•••• •••• •••• {card.last4}</p>
                </div>
                <button className="payment-card-remove" aria-label="Remove card" onClick={() => handleRemoveCard(card.id)}>
                  <IonIcon icon={trashOutline} />
                </button>
              </div>
            ))}
          </div>

          <button className="payment-add-btn" onClick={handleAddCard}>
            <IonIcon icon={addOutline} />
            Add Payment Method
          </button>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default PaymentMethods;