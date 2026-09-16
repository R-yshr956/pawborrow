import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { IonContent, IonPage, IonIcon } from '@ionic/react';
import { chevronBackOutline, cardOutline, addOutline, trashOutline } from 'ionicons/icons';
import { PaymentMethod, paymentMethods } from '../data/paymentMethods';
import '../style/PaymentMethods.css';

const CARD_BRANDS = ['Visa', 'Mastercard', 'American Express', 'Discover'];

const PaymentMethods = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { draft?: Record<string, unknown>; selectedCardId?: string; returnTo?: string } | undefined;
  const returnTo = state?.returnTo ?? '/dashboard';
  const [cards, setCards] = useState<PaymentMethod[]>(paymentMethods);
  const [selectedCardId, setSelectedCardId] = useState<string>(state?.selectedCardId ?? paymentMethods[0]?.id ?? '');

  useEffect(() => {
    if (state?.selectedCardId) {
      setSelectedCardId(state.selectedCardId);
    }
  }, [state?.selectedCardId]);

  const handleAddCard = () => {
    const nextBrand = CARD_BRANDS[Math.floor(Math.random() * CARD_BRANDS.length)];
    const nextLast4 = Math.floor(1000 + Math.random() * 9000).toString();

    setCards((prev) => [
      ...prev,
      {
        id: `pm_${Date.now()}`,
        brand: nextBrand,
        type: 'Credit Card',
        last4: nextLast4,
        isDefault: false,
      },
    ]);
  };

  const handleRemoveCard = (id: string) => {
    setCards((prev) => {
      const nextCards = prev.filter((card) => card.id !== id);
      if (nextCards.length === 0) {
        return prev;
      }
      if (selectedCardId === id) {
        setSelectedCardId(nextCards[0].id);
      }
      return nextCards;
    });
  };

  const handleSelectCard = (cardId: string) => {
    setSelectedCardId(cardId);
    navigate('/booking-review', {
      replace: true,
      state: {
        ...(state?.draft ?? {}),
        selectedCardId: cardId,
        returnTo,
      },
    });
  };

  return (
    <IonPage>
      <IonContent fullscreen className="payment-content">
        <div className="payment">
          <header className="payment-header">
            <button className="payment-back" aria-label="Go back" onClick={() => navigate(returnTo)}>
              <IonIcon icon={chevronBackOutline} />
            </button>
            <h1>Payment Methods</h1>
          </header>

          <div className="payment-list">
            {cards.map((card) => (
              <button
                type="button"
                className={`payment-card ${selectedCardId === card.id ? 'is-selected' : ''}`}
                key={card.id}
                onClick={() => handleSelectCard(card.id)}
              >
                <span className="payment-card-icon"><IonIcon icon={cardOutline} /></span>
                <div className="payment-card-info">
                  <p className="payment-card-brand">{card.brand}</p>
                  <p className="payment-card-number">•••• •••• •••• {card.last4}</p>
                </div>
                <span
                  className="payment-card-remove"
                  aria-label="Remove card"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleRemoveCard(card.id);
                  }}
                >
                  <IonIcon icon={trashOutline} />
                </span>
              </button>
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