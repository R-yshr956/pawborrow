import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { Pet } from "@/components/layout/Pets/pets";
import Navbar from "@/components/ui/Navbar";
import "@/styles/BookingRequest.css";

interface LocationState {
  pet: Pet;
  days: number;
  total: number;
}

export default function BookingRequest() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState | null;

  const [selectedPetId, setSelectedPetId] = useState(state?.pet?.id);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });

if (!state?.pet) {
  navigate("/pets");
  return null;
}

const { pet, days, total } = state;

function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
  setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
}

function handleConfirm() {
  navigate("/payment", {
    state: { pet, days, total, contact: form },
  });
}
  return (
    <>
      <Navbar />
      <div className="booking-page">
        <div className="booking-card">
          <div className="booking-left">
            <h1>Select the Pet you want to book</h1>
            <p className="booking-subtext">
              Upon selecting the pet you want to book you will be providing details needed
            </p>

            <div className="booking-pet-list">
              <div
                className={`booking-pet-row ${selectedPetId === pet.id ? "active" : ""}`}
                onClick={() => setSelectedPetId(pet.id)}
              >
                <img src={pet.image} alt={pet.name} className="booking-pet-avatar" />
                <span>
                  {pet.category} | Name: {pet.name} | Breed: {pet.breed}
                  {pet.age ? ` | Age: ${pet.age}` : ""}
                </span>
              </div>
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