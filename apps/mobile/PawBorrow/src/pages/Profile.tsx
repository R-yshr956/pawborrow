import { IonContent, IonPage, IonIcon } from '@ionic/react';
import {
  personOutline,
  cardOutline,
  notificationsOutline,
  settingsOutline,
  logOutOutline,
  chevronForwardOutline,
} from 'ionicons/icons';
import avatar from '../assets/images/dashboard/avatar-sarah.png';
import './Profile.css';

const menuItems = [
  { label: 'My Bookings', icon: personOutline },
  { label: 'Payment Methods', icon: cardOutline },
  { label: 'Notification Settings', icon: notificationsOutline },
  { label: 'App Settings', icon: settingsOutline },
];

const Profile = () => {
  return (
    <IonPage>
      <IonContent fullscreen className="profile-content">
        <div className="profile">
          <div className="profile-header">
            <img className="profile-avatar" src={avatar} alt="Sarah" />
            <p className="profile-name">Sarah</p>
            <p className="profile-email">sarah@pawborrow.com</p>
          </div>

          <div className="profile-menu">
            {menuItems.map((item) => (
              <button className="profile-menu-item" key={item.label}>
                <span className="profile-menu-icon">
                  <IonIcon icon={item.icon} />
                </span>
                <span className="profile-menu-label">{item.label}</span>
                <IonIcon icon={chevronForwardOutline} className="profile-menu-arrow" />
              </button>
            ))}

            <button className="profile-menu-item profile-menu-item--danger">
              <span className="profile-menu-icon">
                <IonIcon icon={logOutOutline} />
              </span>
              <span className="profile-menu-label">Log Out</span>
            </button>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Profile;