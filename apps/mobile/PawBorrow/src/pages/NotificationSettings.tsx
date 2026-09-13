import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IonContent, IonPage, IonIcon, IonToggle } from '@ionic/react';
import { chevronBackOutline } from 'ionicons/icons';
import '../style/NotificationSettings.css';

const initialSettings = [
  { id: 'booking-reminders', label: 'Booking Reminders', enabled: true },
  { id: 'promotions', label: 'Promotions & Offers', enabled: true },
  { id: 'new-messages', label: 'New Messages', enabled: true },
  { id: 'training-updates', label: 'Training Updates', enabled: false },
];

const NotificationSettings = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState(initialSettings);

  const toggleSetting = (id: string) => {
    setSettings((prev) => prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)));
  };

  return (
    <IonPage>
      <IonContent fullscreen className="notif-settings-content">
        <div className="notif-settings">
          <header className="notif-settings-header">
            <button className="notif-settings-back" aria-label="Go back" onClick={() => navigate('/profile')}>
              <IonIcon icon={chevronBackOutline} />
            </button>
            <h1>Notification Settings</h1>
          </header>

          <div className="notif-settings-list">
            {settings.map((setting) => (
              <div className="notif-settings-row" key={setting.id}>
                <span>{setting.label}</span>
                <IonToggle checked={setting.enabled} onIonChange={() => toggleSetting(setting.id)} />
              </div>
            ))}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default NotificationSettings;