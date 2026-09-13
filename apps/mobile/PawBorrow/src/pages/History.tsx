import { useNavigate } from 'react-router-dom';
import { IonContent, IonPage, IonIcon } from '@ionic/react';
import { chevronBackOutline } from 'ionicons/icons';
import { useBookings } from '../context/BookingsContext';
import '../style/History.css';

const History = () => {
  const navigate = useNavigate();
  const { bookings } = useBookings();

  // Groups by each booking's own appointment date string — not real
  // calendar "Today" bucketing, since there's no separate booking-creation
  // timestamp being tracked yet. See note below.
  const groups = bookings.reduce<Record<string, typeof bookings>>((acc, booking) => {
    (acc[booking.date] ||= []).push(booking);
    return acc;
  }, {});

  return (
    <IonPage>
      <IonContent fullscreen className="booking-history-content">
        <div className="booking-history">
          <header className="booking-history-header">
            <button className="booking-history-back" aria-label="Go back" onClick={() => navigate(-1)}>
              <IonIcon icon={chevronBackOutline} />
            </button>
            <h1>Booking History</h1>
          </header>

          {bookings.length === 0 ? (
            <p className="booking-history-empty">No bookings yet.</p>
          ) : (
            Object.entries(groups).map(([date, group]) => (
              <div className="booking-history-section" key={date}>
                <p className="booking-history-date">{date}</p>
                {group.map((booking) => (
                  <div className="booking-history-card" key={booking.id}>
                    <img src={booking.photo} alt={booking.name} />
                    <div className="booking-history-info">
                      <p className="booking-history-line">
                        {booking.category} | Name: {booking.name} | {booking.type === 'pet' ? 'Breed' : 'Specialty'}: {booking.subtitle}
                      </p>
                      {booking.detail && <p className="booking-history-line">{booking.detail}</p>}
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default History;