import { IonContent, IonPage, IonIcon } from '@ionic/react';
import { chevronBackOutline, checkmarkCircle, closeCircle } from 'ionicons/icons';
import { useNavigate } from 'react-router-dom';
import { useBookings } from '../context/BookingsContext';
import '../style/Notification.css';

export const Notification = () => {
  const navigate = useNavigate();
  const { notifications } = useBookings();

  const groups = notifications.reduce<Record<string, typeof notifications>>((acc, n) => {
    (acc[n.createdAt] ||= []).push(n);
    return acc;
  }, {});

  return (
    <IonPage>
      <IonContent fullscreen className="notifications-content">
        <div className="notifications">
          <header className="notifications-header">
            <button className="notifications-back" aria-label="Go back" onClick={() => navigate(-1)}>
              <IonIcon icon={chevronBackOutline} />
            </button>
            <h1>Notifications</h1>
          </header>

          {notifications.length === 0 ? (
            <p className="notifications-empty">No notifications yet.</p>
          ) : (
            Object.entries(groups).map(([date, group]) => (
              <div className="notifications-section" key={date}>
                <p className="notifications-date">{date}</p>
                <div className="notifications-card">
                  {group.map((n) => (
                    <div className="notifications-row" key={n.id}>
                      <span
                        className="notifications-icon"
                        style={n.type === 'cancelled' ? { background: '#fbe2e1', color: '#e0433d' } : undefined}
                      >
                        <IonIcon icon={n.type === 'confirmed' ? checkmarkCircle : closeCircle} />
                      </span>
                      <p>{n.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Notification;