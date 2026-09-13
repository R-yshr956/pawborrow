import { useNavigate } from 'react-router-dom';
import { IonContent, IonPage, IonIcon } from '@ionic/react';
import { useState } from 'react';
import SearchBar from '../components/SearchBar';
import { matchesSearch } from '../assets/images/utils/search';
import { cartOutline, searchOutline, home, pawOutline, cartOutline as shopIcon, timeOutline, personOutline } from 'ionicons/icons';
import petsPhoto from '../assets/images/shop/pets.png';
import foodsPhoto from '../assets/images/shop/foods.png';
import healthyPhoto from '../assets/images/shop/healthy.png';
import toysPhoto from '../assets/images/shop/toys.png';
import accessoriesPhoto from '../assets/images/shop/accessories.png';
import clothesPhoto from '../assets/images/shop/clothes.png';
import '../style/Shop.css';

const shopCategories = [
  { id: 'pets', label: 'Pets', photo: petsPhoto },
  { id: 'foods', label: 'Foods', photo: foodsPhoto },
  { id: 'healthy', label: 'Healthy', photo: healthyPhoto },
  { id: 'toys', label: 'Toys', photo: toysPhoto },
  { id: 'accessories', label: 'Accessories', photo: accessoriesPhoto },
  { id: 'clothes', label: 'Clothes', photo: clothesPhoto },
];

const Shop = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <IonPage>
      <IonContent fullscreen className="shop-content">
        <div className="shop-header">
          <div>
            <p className="shop-greeting">Hello Sarah</p>
            <p className="shop-title">Find your lovable Pets</p>
          </div>
          <button className="shop-cart-btn" aria-label="Cart">
            <IonIcon icon={cartOutline} />
          </button>
        </div>

        <div className="shop">
          <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Search for products..." />

          <div className="shop-grid">
            {shopCategories.map((cat) => (
              <div
                className={`shop-card ${selectedCategory === cat.id ? 'shop-card--active' : ''}`}
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  navigate(`/pet-category/${cat.id}`);
                }}
              >
                <span className="shop-card-label">{cat.label}</span>
                <img src={cat.photo} alt={cat.label} />
              </div>
            ))}
          </div>
        </div>

      </IonContent>
    </IonPage>
  );
};

export default Shop;
