import { IonContent, IonPage, IonIcon } from '@ionic/react';
import {
  chevronBackOutline,
  bagHandleOutline,
  checkmarkOutline,
  heartOutline,
} from 'ionicons/icons';
import { useNavigate } from 'react-router-dom';
import './Notification.css';

interface NotificationItem {
  icon: string;
  text: string;
}

interface NotificationSection {
  date: string;
  items: NotificationItem[];
}

// TODO: replace with real data — guessed content for 13 Feb / 5 Feb, since
// the original <Notification> component's internals weren't provided
const sections: NotificationSection[] = [
  {
    date: 'Today',
    items: [
      { icon: bagHandleOutline, text: 'Your checkout is successful, product is on the way' },
      { icon: checkmarkOutline, text: 'Appointment request accepted' },
    ],
  },
  {
    date: '13 February',
    items: [
      { icon: bagHandleOutline, text: 'Your checkout is successful, product is on the way' },
      { icon: heartOutline, text: 'Item added to your favorites' },
      { icon: checkmarkOutline, text: 'Appointment request accepted' },
    ],
  },
  {
    date: '05 February',
    items: [
      { icon: bagHandleOutline, text: 'Your checkout is successful, product is on the way' },
      { icon: heartOutline, text: 'Item added to your favorites' },
      { icon: checkmarkOutline, text: 'Appointment request accepted' },
    ],
  },
  {
    date: '21 January',
    items: [
      { icon: bagHandleOutline, text: 'Your checkout is successful, product is on the way' },
      { icon: checkmarkOutline, text: 'Appointment request accepted' },
    ],
  },
];

export const Notification = () => {
  const navigate = useNavigate();
  return (
    <IonPage>
      <IonContent fullscreen className="notifications-content">
        <div className="notifications">
          <header className="notifications-header">
            <button className="notifications-back" aria-label="Go back" onClick={() => navigate('/dashboard')}>
              <IonIcon icon={chevronBackOutline} />
            </button>
            <h1>Booking Information</h1>
          </header>

          {sections.map((section) => (
            <div className="notifications-section" key={section.date}>
              <p className="notifications-date">{section.date}</p>
              <div className="notifications-card">
                {section.items.map((item, i) => (
                  <div className="notifications-row" key={i}>
                    <span className="notifications-icon">
                      <IonIcon icon={item.icon} />
                    </span>
                    <p>{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Notification;
