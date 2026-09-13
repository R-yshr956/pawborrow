import { useNavigate } from 'react-router-dom';
import { IonContent, IonPage, IonIcon } from '@ionic/react';
import { chevronBackOutline, heartDislikeOutline, pawOutline } from 'ionicons/icons';
import { pets } from '../data/pets';
import { useEffect, useState } from 'react';
import '../style/LikedPets.css';

const LIKED_PETS_STORAGE_KEY = 'pawborrow-liked-pets';

const LikedPets = () => {
  const navigate = useNavigate();
  const [likedPetIds, setLikedPetIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(LIKED_PETS_STORAGE_KEY);
      setLikedPetIds(stored ? JSON.parse(stored) : []);
    } catch {
      setLikedPetIds([]);
    }
  }, []);

  const likedPets = pets.filter((pet) => likedPetIds.includes(pet.id));

  return (
    <IonPage>
      <IonContent fullscreen className="liked-pets-content">
        <div className="liked-pets">
          <header className="liked-pets-header">
            <button className="liked-pets-back" aria-label="Go back" onClick={() => navigate(-1)}>
              <IonIcon icon={chevronBackOutline} />
            </button>
            <h1>Liked Pets</h1>
          </header>

          {likedPets.length === 0 ? (
            <div className="liked-pets-empty">
              <div className="liked-pets-empty-icon">
                <IonIcon icon={heartDislikeOutline} />
              </div>
              <h2>No liked pets yet</h2>
              <p>Browse available pets and save the ones you love.</p>
              <button className="liked-pets-button" onClick={() => navigate('/pet-category')}>
                <IonIcon icon={pawOutline} />
                Browse Pets
              </button>
            </div>
          ) : (
            <div className="liked-pets-grid">
              {likedPets.map((pet) => (
                <button
                  key={pet.id}
                  className="liked-pet-item"
                  onClick={() => navigate(`/dashboard/pet/${pet.id}`)}
                >
                  <img src={pet.image} alt={pet.name} />
                  <span>{pet.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default LikedPets;
