import { Navigate, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import type { JSX } from 'react';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { ellipse, square, triangle } from 'ionicons/icons';
import Login from './pages/Login';
import Tab2 from './pages/Dashboard';
import Notifications from './pages/Notification';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';




/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';

/* SplashScreen imports and styles */
import bernerSennenhundPuppiesPosing1 from "./assets/images/pets/berner-sennenhund-puppies-posing-1.png";
import closeupShotOneGingerCatHuggingLickingOtherIsolatedWhiteWall1 from "./assets/images/pets/closeup-shot-one-ginger-cat-hugging-licking-other-isolated-white-wall-1.png";
import image12 from "./assets/images/pets/image-12.png";
import logo from "./assets/images/logo.png";
//import { StatusBarIphone } from "./StatusBarIphone";
import "./App.css";
import vector from "./assets/images/splash/vector.svg";
import Dashboard from './pages/Dashboard';
import Shop from './pages/Shop';
import Training from './pages/Training';
import History from './pages/History';
import Profile from './pages/Profile';
import BreedSelection from './pages/BreedSelection';
import PetCategory from './pages/PetCategory';
import BreedPets from './pages/BreedPets';
import BottomNav from './components/BottomNav';
import PetDetails from './pages/PetDetails';
import AboutUs from './pages/AboutUs';
import LikedPets from './pages/LikedPets';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BookingsProvider } from './context/BookingsContext';
import MyBookings from './pages/MyBookings';
import PaymentMethods from './pages/PaymentMethods';
import NotificationSettings from './pages/NotificationSettings';
import AppSettings from './pages/AppSettings';
import BookingConfirmation from './pages/BookingConfirmation';
import BookingReview from './pages/BookingReview';
import TermsOfService from './pages/TermsOfService';

setupIonicReact();


const App: React.FC = () => (
  <AuthProvider>
    <BookingsProvider>
      <AppContent />
    </BookingsProvider>
  </AuthProvider>
);

const AppContent: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { isLoggedIn, login } = useAuth();

  useEffect(() => {
    const loadingTimer = setTimeout(() => 
      setIsLoading(false)
    , 3000);
    return () => clearTimeout(loadingTimer);
  }, []);

  if (isLoading) {
    return (
      <IonApp>
        <SplashScreen />
      </IonApp>
    );
  }

  if (!isLoggedIn) {
    return (
      <IonApp>
        <IonReactRouter>
          <IonRouterOutlet>
            <Route path="/login" element={<Login onLoginSuccess={login} />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </IonRouterOutlet>
        </IonReactRouter>
      </IonApp>
    );
  }

  return (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/notification" element={<Notifications />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/training" element={<Training />} />
        <Route path="/history" element={<History />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/liked-pets" element={<LikedPets />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/pet-category" element={<PetCategory />} />
        <Route path="/shop/pet-category/" element={<PetCategory />} />
        <Route path="/pet-category/:categoryId" element={<PetCategory />} />
        <Route path="/breed-selection/:animalId" element={<BreedSelection />} />
        <Route path="/dashboard/breed/:animalId/:breedId" element={<BreedPets />} />
        <Route path="/dashboard/pet/:petId" element={<PetDetails />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/payment-methods" element={<PaymentMethods />} />
        <Route path="/notification-settings" element={<NotificationSettings />} />
        <Route path="/app-settings" element={<AppSettings />} />
        <Route path="/booking-confirmation" element={<BookingConfirmation />} />
        <Route path="/booking-review" element={<BookingReview />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </IonRouterOutlet>
      <BottomNav />
    </IonReactRouter>
  </IonApp>
);
};


export const SplashScreen = (): JSX.Element => {
  return (
    <div className="splash-screen-frame">
    <div className="splash-screen">
      <div className="splash-logo-wrap">
        <img className="img-photoroom" alt="PawBorrow logo" src={logo} />
      </div>

      <div className="splash-arch" aria-hidden="true" />

      <div className="splash-pet-row">
        <div className="pet-card">
          <img className="pet-photo" src={bernerSennenhundPuppiesPosing1} alt="Cute dog" />
        </div>
        <div className="pet-card pet-card--middle">
          <img className="pet-photo" src={image12} alt="Dog sitting" />
        </div>
        <div className="pet-card">
          <img className="pet-photo" src={closeupShotOneGingerCatHuggingLickingOtherIsolatedWhiteWall1} alt="Cat and dog" />
        </div>
      </div>
      <img className="splash-vector" src={vector} alt="" aria-hidden="true" />
      <div className="pet-stand" aria-hidden="true">
        <div className="pet-stand-inner" aria-hidden="true" />
      </div>
      
      <div className="splash-bottom-bar" />
    </div>
    </div>
  );
};

export default App;
