import { useState } from "react";
import { Heart } from "lucide-react";
import type { Pet } from "@/components/layout/Pets/pets";

interface Props {
  pet: Pet;
  onSelect: (pet: Pet) => void;
}

export default function PetCard({ pet, onSelect }: Props) {
  const [liked, setLiked] = useState(false);

  return (
    <div className="pet-card" onClick={() => onSelect(pet)}>
      <div className="pet-card-image">
        <img src={pet.image} alt={pet.name} />
        <button
          className={`pet-card-heart ${liked ? "liked" : ""}`}
          aria-label={liked ? "Remove from favorites" : "Add to favorites"}
          onClick={(e) => {
            e.stopPropagation();
            setLiked((v) => !v);
          }}
        >
          <Heart size={16} fill={liked ? "#ef7f6b" : "none"} />
        </button>
      </div>
      <div className="pet-card-info">
        <h4>{pet.name}</h4>
        <p>Breed: {pet.breed}</p>
        {pet.age && <p>Age: {pet.age}</p>}
      </div>
    </div>
  );
}