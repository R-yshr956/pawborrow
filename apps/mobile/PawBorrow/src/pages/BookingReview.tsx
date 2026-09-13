import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { IonContent, IonPage, IonIcon } from '@ionic/react';
import { chevronBackOutline, calendarOutline, timeOutline, cardOutline, chevronForwardOutline } from 'ionicons/icons';
import { useBookings, Booking } from '../context/BookingsContext';
import { mockCards } from '../data/paymentMethods';
import '../style/BookingReview.css';

type DraftBooking = Omit<Booking, 'id' | 'status'>;

const BookingReview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addBooking } = useBookings();
  const draft = location.state as DraftBooking | undefined;

  const [selectedCardId, setSelectedCardId] = useState(mockCards[0]?.id ?? '');
  const selectedCard = mockCards.find((c) => c.id === selectedCardId);

  if (!draft) {
    return (
      <IonPage>
        <IonContent fullscreen className="booking-review-content">
          <div className="booking-review-empty">
            <p>Nothing to review.</p>
            <button onClick={() => navigate('/dashboard')}>Back to Home</button>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  const handleConfirm = () => {
    const booking = addBooking(draft);
    navigate('/booking-confirmation', { state: booking, replace: true });
  };

  return (
    <IonPage>
      <IonContent fullscreen className="booking-review-content">
        <div className="booking-review">
          <header className="booking-review-header">
            <button className="booking-review-back" aria-label="Go back" onClick={() => navigate(-1)}>
              <IonIcon icon={chevronBackOutline} />
            </button>
            <h1>Confirm Booking</h1>
          </header>

          <div className="booking-review-card">
            <img src={draft.photo} alt={draft.name} />
            <div>
              <p className="booking-review-name">{draft.name}</p>
              <p className="booking-review-subtitle">
                {draft.category} • {draft.subtitle}
              </p>
            </div>
          </div>

          <div className="booking-review-details">
            <div className="booking-review-row">
              <span className="booking-review-row-label">
                <IonIcon icon={calendarOutline} /> Date
              </span>
              <span className="booking-review-row-value">{draft.date}</span>
            </div>
            <div className="booking-review-row">
              <span className="booking-review-row-label">
                <IonIcon icon={timeOutline} /> Time
              </span>
              <span className="booking-review-row-value">{draft.time}</span>
            </div>
            {draft.detail && (
              <div className="booking-review-row">
                <span className="booking-review-row-label">Details</span>
                <span className="booking-review-row-value">{draft.detail}</span>
              </div>
            )}
          </div>

          <p className="booking-review-section-title">Payment Method</p>
          {mockCards.length === 0 ? (
            <button className="booking-review-payment booking-review-payment--empty" onClick={() => navigate('/payment-methods')}>
              <span className="booking-review-payment-icon"><IonIcon icon={cardOutline} /></span>
              <span className="booking-review-payment-label">Add a payment method</span>
              <IonIcon icon={chevronForwardOutline} className="booking-review-payment-arrow" />
            </button>
          ) : (
            <button className="booking-review-payment" onClick={() => navigate('/payment-methods')}>
              <span className="booking-review-payment-icon"><IonIcon icon={cardOutline} /></span>
              <div className="booking-review-payment-info">
                <p className="booking-review-payment-brand">{selectedCard?.brand}</p>
                <p className="booking-review-payment-number">•••• {selectedCard?.last4}</p>
              </div>
              <IonIcon icon={chevronForwardOutline} className="booking-review-payment-arrow" />
            </button>
          )}

          <p className="booking-review-note">
            Please review your booking details carefully. You can go back to change the date or time before confirming.
          </p>
        </div>

        <div className="booking-review-footer">
          <button className="booking-review-cancel" onClick={() => navigate(-1)}>
            Back
          </button>
          <button className="booking-review-confirm" onClick={handleConfirm} disabled={!selectedCard}>
            Confirm Booking
          </button>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default BookingReview;