import { useNavigate } from 'react-router-dom';
import { IonContent, IonPage, IonIcon } from '@ionic/react';
import { chevronBackOutline, heartOutline, pawOutline, sparklesOutline } from 'ionicons/icons';
import '../style/AboutUs.css';

const values = [
  {
    icon: pawOutline,
    title: 'Pet-first support',
    description: 'We focus on helping every pet feel safe, happy, and cared for during every stay.',
  },
  {
    icon: heartOutline,
    title: 'Trusted care',
    description: 'Each pet profile is built around comfort, routine, and a gentle experience for families.',
  },
  {
    icon: sparklesOutline,
    title: 'Simple experience',
    description: 'From browsing to booking, we keep the experience quick, clear, and stress-free.',
  },
];

const AboutUs = () => {
  const navigate = useNavigate();

  return (
    <IonPage>
      <IonContent fullscreen className="about-us-content">
        <div className="about-us">
          <header className="about-us-header">
            <button className="about-us-back" aria-label="Go back" onClick={() => navigate(-1)}>
              <IonIcon icon={chevronBackOutline} />
            </button>
            <h1>About Us</h1>
          </header>

          <div className="about-us-hero">
            <p className="about-us-kicker">PawBorrow</p>
            <h2>Making pet care feel personal.</h2>
            <p>
              We started PawBorrow to create a kinder, easier way for pet families to find comfort,
              safety, and trusted care for their companions.
            </p>
          </div>

          <div className="about-us-values">
            {values.map((item) => (
              <div className="about-us-card" key={item.title}>
                <div className="about-us-icon">
                  <IonIcon icon={item.icon} />
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AboutUs;
