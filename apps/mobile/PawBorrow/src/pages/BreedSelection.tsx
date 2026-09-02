import { useNavigate, useParams } from 'react-router-dom';
import { IonContent, IonPage, IonIcon } from '@ionic/react';
import { chevronBackOutline } from 'ionicons/icons';
import { animalBreeds } from '../data/breeds';
import './BreedSelection.css';

const BreedSelection = () => {
  const { animalId } = useParams<{ animalId: string }>();
  const navigate = useNavigate();
  const category = animalBreeds.find((c) => c.id === animalId);

  if (!category) {
    return (
      <IonPage>
        <IonContent fullscreen className="breed-content">
          <div className="breed-not-found">
            <p>Category not found.</p>
            <button onClick={() => navigate('/dashboard')}>Back to Home</button>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonContent fullscreen className="breed-content">
        <div className="breed">
          <header className="breed-header">
            <button className="breed-back" aria-label="Go back" onClick={() => navigate('/dashboard')}>
              <IonIcon icon={chevronBackOutline} />
            </button>
            <h1>{category.label} Breeds</h1>
          </header>

          <div className="breed-grid">
            {category.breeds.map((breed) => (
              <div className="breed-card" key={breed.id}>
                <img src={breed.photo} alt={breed.name} />
                <span>{breed.name}</span>
              </div>
            ))}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default BreedSelection;