import { useEffect, useState } from "react";
import { Navigate, Route } from "react-router-dom";
import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";

import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import Notification from "./pages/Notification";
import History from "./pages/History";
import Profile from "./pages/Profile";
import BreedSelection from "./pages/BreedSelection";
import PetCategory from "./pages/PetCategory";
import BreedPets from "./pages/BreedPets";
import PetDetails from "./pages/PetDetails";
import AboutUs from "./pages/AboutUs";
import LikedPets from "./pages/LikedPets";
import MyBookings from "./pages/MyBookings";
import PaymentMethods from "./pages/PaymentMethods";
import NotificationSettings from "./pages/NotificationSettings";
import AppSettings from "./pages/AppSettings";
import BookingConfirmation from "./pages/BookingConfirmation";
import BookingReview from "./pages/BookingReview";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Review from "./pages/Review";

import BottomNav from "./components/BottomNav";
import { AuthProvider, useAuth } from "./context/AuthContext";

import "@ionic/react/css/typography.css";
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

import "./App.css";
import "./global.css";

setupIonicReact();

const splashDogPhoto = "/images/pets/berner-sennenhund-puppies-posing-1.png";

const splashCatDogPhoto =
  "/images/pets/closeup-shot-one-ginger-cat-hugging-licking-other-isolated-white-wall-1.png";

const splashMiddlePhoto = "/images/pets/image-12.png";

const logo = "/images/logo.png";
const vector = "/images/splash/vector.svg";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

const AppContent: React.FC = () => {
  const [splashLoading, setSplashLoading] = useState(true);

  const { isLoggedIn, loading: authLoading } = useAuth();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSplashLoading(false);
    }, 1500);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  /*
   * Show the splash screen only while the application and initial
   * Supabase session are being restored.
   */
  if (splashLoading || authLoading) {
    return (
      <IonApp>
        <SplashScreen />
      </IonApp>
    );
  }

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route
            path="/login"
            element={
              isLoggedIn ? <Navigate to="/dashboard" replace /> : <Login />
            }
          />

          <Route
            path="/signup"
            element={
              isLoggedIn ? <Navigate to="/dashboard" replace /> : <SignUp />
            }
          />

          <Route
            path="/dashboard"
            element={
              isLoggedIn ? <Dashboard /> : <Navigate to="/login" replace />
            }
          />

          <Route
            path="/notification"
            element={
              isLoggedIn ? <Notification /> : <Navigate to="/login" replace />
            }
          />

          <Route
            path="/history"
            element={
              isLoggedIn ? <History /> : <Navigate to="/login" replace />
            }
          />

          <Route
            path="/profile"
            element={
              isLoggedIn ? <Profile /> : <Navigate to="/login" replace />
            }
          />

          <Route
            path="/liked-pets"
            element={
              isLoggedIn ? <LikedPets /> : <Navigate to="/login" replace />
            }
          />

          <Route
            path="/about-us"
            element={
              isLoggedIn ? <AboutUs /> : <Navigate to="/login" replace />
            }
          />

          <Route
            path="/pet-category"
            element={
              isLoggedIn ? <PetCategory /> : <Navigate to="/login" replace />
            }
          />

          <Route
            path="/breed-selection/:animalId"
            element={
              isLoggedIn ? <BreedSelection /> : <Navigate to="/login" replace />
            }
          />

          <Route
            path="/breed-pets/:animalId/:breedId"
            element={
              isLoggedIn ? <BreedPets /> : <Navigate to="/login" replace />
            }
          />

          <Route
            path="/dashboard/breed/:animalId/:breedId"
            element={
              isLoggedIn ? <BreedPets /> : <Navigate to="/login" replace />
            }
          />

          <Route
            path="/dashboard/pet/:petId"
            element={
              isLoggedIn ? <PetDetails /> : <Navigate to="/login" replace />
            }
          />

          <Route
            path="/pet/:petId"
            element={
              isLoggedIn ? <PetDetails /> : <Navigate to="/login" replace />
            }
          />

          <Route
            path="/my-bookings"
            element={
              isLoggedIn ? <MyBookings /> : <Navigate to="/login" replace />
            }
          />

          <Route
            path="/review/:bookingId"
            element={isLoggedIn ? <Review /> : <Navigate to="/login" replace />}
          />

          <Route
            path="/payment-methods"
            element={
              isLoggedIn ? <PaymentMethods /> : <Navigate to="/login" replace />
            }
          />

          <Route
            path="/notification-settings"
            element={
              isLoggedIn ? (
                <NotificationSettings />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="/app-settings"
            element={
              isLoggedIn ? <AppSettings /> : <Navigate to="/login" replace />
            }
          />

          <Route
            path="/booking-review"
            element={
              isLoggedIn ? <BookingReview /> : <Navigate to="/login" replace />
            }
          />

          <Route
            path="/booking-confirmation"
            element={
              isLoggedIn ? (
                <BookingConfirmation />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route path="/terms-of-service" element={<TermsOfService />} />

          <Route path="/privacy-policy" element={<PrivacyPolicy />} />

          <Route
            path="/"
            element={
              <Navigate to={isLoggedIn ? "/dashboard" : "/login"} replace />
            }
          />

          <Route
            path="*"
            element={
              <Navigate to={isLoggedIn ? "/dashboard" : "/login"} replace />
            }
          />
        </IonRouterOutlet>

        {isLoggedIn && <BottomNav />}
      </IonReactRouter>
    </IonApp>
  );
};

export const SplashScreen: React.FC = () => {
  function useFallbackImage(event: React.SyntheticEvent<HTMLImageElement>) {
    event.currentTarget.onerror = null;
    event.currentTarget.src = logo;
  }

  return (
    <div className="splash-screen-frame">
      <div className="splash-screen">
        <div className="splash-logo-wrap">
          <img className="img-photoroom" src={logo} alt="PawBorrow logo" />
        </div>

        <div className="splash-arch" aria-hidden="true" />

        <div className="splash-pet-row">
          <div className="pet-card">
            <img
              className="pet-photo"
              src={splashDogPhoto}
              alt="Cute dog"
              onError={useFallbackImage}
            />
          </div>

          <div className="pet-card pet-card--middle">
            <img
              className="pet-photo"
              src={splashMiddlePhoto}
              alt="Dog sitting"
              onError={useFallbackImage}
            />
          </div>

          <div className="pet-card">
            <img
              className="pet-photo"
              src={splashCatDogPhoto}
              alt="Cat and dog"
              onError={useFallbackImage}
            />
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
