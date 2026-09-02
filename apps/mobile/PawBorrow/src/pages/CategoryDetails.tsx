import { useNavigate, useParams } from 'react-router-dom';
import { IonContent, IonPage, IonIcon } from '@ionic/react';
import { chevronBackOutline, searchOutline } from 'ionicons/icons';
import { categoryServices } from '../data/categoryServices';
import './CategoryDetails.css';

const CategoryDetails = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const category = categoryServices.find((c) => c.id === categoryId);

  if (!category) {
    return (
      <IonPage>
        <IonContent fullscreen className="category-content">
          <div className="category-not-found">
            <p>Category not found.</p>
            <button onClick={() => navigate('/service')}>Back to Service</button>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonContent fullscreen className="category-content">
        <div className="category">
          <header className="category-header">
            <button className="category-back" aria-label="Go back" onClick={() => navigate('/service')}>
              <IonIcon icon={chevronBackOutline} />
            </button>
            <h1>{category.title}</h1>
          </header>

          <div className="category-promo">
            <div className="category-promo-text">
              <p className="category-promo-badge">{category.discountBadge}</p>
              <p className="category-promo-subtitle">{category.discountSubtitle}</p>
            </div>
            <img className="category-promo-photo" src={category.discountPhoto} alt={category.title} />
          </div>

          <div className="category-search">
            <input type="text" placeholder="Search" />
            <button className="category-search-btn" aria-label="Search">
              <IonIcon icon={searchOutline} />
            </button>
          </div>

          <div className="category-section-header">
            <h2>Our Services</h2>
            <span className="category-see-all">See All</span>
          </div>

          <div className="category-grid">
            {category.subServices.map((sub) => (
              <div className="category-card" key={sub.name}>
                <img src={sub.photo} alt={sub.name} />
                <span>{sub.name}</span>
              </div>
            ))}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default CategoryDetails;
