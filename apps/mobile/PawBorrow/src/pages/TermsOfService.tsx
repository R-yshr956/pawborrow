import { useNavigate } from 'react-router-dom';
import { IonContent, IonPage, IonIcon } from '@ionic/react';
import { chevronBackOutline } from 'ionicons/icons';
import '../style/TermsOfService.css';

const termsSections = [
  {
    title: '1. Agreement to Terms',
    paragraphs: [
      'These Terms of Service constitute a legally binding agreement between you and PawBorrow (“PawBorrow,” “we,” “us,” or “our”) concerning your access to and use of the PawBorrow website, mobile application, and any other services, features, or platforms related to PawBorrow (collectively, the “Service”).',
      'By accessing or using PawBorrow, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree with these Terms, you must not access or use the Service.',
      'We may update or modify these Terms from time to time. Any changes will be effective when the updated Terms are posted on the Service. Your continued use of PawBorrow after changes are posted constitutes your acceptance of the revised Terms.',
      'You are responsible for reviewing these Terms periodically to remain informed about any updates.'
    ]
  },
  {
    title: '2. Eligibility',
    paragraphs: [
      'PawBorrow is intended for users who are at least 18 years old. By creating an account or using the Service, you represent and warrant that you are legally capable of entering into this agreement.',
      'If you are under 18 years of age, you may only use PawBorrow with the involvement and supervision of a parent or legal guardian who agrees to these Terms on your behalf.'
    ]
  },
  {
    title: '3. PawBorrow Services',
    paragraphs: [
      'PawBorrow is an online platform designed to connect pet owners with individuals who are interested in temporarily caring for, borrowing, or spending time with pets.',
      'PawBorrow provides the platform and related tools for users to communicate, create pet listings, discover available pets, and arrange pet-borrowing or pet-care arrangements.',
      'PawBorrow is not the owner of the pets listed by users and does not automatically act as the legal owner, guardian, veterinarian, or caretaker of any pet involved in a transaction.',
      'Users are responsible for determining whether an arrangement is suitable and safe for themselves and the pet involved.'
    ]
  },
  {
    title: '4. User Accounts',
    paragraphs: [
      'You may be required to create an account to access certain features of PawBorrow. You agree to provide accurate, current, and complete information during registration and to keep your account information updated.',
      'You are responsible for maintaining the confidentiality of your account credentials and for all activity conducted through your account.',
      'You must immediately notify PawBorrow if you believe that your account has been accessed without authorization or if your account credentials have been compromised.',
      'PawBorrow reserves the right to suspend or terminate accounts that contain false, misleading, incomplete, or fraudulent information.'
    ]
  },
  {
    title: '5. Pet Listings and Information',
    paragraphs: [
      'Users who list pets on PawBorrow are responsible for ensuring that all information provided about their pets is truthful, accurate, and up to date.',
      'Pet owners should provide relevant information about a pet’s breed, age, size, temperament, behavior, health considerations, dietary requirements, medications, and other information that may be necessary for safe and appropriate care.',
      'Users must not knowingly provide false or misleading information about a pet or conceal information that could reasonably affect the safety or well-being of the pet or another user.',
      'PawBorrow reserves the right to remove or restrict pet listings that violate these Terms, contain misleading information, or present a potential safety concern.'
    ]
  },
  {
    title: '6. Responsibilities of Pet Owners',
    paragraphs: [
      'Pet owners are responsible for ensuring that they have the legal right and authority to list their pets on PawBorrow and to enter into any borrowing or pet-care arrangement.',
      'Pet owners must provide borrowers with accurate instructions and relevant information necessary for the proper care of their pets.',
      'Pet owners are responsible for communicating any known behavioral, medical, dietary, or other conditions that may affect the pet during the borrowing period.'
    ]
  },
  {
    title: '7. Responsibilities of Pet Borrowers',
    paragraphs: [
      'Borrowers agree to treat all pets with reasonable care, attention, and respect while the pet is under their supervision.',
      'Borrowers must follow reasonable instructions provided by the pet owner regarding feeding, medication, exercise, handling, and other care requirements.',
      'Borrowers must not intentionally mistreat, neglect, abandon, sell, transfer, or otherwise misuse a pet entrusted to them.',
      'Borrowers are responsible for returning the pet to the owner at the agreed time and location unless the parties mutually agree otherwise.'
    ]
  },
  {
    title: '8. Prohibited Activities',
    paragraphs: [
      'You may not use PawBorrow for any purpose other than the lawful purposes for which the Service is provided.',
      'Users agree not to provide false information, create accounts using another person’s identity, impersonate another user, use PawBorrow for illegal activities, threaten or harass others, abuse or neglect any animal, obtain another user’s password, use bots or automated systems to scrape or collect information, circumvent security features, upload harmful software, distribute spam, reverse engineer the Service, or use information obtained through PawBorrow to harass, harm, or exploit another person.',
      'You also agree not to engage in conduct that violates applicable laws or regulations.'
    ]
  },
  {
    title: '9. User-Generated Content',
    paragraphs: [
      'PawBorrow may allow users to submit or post content, including pet photographs, descriptions, reviews, comments, messages, and other materials (“User Content”).',
      'You are solely responsible for the User Content you submit. You represent and warrant that you have the necessary rights and permissions to submit such content and that the content does not violate the rights of another person.',
      'User Content must not contain unlawful, fraudulent, abusive, threatening, defamatory, discriminatory, or otherwise inappropriate material.',
      'PawBorrow reserves the right to remove or restrict User Content that violates these Terms or that we reasonably believe is inappropriate or harmful to the Service or its users.'
    ]
  },
  {
    title: '10. Reviews and Ratings',
    paragraphs: [
      'PawBorrow may allow users to leave reviews or ratings regarding their experiences with other users or pet-borrowing arrangements.',
      'Reviews must be based on genuine experiences and must not contain false, misleading, threatening, abusive, discriminatory, or defamatory statements.',
      'Users must not manipulate ratings, create fake reviews, or organize campaigns intended to artificially increase or decrease another user’s rating.',
      'PawBorrow may remove reviews that violate these Terms or applicable policies.'
    ]
  },
  {
    title: '11. Payments and Transactions',
    paragraphs: [
      'If PawBorrow provides payment or transaction features, users agree to provide accurate payment information and complete transactions in accordance with the applicable payment terms.',
      'Users are responsible for reviewing the details of an arrangement before confirming a transaction, including applicable fees, dates, duration, and other conditions.',
      'PawBorrow may use third-party payment providers to process transactions. Payment processing may be subject to the terms and policies of those providers.'
    ]
  },
  {
    title: '12. Pet Safety and User Responsibility',
    paragraphs: [
      'Users acknowledge that interacting with or caring for animals involves inherent risks, including but not limited to scratches, bites, allergic reactions, property damage, illness, or other unexpected incidents.',
      'Users are responsible for exercising reasonable judgment and taking appropriate precautions when interacting with pets.',
      'PawBorrow does not guarantee that a pet will behave in a particular manner or that every interaction between users and pets will be free from risk.',
      'In the event of an emergency involving a pet, users should seek appropriate veterinary, emergency, or other professional assistance as necessary.'
    ]
  },
  {
    title: '13. Intellectual Property',
    paragraphs: [
      'Unless otherwise indicated, the PawBorrow Service, including its software, design, graphics, logos, text, functionality, and other content, is owned by or licensed to PawBorrow and is protected by applicable intellectual property laws.',
      'You may access and use the Service solely for its intended personal and lawful purposes. You may not copy, reproduce, modify, distribute, sell, or commercially exploit any part of the Service without prior written permission from PawBorrow.'
    ]
  },
  {
    title: '14. Third-Party Services and Websites',
    paragraphs: [
      'PawBorrow may contain links to or integrations with third-party websites, applications, payment providers, or other services.',
      'PawBorrow does not control and is not responsible for the content, availability, policies, or practices of third-party services.',
      'Your use of third-party services may be subject to separate terms and privacy policies provided by those third parties.'
    ]
  },
  {
    title: '15. Privacy',
    paragraphs: [
      'Your use of PawBorrow is also subject to our Privacy Policy, which explains how we collect, use, store, and protect personal information.',
      'By using PawBorrow, you acknowledge that you have reviewed and understood our Privacy Policy.'
    ]
  },
  {
    title: '16. Site Management',
    paragraphs: [
      'PawBorrow reserves the right to monitor the Service for violations of these Terms and to take appropriate action when necessary.',
      'We may remove content, restrict access, suspend accounts, or terminate accounts when we reasonably believe that a user has violated these Terms, applicable laws, or created a risk to other users, pets, or PawBorrow.'
    ]
  },
  {
    title: '17. Termination',
    paragraphs: [
      'These Terms remain effective while you use PawBorrow.',
      'PawBorrow may suspend or terminate your account or access to the Service at any time if you violate these Terms, engage in unlawful conduct, provide false information, or otherwise misuse the Service.',
      'You may stop using PawBorrow at any time and may request account deletion in accordance with our applicable account policies.'
    ]
  },
  {
    title: '18. Modifications and Interruptions',
    paragraphs: [
      'PawBorrow reserves the right to modify, suspend, or discontinue any portion of the Service at any time, with or without notice.',
      'We do not guarantee that the Service will always be available, uninterrupted, secure, or error-free. Maintenance, technical problems, updates, or circumstances beyond our reasonable control may result in temporary interruptions.'
    ]
  },
  {
    title: '19. Disclaimer',
    paragraphs: [
      'THE PAWBORROW SERVICE IS PROVIDED ON AN “AS IS” AND “AS AVAILABLE” BASIS. TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, PAWBORROW DISCLAIMS WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED.',
      'PawBorrow does not guarantee the accuracy, reliability, availability, or completeness of information provided by users or displayed through the Service.',
      'PawBorrow does not guarantee the behavior, health, safety, suitability, or condition of any pet listed by a user.',
      'Users are responsible for exercising appropriate judgment before entering into an arrangement with another user or interacting with a pet.'
    ]
  },
  {
    title: '20. Limitation of Liability',
    paragraphs: [
      'TO THE MAXIMUM EXTENT PERMITTED BY LAW, PAWBORROW AND ITS DIRECTORS, EMPLOYEES, PARTNERS, AND AGENTS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM OR RELATED TO YOUR USE OF THE SERVICE.',
      'PawBorrow shall not be liable for losses or damages resulting from user conduct, pet interactions, third-party services, service interruptions, or unforeseen circumstances outside our reasonable control.',
      'Some jurisdictions do not allow the limitation or exclusion of certain damages. In such cases, the limitations above may apply only to the extent permitted by law.'
    ]
  },
  {
    title: '21. Governing Law',
    paragraphs: [
      'These Terms are governed by the laws of the Republic of the Philippines, without regard to conflict of law principles.',
      'Any disputes arising under or in connection with these Terms shall be resolved in the appropriate courts located in the Philippines, unless otherwise required by applicable law.'
    ]
  },
  {
    title: '22. Contact Information',
    paragraphs: [
      'If you have questions about these Terms, our Service, or your account, you may contact PawBorrow through the support or contact details made available on the Service.',
      'We may update these Terms or provide notices through the Service or other reasonable means.'
    ]
  }
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
            <h1>PawBorrow Terms of Service</h1>
          </header>

          <div className="terms-actions">
            <button type="button" className="terms-secondary" onClick={() => navigate('/privacy-policy')}>
              Privacy Policy
            </button>
          </div>

          <div className="terms-list">
            {termsSections.map((section) => (
              <section className="terms-card" key={section.title}>
                <h2>{section.title}</h2>
                {section.paragraphs.map((paragraph, index) => (
                  <p key={`${section.title}-${index}`}>{paragraph}</p>
                ))}
              </section>
            ))}
          </div>

          <div className="terms-agreement">
            <label className="terms-check">
              <input type="checkbox" defaultChecked />
              <span>I have read and understood the PawBorrow Terms of Service.</span>
            </label>

            <label className="terms-check">
              <input type="checkbox" defaultChecked />
              <span>I agree to the responsibilities and care standards for pet borrowing and pet safety.</span>
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
