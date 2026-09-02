import { IonContent, IonPage, IonIcon } from '@ionic/react';
import { bagHandleOutline, calendarOutline } from 'ionicons/icons';

// TODO: placeholder data — replace once there's real order/booking history to show
const historyItems = [
  { id: 1, title: 'Appointment with Dr. Anna Johanson', date: 'Feb 8, 2024', icon: calendarOutline },
  { id: 2, title: 'Order: Cat Food (2x)', date: 'Feb 5, 2024', icon: bagHandleOutline },
  { id: 3, title: 'Grooming: Bathing & Drying', date: 'Jan 21, 2024', icon: calendarOutline },
];

import './History.css';

const History = () => {
  return (
    <IonPage>
      <IonContent fullscreen className="history-content">
        <div className="history">
          <h1 className="history-title">History</h1>

          <div className="history-list">
            {historyItems.map((item) => (
              <div className="history-card" key={item.id}>
                <span className="history-icon">
                  <IonIcon icon={item.icon} />
                </span>
                <div>
                  <p className="history-item-title">{item.title}</p>
                  <p className="history-item-date">{item.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default History;