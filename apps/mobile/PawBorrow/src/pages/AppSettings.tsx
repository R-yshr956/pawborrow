import { useNavigate } from 'react-router-dom';
import { IonContent, IonPage, IonIcon } from '@ionic/react';
import {
  chevronBackOutline,
  chevronForwardOutline,
  walletOutline,
  notificationsOutline,
  settingsOutline,
  calendarOutline,
} from 'ionicons/icons';
import '../style/AppSettings.css';

const menuItems = [
  { label: 'My Bookings', icon: calendarOutline, path: '/my-bookings' },
  { label: 'Payment Methods', icon: walletOutline, path: '/payment-methods' },
  { label: 'Notification Settings', icon: notificationsOutline, path: '/notification-settings' },
  { label: 'App Settings', icon: settingsOutline, path: '/app-settings' },
];

const AppSettings = () => {
  const navigate = useNavigate();

  return (
    <IonPage>
      <IonContent fullscreen className="app-settings-content">
        <div className="app-settings">
          <header className="app-settings-header">
            <button className="app-settings-back" aria-label="Go back" onClick={() => navigate('/profile')}>
              <IonIcon icon={chevronBackOutline} />
            </button>
            <h1>Settings</h1>
          </header>

          <div className="app-settings-menu">
            {menuItems.map((item) => (
              <button className="app-settings-item" key={item.label} onClick={() => navigate(item.path)}>
                <span className="app-settings-item-left">
                  <span className="app-settings-item-icon-wrap">
                    <IonIcon icon={item.icon} className="app-settings-item-icon" />
                  </span>
                  <span className="app-settings-item-label">{item.label}</span>
                </span>
                <IonIcon icon={chevronForwardOutline} className="app-settings-item-arrow" />
              </button>
            ))}
          </div>

          <p className="app-settings-version">PawBorrow v1.0.0</p>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AppSettings;