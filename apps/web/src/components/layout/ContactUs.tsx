import { useState } from 'react';
import '@/styles/Contact.css';
import { Pin, Mail, Phone, Clock } from 'lucide-react';

export default function ContactUs() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // No backend hooked up yet — just confirms the form works.
    // Once you have somewhere to send this (an API, email service, etc.),
    // replace this with the real submit logic.
    setSubmitted(true);
  }

  return (
    <section id="contact-page" className="section contact">
      <div className="contact__hero">
        <div className="contact__hero-text">
          <p className="eyebrow">PawBorrow &middot; Get in Touch</p>
          <h1>
            Questions about borrowing a pet? <span>We're here to help.</span>
          </h1>
          <p className="contact__hero-sub">
            Whether you're booking your first companion or checking on an
            existing reservation, our team in Quezon City is ready to help 
            send us a message or drop by during business hours.
          </p>
          <a href="#contact-form" className="rounded-full bg-froly-400 py-3.5 px-6.5 font-medium text-white">Send a Message</a>
        </div>
        <div className="contact__hero-art">
          <div className="hero__blob" aria-hidden="true" />
          <img
            className="contact__hero-img"
            src="/images/contact-hero.png"
            alt="Guinea pig available for companionship"
          />
        </div>
      </div>

      <div className="contact__body" id="contact-form">
        <form className="contact__form" onSubmit={handleSubmit}>
          <div className="contact__form-row">
            <div className="contact__field">
              <label htmlFor="firstName">First Name</label>
              <input id="firstName" name="firstName" type="text" placeholder="First name" required />
            </div>
            <div className="contact__field">
              <label htmlFor="lastName">Last Name</label>
              <input id="lastName" name="lastName" type="text" placeholder="Last name" required />
            </div>
          </div>
          <div className="contact__field">
            <label htmlFor="email">Email Address</label>
            <input id="email" name="email" type="email" placeholder="E-mail address" required />
          </div>
          <div className="contact__field">
            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" rows={5} placeholder="Your message..." required />
          </div>
          <button type="submit" className="rounded-full bg-froly-400 py-3.5 px-25 font-medium text-white items-center">Send Message</button>
          {submitted && (
            <p className="contact__success">
              Thanks! This form isn't connected to anything yet, but your
              message was captured correctly.
            </p>
          )}
        </form>

        <div className="contact__info">
          <h2>Feel free to contact us</h2>
          <p>
            Have a question before you book, or need help with a current
            reservation? Reach out any way that's convenient — we typically
            reply within one business day.
          </p>
          <ul className="contact__info-list">
            <li>
              <span className="contact__icon" aria-hidden="true"><Pin size={24} className="text-white"/></span>
              <span>Quezon City, Metro Manila</span>
            </li>
            <li>
              <span className="contact__icon" aria-hidden="true"><Mail size={24} className="text-white"/></span>
              <span>hello@pawborrow.ph</span>
            </li>
            <li>
              <span className="contact__icon" aria-hidden="true"><Phone size={24} className="text-white"/></span>
              <span>+63 900 000 0000</span>
            </li>
            <li>
              <span className="contact__icon" aria-hidden="true"><Clock size={24} className="text-white"/></span>
              <span>Mon – Fri: 10AM – 6PM</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="contact__map">
        <iframe
          title="PawBorrow location"
          src="https://maps.google.com/maps?q=Quezon%20City%2C%20Metro%20Manila&t=&z=13&ie=UTF8&iwloc=&output=embed"
          loading="lazy"
        />
      </div>
    </section>
  );
}