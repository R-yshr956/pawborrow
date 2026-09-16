import { Heart } from "lucide-react";
import type { Pet } from "@repo/api";

interface Props {
  pet: Pet;
  onSelect: (pet: Pet) => void;
  isLiked: boolean;
  onToggleLike: () => void;
  isUpdatingLike: boolean;
}

export default function PetCard({
  pet,
  onSelect,
  isLiked,
  onToggleLike,
  isUpdatingLike,
}: Props) {
  function handleToggleLike(
    event: React.MouseEvent<HTMLButtonElement>,
  ) {
    event.stopPropagation();

    if (isUpdatingLike) return;

    onToggleLike();
  }

  return (
    <div
      className="pet-card"
      onClick={() => onSelect(pet)}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          onSelect(pet);
        }
      }}
    >
      <div className="pet-card-image">
        <img
          src={pet.image ?? "/placeholder-pet.jpg"}
          alt={pet.name}
        />

        <button
          type="button"
          className={`pet-card-heart ${isLiked ? "liked" : ""}`}
          aria-label={
            isLiked
              ? `Remove ${pet.name} from favorites`
              : `Add ${pet.name} to favorites`
          }
          aria-pressed={isLiked}
          onClick={handleToggleLike}
          disabled={isUpdatingLike}
        >
          <Heart
            size={16}
            fill={isLiked ? "#ef7f6b" : "none"}
            stroke="#ef7f6b"
          />
        </button>
      </div>

      <div className="pet-card-info">
        <h4>{pet.name}</h4>
        <p>Breed: {pet.breed ?? "Not specified"}</p>
      </div>
    </div>
  );
}