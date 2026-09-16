import { useNavigate } from 'react-router-dom';
import { IonContent, IonPage, IonIcon } from '@ionic/react';
import { chevronBackOutline } from 'ionicons/icons';
import '../style/TermsOfService.css';

const privacySections = [
  {
    title: 'PRIVACY NOTICE',
    paragraphs: [
      'This Privacy Notice for PawBorrow (“PawBorrow,” “we,” “us,” or “our”) describes how and why we may collect, store, use, and share your personal information when you use our website and services (“Services”).',
      'PawBorrow is a platform designed to connect pet owners with individuals who are interested in temporarily borrowing or spending time with pets. We collect and process information necessary to provide these services, maintain user accounts, facilitate communication, improve our platform, and help maintain the safety and security of our users and pets.',
      'By accessing or using PawBorrow, you acknowledge that you have read and understood this Privacy Policy. If you do not agree with the practices described in this Privacy Policy, please discontinue use of the Services.'
    ]
  },
  {
    title: 'SUMMARY OF KEY POINTS',
    paragraphs: [
      'What personal information do we collect? Depending on how you use PawBorrow, we may collect information such as your name, email address, contact information, account information, profile information, pet information, messages, transaction information, and technical information about your device and use of the website.',
      'Do we collect sensitive personal information? PawBorrow does not intentionally collect sensitive personal information unless it is necessary for the operation of the Services and permitted by applicable law.',
      'How do we use your information? We use information to create and manage accounts, facilitate pet listings and borrowing requests, enable communication between users, process transactions where applicable, improve our Services, maintain security, prevent fraud, and comply with applicable laws.',
      'Do we share your information? We may share information with service providers that help us operate PawBorrow, when necessary to provide our Services, comply with legal obligations, protect users, or with your consent.',
      'How do we protect your information? We use reasonable technical and organizational measures to protect personal information. However, no internet-based system can be guaranteed to be completely secure.',
      'What are your privacy rights? Depending on applicable law, you may have rights to access, correct, update, or request deletion of your personal information.'
    ]
  },
  {
    title: '1. WHAT INFORMATION DO WE COLLECT?',
    paragraphs: [
      'We collect personal information that you voluntarily provide when using PawBorrow. This may include your full name, email address, phone number, account details, profile photo, location information, pet information, pet photographs, borrowing and listing information, messages, and reviews or ratings.',
      'When you list a pet on PawBorrow, we may collect information about the pet, including its name, type, breed, age, size, personality, preferences, care requirements, photographs, and other information that you choose to provide.',
      'If PawBorrow provides payment or transaction functionality, we may collect information necessary to process transactions. Payment information may be processed by third-party payment service providers. PawBorrow does not necessarily store complete payment card information on its own servers.',
      'When you access or use PawBorrow, certain technical information may also be collected automatically, including your IP address, browser type, device type, pages visited, date and time of activity, referring URLs, and general usage data.'
    ]
  },
  {
    title: '2. HOW DO WE USE YOUR INFORMATION?',
    paragraphs: [
      'We use the information we collect to create and manage user accounts, enable communication between pet owners and borrowers, facilitate the listing and discovery of pets, process transactions, improve the Services, maintain security and prevent fraud, and comply with legal obligations.',
      'We may also use information to respond to support requests, investigate complaints or disputes, improve platform performance, and personalize your experience on the Service.',
      'In some cases, we may need to use or disclose information to protect the rights, safety, and property of PawBorrow, our users, or others.'
    ]
  },
  {
    title: '3. WHAT LEGAL BASES DO WE RELY ON TO PROCESS YOUR INFORMATION?',
    paragraphs: [
      'We rely on several legal bases to process personal information, including the need to provide the Services requested by you, compliance with legal requirements, legitimate business interests, and your consent where required.',
      'In certain circumstances, we may process your personal information because it is necessary for the performance of a contract or to take steps at your request before entering into a contract.'
    ]
  },
  {
    title: '4. WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?',
    paragraphs: [
      'We may share your personal information with trusted service providers that help us operate PawBorrow or support the Services, such as hosting providers, analytics tools, customer support systems, payment processors, or technical infrastructure providers.',
      'We may also disclose personal information when required by law, to protect against fraud, to enforce our Terms, or to protect the rights, safety, or property of PawBorrow, our users, or others.',
      'We do not sell your personal information for monetary consideration.'
    ]
  },
  {
    title: '5. THIRD-PARTY WEBSITES',
    paragraphs: [
      'PawBorrow may contain links to or integrations with third-party websites, applications, payment providers, or other services.',
      'PawBorrow does not control and is not responsible for the content, availability, policies, or practices of third-party services.',
      'Your use of third-party services may be subject to separate terms and privacy policies provided by those third parties.'
    ]
  },
  {
    title: '6. COOKIES AND TRACKING TECHNOLOGIES',
    paragraphs: [
      'PawBorrow may use cookies, web beacons, or similar tracking technologies to improve functionality, analyze usage, remember user preferences, and enhance the overall experience.',
      'Depending on your device and settings, you may be able to control or disable certain cookies through your browser settings. However, disabling cookies may affect the functionality of the Service.'
    ]
  },
  {
    title: '7. SOCIAL LOGINS AND ACCOUNT CONNECTIONS',
    paragraphs: [
      'If you choose to sign in through social or third-party login options, we may receive information from those providers as permitted by your settings and their policies, including basic profile information needed to create or access your account.'
    ]
  },
  {
    title: '8. INFORMATION TRANSFER',
    paragraphs: [
      'Your information may be stored and processed in the Philippines or other locations where our service providers operate. We take reasonable steps to ensure such transfers are protected in accordance with applicable data protection laws.'
    ]
  },
  {
    title: '9. HOW LONG DO WE KEEP YOUR INFORMATION?',
    paragraphs: [
      'We keep personal information only for as long as necessary to provide the Services, comply with legal obligations, resolve disputes, and enforce our agreements. When information is no longer needed, we will securely delete or anonymize it as appropriate.'
    ]
  },
  {
    title: '10. HOW DO WE KEEP YOUR INFORMATION SAFE?',
    paragraphs: [
      'We use reasonable technical and organizational measures to protect personal information against unauthorized access, disclosure, alteration, or destruction. However, no method of transmission or storage over the internet is completely secure.'
    ]
  },
  {
    title: '11. INFORMATION FROM MINORS',
    paragraphs: [
      'PawBorrow is not intended for children or users under the age of 18 without appropriate parental or guardian involvement. We do not knowingly collect personal information from minors without lawful parental consent.'
    ]
  },
  {
    title: '12. YOUR PRIVACY RIGHTS',
    paragraphs: [
      'Depending on applicable law, you may have rights to access, correct, update, or delete the personal information we hold about you, withdraw consent, or restrict certain processing.',
      'To exercise these rights, please contact us through the support or contact information made available on the Service.'
    ]
  },
  {
    title: '13. UPDATES TO THIS NOTICE',
    paragraphs: [
      'We may update this Privacy Policy from time to time to reflect changes in our practices, legal obligations, or the Services we provide. Material changes will be communicated through the Service or other reasonable means.',
      'We encourage users to review this Privacy Policy periodically and remain informed about how we protect personal information.'
    ]
  }
];

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <IonPage>
      <IonContent fullscreen className="terms-content">
        <div className="privacy-page">
          <header className="privacy-header">
            <button className="privacy-back" aria-label="Go back" onClick={() => navigate(-1)}>
              <IonIcon icon={chevronBackOutline} />
            </button>
            <h1>PawBorrow Privacy Policy</h1>
          </header>

          <div className="privacy-actions">
            <button type="button" className="privacy-secondary" onClick={() => navigate('/terms-of-service')}>
              Terms of Service
            </button>
          </div>

          <div className="privacy-list">
            {privacySections.map((section) => (
              <section className="privacy-card" key={section.title}>
                <h2>{section.title}</h2>
                {section.paragraphs.map((paragraph, index) => (
                  <p key={`${section.title}-${index}`}>{paragraph}</p>
                ))}
              </section>
            ))}
          </div>

          <div className="privacy-agreement">
            <label className="privacy-check">
              <input type="checkbox" defaultChecked />
              <span>I have read and understood the PawBorrow Privacy Policy.</span>
            </label>
          </div>

          <button type="button" className="privacy-continue" onClick={() => navigate('/login')}>
            Continue
          </button>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default PrivacyPolicy;
