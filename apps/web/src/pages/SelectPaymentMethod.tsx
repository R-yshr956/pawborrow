import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MapPin, Mail, Phone, Clock } from "lucide-react";
import Navbar from "@/components/ui/Navbar";
import "@/styles/BookingRequest.css";

interface LocationState {
  pet?: unknown;
  days?: number;
  total?: number;
  contact?: {
    firstName: string;
    lastName: string;
    email: string;
    message: string;
  };
}

const PAYMENT_METHODS = ["GCash"];

export default function SelectPaymentMethod() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = (location.state as LocationState) || {};

  const [selectedMethod, setSelectedMethod] = useState(PAYMENT_METHODS[0]);
  const [form, setForm] = useState({
    firstName: state.contact?.firstName ?? "",
    lastName: state.contact?.lastName ?? "",
    email: state.contact?.email ?? "",
    message: state.contact?.message ?? "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleConfirm() {
    console.log({ method: selectedMethod, ...form, ...state });
    navigate("/bookings");
  }

  return (
    <>
      <Navbar />
      <div className="booking-page">
        <div className="booking-card">
          <div className="booking-left">
            <h1>Select a payment method</h1>
            <p className="booking-subtext">
              Upon selecting the pet you want to book you will be providing details
              needed and
            </p>

            <div className="payment-info-list">
              <div className="payment-info-row">
                <span className="payment-info-icon">
                  <MapPin size={18} />
                </span>
                <span>8592 Fairground St. Tallahassee, FL 32303</span>
              </div>
              <div className="payment-info-row">
                <span className="payment-info-icon">
                  <Mail size={18} />
                </span>
                <span>pawborrow@outlook.com</span>
              </div>
              <div className="payment-info-row">
                <span className="payment-info-icon">
                  <Phone size={18} />
                </span>
                <span>+775 378-6348</span>
              </div>
              <div className="payment-info-row">
                <span className="payment-info-icon">
                  <Clock size={18} />
                </span>
                <span>Mon - Fri: 10AM - 10PM</span>
              </div>
            </div>

            <div className="payment-method-list">
              {PAYMENT_METHODS.map((method) => (
                <div
                  key={method}
                  className={`payment-method-row ${
                    selectedMethod === method ? "active" : ""
                  }`}
                  onClick={() => setSelectedMethod(method)}
                >
                  {method}
                </div>
              ))}
            </div>
          </div>

          <div className="booking-right">
            <div className="booking-form-row">
              <div className="booking-field">
                <label>First Name</label>
                <input
                  name="firstName"
                  placeholder="First name"
                  value={form.firstName}
                  onChange={handleChange}
                />
              </div>
              <div className="booking-field">
                <label>Last Name</label>
                <input
                  name="lastName"
                  placeholder="Last name"
                  value={form.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="booking-field">
              <label>Email Address</label>
              <input
                name="email"
                type="email"
                placeholder="E-mail address"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div className="booking-field">
              <label>Message</label>
              <textarea
                name="message"
                placeholder="Your message..."
                value={form.message}
                onChange={handleChange}
              />
            </div>

            <button className="booking-confirm-btn" onClick={handleConfirm}>
              Confirm
            </button>
          </div>
        </div>
      </div>
    </>
  );
}