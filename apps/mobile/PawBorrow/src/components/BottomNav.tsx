import { useLocation, useNavigate } from 'react-router-dom';
import { IonIcon } from '@ionic/react';
import { home, pawOutline, cartOutline, timeOutline, personOutline } from 'ionicons/icons';
import './BottomNav.css';

// Only these routes show the bottom nav — everything else (Notifications,
// DoctorDetails, CategoryDetails, Training) matches the design and has none
const VISIBLE_ON = ['/dashboard', '/service', '/shop', '/history', '/profile'];

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  if (!VISIBLE_ON.includes(location.pathname)) {
    return null;
  }

  return (
    <nav className="bottom-nav">
      <button
        className={`bottom-nav-item ${location.pathname === '/dashboard' ? 'bottom-nav-item--active' : ''}`}
        onClick={() => navigate('/dashboard')}
      >
        <IonIcon icon={home} />
        <span>Home</span>
      </button>

      <button
        className={`bottom-nav-item ${location.pathname === '/service' ? 'bottom-nav-item--active' : ''}`}
        onClick={() => navigate('/service')}
      >
        <IonIcon icon={pawOutline} />
        <span>Service</span>
      </button>

      <button className="bottom-nav-fab" aria-label="Shop" onClick={() => navigate('/shop')}>
        <IonIcon icon={cartOutline} />
      </button>

      <button className="bottom-nav-item ${location.pathname === '/history' ? 'bottom-nav-item--active' : ''}" onClick={() => navigate('/history')}>
        <IonIcon icon={timeOutline} />
        <span>History</span>
      </button>

      <button className="bottom-nav-item ${location.pathname === '/profile' ? 'bottom-nav-item--active' : ''}" onClick={() => navigate('/profile')}>
        <IonIcon icon={personOutline} />
        <span>Profile</span>
      </button>
    </nav>
  );
};

export default BottomNav;