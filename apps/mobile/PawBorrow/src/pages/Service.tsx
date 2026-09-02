import { IonContent, IonPage, IonIcon } from '@ionic/react';
import {
  locationOutline,
  notificationsOutline,
  searchOutline,
  star,
  home,
  pawOutline,
  cartOutline,
  timeOutline,
  personOutline,
} from 'ionicons/icons';
import { useNavigate } from 'react-router-dom';

// Real photos — point these at your actual asset files
import petsBanner from '../assets/images/dashboard/pets-banner.png';
import vaccinationsPhoto from '../assets/images/service/vaccinations.png';
import operationsPhoto from '../assets/images/service/operations.png';
import behavioralsPhoto from '../assets/images/service/behaviorals.png';
import dentistryPhoto from '../assets/images/service/dentistry.png';
import groomingPhoto from '../assets/images/service/grooming.png';
import drAnnaPhoto from '../assets/images/service/dr-anna-johanson.png';
import drVernonPhoto from '../assets/images/service/dr-vernon-chwe.png';

import './Service.css';
import { specialists } from '../data/specialists';

const serviceCategories = [
  { id: 'vaccinations', label: 'Vaccinations', photo: vaccinationsPhoto },
  { id: 'operations', label: 'Operations', photo: operationsPhoto },
  { id: 'behaviorals', label: 'Behaviorals', photo: behavioralsPhoto },
  { id: 'dentistry', label: 'Dentistry', photo: dentistryPhoto },
  { id: 'grooming', label: 'Grooming', photo: groomingPhoto },
];

export const Service = () => {
  const navigate = useNavigate();

  return (
    <IonPage>
      <IonContent fullscreen className="service-content">
        <div className="service">
          <header className="service-header">
            <div className="service-location">
              <IonIcon icon={locationOutline} />
              <span>Dhanmondi, Dhaka</span>
            </div>
            
          </header>

          <div className="service-promo">
            <div className="service-promo-text">
              <p className="service-promo-title">In Love with Pets?</p>
              <p className="service-promo-subtitle">
                Get all what you need for them
              </p>
            </div>
            <img className="service-promo-photo" src={petsBanner} alt="Pets" />
          </div>

          <div className="service-search">
            <IonIcon icon={searchOutline} />
            <input type="text" placeholder="Search" />
          </div>

          <section className="service-section">
            <div className="service-section-header">
              <h2>Our Services</h2>
              <span className="service-see-all">See All</span>
            </div>
            <div className="service-categories">
              {serviceCategories.map((cat) => (
                <div className="service-category" key={cat.id} onClick={() => navigate(`/service/category/${cat.id}`)} style={{ cursor: 'pointer' }}>
                  <img src={cat.photo} alt={cat.label} />
                  <span>{cat.label}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="service-section">
            <h2>Best Specialists Nearby</h2>
            <div className="service-specialists">
              {specialists.map((doc) => (
                <div className="service-specialist-card" key={doc.name} onClick={() => navigate(`/service/doctor/${doc.id}`)} style={{ cursor: 'pointer' }}>
                  <img src={doc.photo} alt={doc.name} />
                  <div className="service-specialist-info">
                    <p className="service-specialist-name">{doc.name}</p>
                    <p className="service-specialist-specialty">{doc.specialty}</p>
                    <div className="service-specialist-meta">
                      <span className="service-specialist-rating">
                        <IonIcon icon={star} />
                        {doc.rating}
                      </span>
                      <span className="service-specialist-distance">
                        <IonIcon icon={locationOutline} />
                        {doc.distance}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

      </IonContent>
    </IonPage>
  );
};

export default Service;
