import { useLocation, useNavigate } from 'react-router-dom';
import { IonContent, IonPage, IonIcon } from '@ionic/react';
import { checkmarkCircle } from 'ionicons/icons';
import type { Booking } from '../context/BookingsContext';
import '../style/BookingConfirmation.css';

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state as Booking | undefined;

  if (!booking) {
    return (
      <IonPage>
        <IonContent fullscreen className="booking-confirmation-content">
          <div className="booking-confirmation-empty">
            <p>No booking found.</p>
            <button onClick={() => navigate('/dashboard')}>Back to Home</button>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonContent fullscreen className="booking-confirmation-content">
        <div className="booking-confirmation">
          <IonIcon icon={checkmarkCircle} className="booking-confirmation-check" />
          <h1>Booking Confirmed!</h1>
          <p className="booking-confirmation-subtitle">Your appointment has been successfully booked.</p>

          <div className="booking-confirmation-card">
            <img src={booking.photo} alt={booking.name} />
            <div>
              <p className="booking-confirmation-name">{booking.name}</p>
              <p className="booking-confirmation-detail">{booking.subtitle}</p>
              <p className="booking-confirmation-detail">{booking.date} • {booking.time}</p>
            </div>
          </div>

          <button className="booking-confirmation-btn" onClick={() => navigate('/my-bookings')}>
            View My Bookings
          </button>
          <button className="booking-confirmation-btn booking-confirmation-btn--outline" onClick={() => navigate('/dashboard')}>
            Back to Home
          </button>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default BookingConfirmation;