import { useNavigate, useParams } from 'react-router-dom';
import { IonContent, IonPage, IonIcon } from '@ionic/react';
import { chevronBackOutline, heart, heartOutline } from 'ionicons/icons';
import { animalBreeds } from '../data/breeds';
import { pets } from '../data/pets';
import { useEffect, useState } from 'react';
import SearchBar from '../components/SearchBar';
import { matchesSearch } from '../assets/images/utils/search';
import '../style/BreedPets.css';

const LIKED_PETS_STORAGE_KEY = 'pawborrow-liked-pets';

const BreedPets = () => {
  const { animalId, breedId } = useParams<{ animalId: string; breedId: string }>();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [likedPetIds, setLikedPetIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(LIKED_PETS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(LIKED_PETS_STORAGE_KEY, JSON.stringify(likedPetIds));
  }, [likedPetIds]);

  const category = animalBreeds.find((c) => c.id === animalId);
  const breed = category?.breeds.find((b) => b.id === breedId);
  const breedPets = pets.filter((p) => p.breedId === breedId);

  const filteredBreedPets = breedPets.filter((pet) => matchesSearch(pet.name, searchTerm));

  const toggleLike = (event: React.MouseEvent<HTMLButtonElement>, petId: string) => {
    event.stopPropagation();
    setLikedPetIds((current) =>
      current.includes(petId)
        ? current.filter((id) => id !== petId)
        : [...current, petId]
    );
  };

  if (!breed) {
    return (
      <IonPage>
        <IonContent fullscreen className="breed-pets-content">
          <div className="breed-pets-not-found">
            <p>Breed not found.</p>
            <button onClick={() => navigate('/dashboard')}>Back to Home</button>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonContent fullscreen className="breed-pets-content">
        <div className="breed-pets">
          <header className="breed-pets-header">
            <button className="breed-pets-back" aria-label="Go back" onClick={() => navigate(-1)}>
              <IonIcon icon={chevronBackOutline} />
            </button>
            <h1>{breed.name}</h1>
          </header>

          <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="search pets..." />

          {breedPets.length === 0 ? (
            <p className="breed-pets-empty">No {breed.name} pets available yet.</p>
          ) : (
            <div className="breed-pets-grid">
              {filteredBreedPets.map((pet) => {
                const isLiked = likedPetIds.includes(pet.id);

                return (
                  <div
                    className="breed-pets-card"
                    key={pet.id}
                    onClick={() => navigate(`/dashboard/pet/${pet.id}`)}
                  >
                    <button
                      type="button"
                      className={`breed-pets-like ${isLiked ? 'is-liked' : ''}`}
                      aria-label={isLiked ? `Unlike ${pet.name}` : `Like ${pet.name}`}
                      onClick={(event) => toggleLike(event, pet.id)}
                    >
                      <IonIcon icon={isLiked ? heart : heartOutline} />
                    </button>
                    <img src={pet.image} alt={pet.name} />
                    <span>{pet.name}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default BreedPets;