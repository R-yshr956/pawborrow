import { useState } from "react";
import PetCard from "./PetCard";
import PetBookingModal from "./PetBookingModal";
import type { Pet } from "@/components/layout/Pets/pets";

interface Props {
  pets: Pet[];
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalCount: number;
  pageSize: number;
}

export default function PetsGrid({
  pets,
  page,
  totalPages,
  onPageChange,
  totalCount,
  pageSize,
}: Props) {
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalCount);

  return (
    <div className="pets-grid-wrap">
      <div className="pets-grid-header">
        <span>
          Showing {start}-{end} of {totalCount} results
        </span>
        <select defaultValue="latest">
          <option value="latest">Sort by latest</option>
          <option value="name">Sort by name</option>
        </select>
      </div>

      <div className="pets-grid">
        {pets.map((pet) => (
          <PetCard pet={pet} key={pet.id} onSelect={setSelectedPet} />
        ))}
      </div>

      <div className="pets-pagination">
        <div className="pets-pagination-numbers">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              className={num === page ? "active" : ""}
              onClick={() => onPageChange(num)}
            >
              {num}
            </button>
          ))}
        </div>
        <button
          className="pets-pagination-next"
          disabled={page === totalPages}
          onClick={() => onPageChange(Math.min(page + 1, totalPages))}
        >
          Next →
        </button>
      </div>

      <PetBookingModal pet={selectedPet} onClose={() => setSelectedPet(null)} />
    </div>
  );
}