import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IonContent, IonIcon, IonPage } from "@ionic/react";
import {
  chevronForwardOutline,
  logOutOutline,
  settingsOutline,
} from "ionicons/icons";

import { useAuth } from "../context/AuthContext";
import "../style/Profile.css";

const characterAvatar = "/images/dashboard/avatar-sarah.png";

const finalFallbackAvatar = "/images/logo.png";

function formatAccountCreated(value: string | null | undefined) {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

const Profile: React.FC = () => {
  const navigate = useNavigate();

  const { logout, user } = useAuth();

  const googleAvatar = user?.avatarUrl?.trim() || null;

  const [profilePicture, setProfilePicture] = useState(
    googleAvatar || characterAvatar,
  );

  /*
   * The authenticated user may load after this component
   * first renders. Update the picture when the Gmail avatar
   * becomes available.
   */
  useEffect(() => {
    setProfilePicture(googleAvatar || characterAvatar);
  }, [googleAvatar]);

  /*
   * Do not create a display name from the email address.
   * Only use the user's registered display name or full name.
   */
  const profileName =
    user?.displayName?.trim() || user?.fullName?.trim() || "PawBorrow User";

  const fullName = user?.fullName?.trim() || "Not provided";

  const phoneNumber = user?.phoneNumber?.trim() || "Not provided";

  const accountCreated = formatAccountCreated(user?.accountCreated);

  const email = user?.email?.trim() || "Email not available";

  async function handleLogout() {
    try {
      await logout();

      navigate("/login", {
        replace: true,
      });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  function handleAvatarError() {
    if (profilePicture === finalFallbackAvatar) {
      return;
    }

    if (profilePicture === characterAvatar) {
      setProfilePicture(finalFallbackAvatar);
      return;
    }

    setProfilePicture(characterAvatar);
  }

  return (
    <IonPage>
      <IonContent fullscreen className="profile-content">
        <div className="profile-page">
          <div className="profile-header">
            <div className="profile-avatar-wrap">
              <img
                className="profile-avatar"
                src={profilePicture}
                alt={`${profileName} profile`}
                referrerPolicy="no-referrer"
                onError={handleAvatarError}
              />
            </div>

            <p className="profile-name">{profileName}</p>

            <p className="profile-email">{email}</p>
          </div>

          <div className="profile-fields">
            <div className="profile-field">
              <span className="profile-field-label">Display name</span>

              <span className="profile-field-value">{profileName}</span>
            </div>

            <div className="profile-field">
              <span className="profile-field-label">Full Name</span>

              <span className="profile-field-value">{fullName}</span>
            </div>

            <div className="profile-field">
              <span className="profile-field-label">Phone Number</span>

              <span className="profile-field-value">{phoneNumber}</span>
            </div>

            <div className="profile-field">
              <span className="profile-field-label">Account created</span>

              <span className="profile-field-value">{accountCreated}</span>
            </div>
          </div>

          <div className="profile-actions">
            <button
              type="button"
              className="profile-settings-btn"
              onClick={() => navigate("/app-settings")}
            >
              <span className="profile-settings-label">
                <IonIcon
                  icon={settingsOutline}
                  className="profile-settings-icon"
                />
                Settings
              </span>

              <IonIcon
                icon={chevronForwardOutline}
                className="profile-settings-arrow"
              />
            </button>

            <button
              type="button"
              className="profile-logout-btn"
              onClick={() => {
                void handleLogout();
              }}
            >
              <span className="profile-logout-label">
                <IonIcon icon={logOutOutline} className="profile-logout-icon" />
                Logout
              </span>
            </button>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Profile;
