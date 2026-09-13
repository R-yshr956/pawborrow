import { useNavigate } from 'react-router-dom';
import { IonContent, IonPage, IonIcon } from '@ionic/react';
import { chevronBackOutline } from 'ionicons/icons';
import '../style/TermsOfService.css';

const termsSections = [
  {
    title: 'Before You Borrow a Pet',
    text:
      'Please read and agree to these rules to ensure the safety and welfare of every PawBorrow companion.',
  },
  {
    title: 'Provide Proper Care',
    text:
      'The pet must be cared for responsibly, with a clean environment, sufficient food, and regular attention. Rules may vary by pet type and booking conditions.',
  },
  {
    title: 'No Abuse or Neglect',
    text:
      'Any form of cruelty, physical harm, or intentional neglect is strictly prohibited.',
  },
  {
    title: 'Return on time',
    text:
      'Pets must be returned on or before the agreed booking schedule.',
  },
  {
    title: 'Report injuries immediately',
    text:
      'Contact PawBorrow immediately if the pet becomes sick, injured, or behaves unusually.',
  },
  {
    title: 'Legal Responsibility',
    text:
      'Under the Philippine Animal Welfare Act (RA 8485), as amended by Republic Act 10631, animal welfare is a shared responsibility. Pet owners and borrowers must act with care and respect for animal wellbeing.',
  },
];

const TermsOfService = () => {
  const navigate = useNavigate();

  return (
    <IonPage>
      <IonContent fullscreen className="terms-content">
        <div className="terms-page">
          <header className="terms-header">
            <button className="terms-back" aria-label="Go back" onClick={() => navigate(-1)}>
              <IonIcon icon={chevronBackOutline} />
            </button>
            <h1>Terms of Service</h1>
          </header>

          <div className="terms-list">
            {termsSections.map((section) => (
              <section className="terms-card" key={section.title}>
                <h2>{section.title}</h2>
                <p>{section.text}</p>
              </section>
            ))}
          </div>

          <div className="terms-agreement">
            <label className="terms-check">
              <input type="checkbox" defaultChecked />
              <span>I have read and understood the PawBorrow Rules &amp; Regulations.</span>
            </label>

            <label className="terms-check">
              <input type="checkbox" defaultChecked />
              <span>I agree to care for the pet during the booking period and accept full responsibility.</span>
            </label>
          </div>

          <button type="button" className="terms-continue" onClick={() => navigate('/login')}>
            Continue
          </button>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default TermsOfService;
