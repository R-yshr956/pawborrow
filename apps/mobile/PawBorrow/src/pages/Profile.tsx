import { useNavigate } from 'react-router-dom';
import { IonContent, IonPage, IonIcon } from '@ionic/react';
import { chevronForwardOutline, logOutOutline, settingsOutline } from 'ionicons/icons';
import avatar from '../assets/images/dashboard/avatar-sarah.png';
import { useAuth } from '../context/AuthContext';
import '../style/Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const profileName = user?.displayName ?? 'Sarah';
  const fullName = user?.fullName ?? 'Sarah';
  const phoneNumber = user?.phoneNumber ?? '+62 812 3456 7890';
  const accountCreated = user?.accountCreated ?? 'August 2024';
  const email = user?.email ?? 'test@pawborrow.com';

  return (
    <IonPage>
      <IonContent fullscreen className="profile-content">
        <div className="profile-page">
          <div className="profile-header">
            <div className="profile-avatar-wrap">
              <img className="profile-avatar" src={avatar} alt={profileName} />
            </div>
            <p className="profile-name">{profileName}</p>
            <p className="profile-email">{email}</p>
          </div>

          <div className="profile-fields">
            <div className="profile-field">
              <span className="profile-field-label">Display name</span>
              <span className="profile-field-value">{profileName}</span>
            </div>

            <div className="profile-field">
              <span className="profile-field-label">Full Name</span>
              <span className="profile-field-value">{fullName}</span>
            </div>

            <div className="profile-field">
              <span className="profile-field-label">Phone Number</span>
              <span className="profile-field-value">{phoneNumber}</span>
            </div>

            <div className="profile-field">
              <span className="profile-field-label">Account created since</span>
              <span className="profile-field-value">{accountCreated}</span>
            </div>
          </div>

          <div className="profile-actions">
            <button className="profile-settings-btn" onClick={() => navigate('/app-settings')}>
              <span className="profile-settings-label">
                <IonIcon icon={settingsOutline} className="profile-settings-icon" />
                Settings
              </span>
              <IonIcon icon={chevronForwardOutline} className="profile-settings-arrow" />
            </button>

            <button className="profile-logout-btn" onClick={logout}>
              <span className="profile-logout-label">
                <IonIcon icon={logOutOutline} className="profile-logout-icon" />
                Logout
              </span>
            </button>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Profile;