import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { Pet } from "@repo/api";
import "@/styles/PetBookingModal.css";

interface Props {
  pet: Pet | null;
  onClose: () => void;
}

export default function PetBookingModal({
  pet,
  onClose,
}: Props) {
  const navigate = useNavigate();

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKey);

    return () => {
      document.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  if (!pet) {
    return null;
  }

  const hourlyRate = pet.hourlyRate;
  const isAvailable = pet.status === "available";
  const isBooked = pet.status === "booked";

  function handleBookNow() {
    // Extra protection in the UI
    if (!isAvailable) {
      return;
    }

    navigate("/booking", {
      state: {
        pet,
      },
    });

    onClose();
  }

  return (
    <div
      className="pet-modal-backdrop"
      onClick={onClose}
    >
      <div
        className="pet-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          className="pet-modal-close"
          aria-label="Close"
          onClick={onClose}
        >
          ✕
        </button>

        {/* Image */}
        {pet.image && (
          <div className="pet-modal-image">
            <img
              src={pet.image}
              alt={pet.name}
            />
          </div>
        )}

        <div className="pet-modal-details">
          {/* Category */}
          <p className="pet-modal-eyebrow">
            {pet.category}
          </p>

          {/* Name */}
          <h2>
            {pet.name}
          </h2>

          {/* Breed */}
          <p className="pet-modal-breed">
            {pet.breed || "Unknown breed"}
          </p>

          {/* Price */}
          <p className="pet-modal-price">
            ₱{hourlyRate.toLocaleString()}.00 / hour
          </p>

          {/* Personality */}
          {pet.personality?.length > 0 && (
            <div className="pet-modal-tags">
              {pet.personality.map((trait) => (
                <span
                  key={trait}
                  className="pet-modal-tag"
                >
                  {trait}
                </span>
              ))}
            </div>
          )}

          {/* Booking button / status */}
          {isAvailable ? (
            <>
              <button
                type="button"
                className="pet-modal-book-btn"
                onClick={handleBookNow}
              >
                Book Now
              </button>

              <p className="pet-modal-availability">
                ✓ Available for booking
              </p>
            </>
          ) : (
            <>
              <button
                type="button"
                className="pet-modal-book-btn disabled"
                disabled
              >
                {isBooked
                  ? "Currently Booked"
                  : "Currently Unavailable"}
              </button>

              <p className="pet-modal-unavailable">
                {isBooked
                  ? "✕ This pet is currently booked."
                  : "✕ This pet is currently unavailable."}
              </p>
            </>
          )}

          {/* Description */}
          <p className="pet-modal-description">
            {pet.name}
            {pet.breed
              ? ", known for being "
              : " is "}
            {pet.personality?.length
              ? pet.personality
                  .join(" and ")
                  .toLowerCase()
              : "friendly and caring"}
            .
            {" "}
            Every booking includes a food bowl,
            bed, and care instructions — just pick
            your date, start time, and duration.
          </p>
        </div>
      </div>
    </div>
  );
}