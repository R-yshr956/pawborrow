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

const stats = [
  { value: '2k+', label: 'Happy borrowers' },
  { value: '150+', label: 'Pets matched' },
  { value: '1.2k+', label: 'Successful stays' },
  { value: '3 yrs', label: 'In service' },
];

const AboutUs = () => {
  const navigate = useNavigate();

  return (
    <IonPage>
      <IonContent fullscreen className="about-us-content">
        <div className="about-us-scroll">
          <header className="about-us-header">
            <button className="about-us-back" aria-label="Go back" onClick={() => navigate(-1)}>
              <IonIcon icon={chevronBackOutline} />
            </button>
            <h1>About Us</h1>
          </header>

          <section className="about-us-panel about-us-hero-panel">
            <div className="about-us-badge">PawBorrow</div>
            <h2>Pet companionship without the long-term commitment.</h2>
            <p>
              We help families find loving, safe, and comfortable pet care experiences with a modern,
              stress-free process built around trust.
            </p>

            <div className="about-us-stats">
              {stats.map((stat) => (
                <div className="about-us-stat" key={stat.label}>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="about-us-panel about-us-story-panel">
            <div className="about-us-story-card">
              <p className="about-us-kicker">Our Story</p>
              <h3>Built by students who care deeply about animal wellbeing.</h3>
              <p>
                PawBorrow was created to make pet companionship more accessible. We combine thoughtful
                matching, joyful experiences, and thoughtful care so every pet feels at ease.
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
          </section>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AboutUs;
