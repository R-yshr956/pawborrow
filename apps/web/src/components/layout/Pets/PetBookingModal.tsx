import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Pet } from "@/components/layout/Pets/pets";
import "@/styles/PetBookingModal.css";

const PRICE_BY_CATEGORY: Record<string, number> = {
  Cat: 250,
  Dog: 280,
  "Guinea Pig": 180,
  Rabbit: 200,
};

interface Props {
  pet: Pet | null;
  onClose: () => void;
}

export default function PetBookingModal({ pet, onClose }: Props) {
  const navigate = useNavigate();
  const [days, setDays] = useState(1);

  useEffect(() => {
    setDays(1);
  }, [pet]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  if (!pet) return null;

  const pricePerDay = PRICE_BY_CATEGORY[pet.category] ?? 220;
  const total = pricePerDay * days;

  function handleBookNow() {
    navigate("/booking", { state: { pet, days, total } });
    onClose();
  }

  return (
    <div className="pet-modal-backdrop" onClick={onClose}>
      <div className="pet-modal" onClick={(e) => e.stopPropagation()}>
        <button className="pet-modal-close" aria-label="Close" onClick={onClose}>
          ✕
        </button>

        <div className="pet-modal-image">
          <img src={pet.image} alt={pet.name} />
        </div>

        <div className="pet-modal-details">
          <p className="pet-modal-eyebrow">{pet.category}</p>
          <h2>{pet.name}</h2>
          <p className="pet-modal-breed">
            {pet.breed}
            {pet.age ? ` · ${pet.age}` : ""}
          </p>

          <p className="pet-modal-price">₱{pricePerDay.toLocaleString()}.00 / day</p>

          {pet.personality?.length > 0 && (
            <div className="pet-modal-tags">
              {pet.personality.map((trait) => (
                <span key={trait} className="pet-modal-tag">
                  {trait}
                </span>
              ))}
            </div>
          )}

          <div className="pet-modal-stepper">
            <span>Days</span>
            <div className="pet-modal-stepper-controls">
              <button
                aria-label="Decrease days"
                onClick={() => setDays((d) => Math.max(1, d - 1))}
              >
                −
              </button>
              <span>{days}</span>
              <button aria-label="Increase days" onClick={() => setDays((d) => d + 1)}>
                +
              </button>
            </div>
          </div>

          <button className="pet-modal-book-btn" onClick={handleBookNow}>
            Book Now — ₱{total.toLocaleString()}.00
          </button>

          <p className="pet-modal-availability">✓ Available for booking</p>

          <p className="pet-modal-description">
            {pet.name} is a {pet.age ? pet.age.toLowerCase() + " " : ""}
            {pet.breed}, known for being {pet.personality?.join(" and ").toLowerCase()}.
            Every booking includes a food bowl, bed, and care instructions — just pick
            your dates and we'll have {pet.name} ready to go.
          </p>
        </div>
      </div>
    </div>
  );
}