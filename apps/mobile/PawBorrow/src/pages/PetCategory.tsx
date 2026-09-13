import { useNavigate, useParams } from 'react-router-dom' 
import { IonContent, IonPage, IonIcon } from '@ionic/react';
import { chevronBackOutline, searchOutline } from 'ionicons/icons';
import { useState } from 'react';
import SearchBar from '../components/SearchBar';
import { matchesSearch } from '../assets/images/utils/search';
import '../style/PetCategory.css';

import catPhoto from '../assets/images/pets/category-cats.jpg';
import dogPhoto from '../assets/images/pets/category-dogs.jpg';
import rabbitPhoto from '../assets/images/pets/category-rabbits.jpg';
import guineaPigPhoto from '../assets/images/pets/category-guinea-pigs.jpg';

const petTypes = [
  { id: 'cat', label: 'Cats', photo: catPhoto },
  { id: 'dog', label: 'Dogs', photo: dogPhoto },
  { id: 'rabbit', label: 'Rabbits', photo: rabbitPhoto },
  { id: 'guinea-pig', label: 'Guinea Pigs', photo: guineaPigPhoto }
]

const PetCategory: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPetTypes = petTypes.filter((cat) => matchesSearch(cat.label, searchTerm));

  return (
    <IonPage>
        <IonContent fullscreen className="category-content">
                <div className="category">
                  <header className="category-header">
                    <button className="category-back" aria-label="Go back" onClick={() => navigate('/shop')}>
                      <IonIcon icon={chevronBackOutline} />
                    </button>
                    <h1>Pets</h1>
                  </header>
        
                  <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Search pets..." />
        
                  <div className="category-section-header">
                    <h2>Our Pets</h2>
                  </div>
        
                  <div className="category-grid">
                    {filteredPetTypes.map((cat) => (
                      <div className="category-card" key={cat.id} onClick={() => navigate(`/breed-selection/${cat.id}`)}>
                        <img src={cat.photo} alt={cat.label} />
                        <span>{cat.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </IonContent>
    </IonPage>
  );
};

export default PetCategory;
