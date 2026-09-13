import { ChevronLeft, ChevronRight } from "lucide-react";
import { categories } from "@/components/layout/Pets/pets";

export default function PetsCategoryRow() {
  return (
    <section className="pets-category-row">
      <div className="pets-category-header">
        <h2 className="font-bold">Borrow a pet</h2>
        <div className="pets-category-arrows">
          <button aria-label="Previous">
            <ChevronLeft size={18} />
          </button>
          <button aria-label="Next">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="pets-category-list">
        {categories.map((cat) => (
          <div className="pets-category-item" key={cat.label}>
            <div className="pets-category-circle">
              <img src={cat.image} alt={cat.label} />
            </div>
            <span>{cat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}