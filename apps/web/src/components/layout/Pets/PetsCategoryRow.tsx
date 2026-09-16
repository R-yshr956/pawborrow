import { useCategories } from "@repo/api";

export default function PetsCategoryRow() {
  const {
    data: categories = [],
    isLoading,
    isError,
  } = useCategories();

  if (isLoading) {
    return (
      <section className="pets-category-row">
        <div className="pets-category-header">
          <h2 className="font-bold">Borrow a pet</h2>
        </div>

        <p>Loading categories...</p>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="pets-category-row">
        <div className="pets-category-header">
          <h2 className="font-bold">Borrow a pet</h2>
        </div>

        <p>Failed to load categories.</p>
      </section>
    );
  }

  return (
    <section className="pets-category-row">
      <div className="pets-category-header">
        <h2 className="font-bold">Borrow a pet</h2>
      </div>

      <div className="pets-category-list">
        {categories.map((category) => (
          <div
            className="pets-category-item"
            key={category.id}
          >
            <div className="pets-category-circle">
              {/* No image in your pet_category table */}
              <span>
                {category.label.charAt(0)}
              </span>
            </div>

            <span>
              {category.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}