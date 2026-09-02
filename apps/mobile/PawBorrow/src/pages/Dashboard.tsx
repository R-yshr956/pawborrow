import { IonContent, IonPage, IonIcon } from '@ionic/react';
import {
  notificationsOutline,
  searchOutline,
  homeOutline,
  home,
  pawOutline,
  cartOutline,
  timeOutline,
  personOutline,
} from 'ionicons/icons';
import { useNavigate } from 'react-router-dom';

// Real photos — point these at your actual asset files
import avatar from '../assets/images/dashboard/avatar-sarah.png';
import petsBanner from '../assets/images/dashboard/pets-banner.png';
import catPhoto from '../assets/images/dashboard/cat.png';
import dogPhoto from '../assets/images/dashboard/dog.png';
import rabbitPhoto from '../assets/images/dashboard/rabbit.png';
import guineaPigPhoto from '../assets/images/dashboard/guinea-pig.png';
import bookNowPhoto from '../assets/images/dashboard/book-now.png';
import communityPhoto from '../assets/images/dashboard/community.png';
import trainingCardPhoto from '../assets/images/dashboard/training-card.png';

import './Dashboard.css';

const categories = [
  { id: 'cat', label: 'Cat', photo: catPhoto },
  { id: 'dog', label: 'Dog', photo: dogPhoto },
  { id: 'rabbit', label: 'Rabbit', photo: rabbitPhoto },
  { id: 'guinea-pig', label: 'Guinea Pig', photo: guineaPigPhoto },
];

export const Dashboard = () => {
  const navigate = useNavigate();
  return (
    <IonPage>
      <IonContent fullscreen className="dashboard-content">
        <div className="dashboard">
          <header className="dashboard-header">
            <div className="dashboard-user">
              <img className="dashboard-avatar" src={avatar} alt="Sarah" />
              <div>
                <p className="dashboard-greeting">Hello, Sarah</p>
                <p className="dashboard-subgreeting">Good Morning!</p>
              </div>
            </div>
            <button className="dashboard-icon-btn" aria-label="Notifications" onClick={() => navigate('/notification')}>
              <IonIcon icon={notificationsOutline} />
            </button>
          </header>

          <div className="dashboard-search">
            <IonIcon icon={searchOutline} />
            <input type="text" placeholder="search" />
          </div>

          <div className="dashboard-promo">
            <div className="dashboard-promo-text">
              <p className="dashboard-promo-title">In Love with Pets?</p>
              <p className="dashboard-promo-subtitle">
                Get all what you need for them
              </p>
            </div>
            <img className="dashboard-promo-photo" src={petsBanner} alt="Pets" />
          </div>

          <section className="dashboard-section">
            <div className="dashboard-section-header">
              <h2>Category</h2>
              <span className="dashboard-see-all">See All</span>
            </div>
            <div className="dashboard-categories">
              {categories.map((cat) => (
                <div className="dashboard-category" key={cat.id}
                  onClick={() => navigate(`/breed-selection/${cat.id}`)}
                  style={{ cursor: 'pointer' }}>
                  <img src={cat.photo} alt={cat.label} />
                  <span>{cat.label}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="dashboard-section">
            <h2>Book Now</h2>
            <div className="dashboard-card">
              <div className="dashboard-card-text">
                <p>Find and Join in Special Events For Your Pets!</p>
                <button className="dashboard-card-btn">See More</button>
              </div>
              <img src={bookNowPhoto} alt="Pet event" />
            </div>
          </section>

          <section className="dashboard-section">
            <h2>Community</h2>
            <div className="dashboard-card">
              <div className="dashboard-card-text">
                <p>Learn more about the pet!</p>
                <button className="dashboard-card-btn">See More</button>
              </div>
              <img src={communityPhoto} alt="Community" />
            </div>
          </section>

          <section className="dashboard-section">
          <h2>Training</h2>
          <div className="dashboard-card">
            <div className="dashboard-card-text">
              <p>Learn to train your pet from the pros!</p>
              <button className="dashboard-card-btn" onClick={() => navigate('/training')}>
                See More
              </button>
            </div>
            <img src={trainingCardPhoto} alt="Training" />
          </div>
        </section> 
        </div>

      </IonContent>
    </IonPage>
  );
};

export default Dashboard;