import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { IonContent, IonPage, IonIcon } from '@ionic/react';
import { useMemo, useState } from 'react';
import SearchBar from '../components/SearchBar';
import { cartOutline } from 'ionicons/icons';
import petsPhoto from '../assets/images/shop/pets.png';
import foodsPhoto from '../assets/images/shop/foods.png';
import healthyPhoto from '../assets/images/shop/healthy.png';
import toysPhoto from '../assets/images/shop/toys.png';
import accessoriesPhoto from '../assets/images/shop/accessories.png';
import clothesPhoto from '../assets/images/shop/clothes.png';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import '../style/Shop.css';

const shopCategories = [
  { id: 'pets', label: 'Pets', photo: petsPhoto },
  { id: 'foods', label: 'Foods', photo: foodsPhoto },
  { id: 'healthy', label: 'Healthy', photo: healthyPhoto },
  { id: 'toys', label: 'Toys', photo: toysPhoto },
  { id: 'accessories', label: 'Accessories', photo: accessoriesPhoto },
  { id: 'clothes', label: 'Clothes', photo: clothesPhoto },
];

const categoryMap: Record<string, string> = {
  pets: 'Pet Food',
  foods: 'Pet Food',
  healthy: 'Pet Bed',
  toys: 'Pet Toy',
  accessories: 'Accessories',
  clothes: 'Grooming',
};

const Shop = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const searchParams = new URLSearchParams(location.search);
  const routeCategory = params.categoryId ?? searchParams.get('category') ?? 'foods';
  const selectedCategory =
    location.pathname === '/pet-category' || location.pathname.startsWith('/pet-category/')
      ? 'pets'
      : routeCategory === 'pets'
        ? 'pets'
        : routeCategory;
  const [searchTerm, setSearchTerm] = useState('');
  const { itemCount } = useCart();

  const filteredCategories = shopCategories.filter((cat) =>
    cat.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const productList = useMemo(() => {
    return products.filter((product) => product.category === categoryMap[selectedCategory]);
  }, [selectedCategory]);

  const handleCategorySelect = (categoryId: string) => {
    if (categoryId === 'pets') {
      navigate('/pet-category');
      return;
    }

    navigate(`/shop/${categoryId}`);
  };

  return (
    <IonPage>
      <IonContent fullscreen className="shop-content">
        <div className="shop-header">
          <div>
            <p className="shop-greeting">Hello Sarah</p>
            <p className="shop-title">Find your lovable Pets</p>
          </div>
          <button className="shop-cart-btn" aria-label="Cart" onClick={() => navigate('/cart')}>
            <IonIcon icon={cartOutline} />
            {itemCount > 0 && <span className="shop-cart-badge">{itemCount}</span>}
          </button>
        </div>

        <div className="shop">
          <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Search for products..." />

          <div className="shop-grid">
            {filteredCategories.map((cat) => (
              <div
                className={`shop-card ${selectedCategory === cat.id ? 'shop-card--active' : ''}`}
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
              >
                <span className="shop-card-label">{cat.label}</span>
                <img src={cat.photo} alt={cat.label} />
              </div>
            ))}
          </div>

          {selectedCategory && selectedCategory !== 'pets' && (
            <div className="shop-products">
              <div className="shop-products-header">
                <h3>{shopCategories.find((cat) => cat.id === selectedCategory)?.label}</h3>
                <span>{productList.length} items</span>
              </div>

              <div className="shop-product-list">
                {productList.map((product) => (
                  <div className="shop-product-card" key={product.id}>
                    <img src={product.image} alt={product.name} />
                    <div className="shop-product-info">
                      <p className="shop-product-name">{product.name}</p>
                      <p className="shop-product-price">₱{product.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Shop;
