// src/pages/MyBookings.tsx
import { useNavigate } from 'react-router-dom';
import { IonContent, IonPage, IonIcon } from '@ionic/react';
import { chevronBackOutline, calendarOutline, timeOutline } from 'ionicons/icons';
import { useBookings } from '../context/BookingsContext';
import '../style/MyBookings.css';

const MyBookings = () => {
  const navigate = useNavigate();
  const { bookings, cancelBooking } = useBookings();

  return (
    <IonPage>
      <IonContent fullscreen className="my-bookings-content">
        <div className="my-bookings">
          <header className="my-bookings-header">
            <button className="my-bookings-back" aria-label="Go back" onClick={() => navigate('/profile')}>
              <IonIcon icon={chevronBackOutline} />
            </button>
            <h1>My Bookings</h1>
          </header>

          {bookings.length === 0 ? (
            <p className="my-bookings-empty">You have no bookings yet.</p>
          ) : (
            <div className="my-bookings-list">
              {bookings.map((booking) => (
                <div className="my-bookings-card" key={booking.id}>
                  <img src={booking.photo} alt={booking.name} />
                  <div className="my-bookings-info">
                    <p className="my-bookings-name">{booking.name}</p>
                    <p className="my-bookings-subtitle">{booking.subtitle}</p>
                    <div className="my-bookings-meta">
                      <span><IonIcon icon={calendarOutline} /> {booking.date}</span>
                      <span><IonIcon icon={timeOutline} /> {booking.time}</span>
                    </div>
                    <span className={`my-bookings-status my-bookings-status--${booking.status.toLowerCase()}`}>
                      {booking.status}
                    </span>
                  </div>
                  {booking.status === 'Upcoming' && (
                    <button className="my-bookings-cancel" onClick={() => cancelBooking(booking.id)}>
                      Cancel
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default MyBookings;