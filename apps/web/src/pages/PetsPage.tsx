import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import PetsHero from "@/components/layout/Pets/PetHero";
import PetsCategoryRow from "@/components/layout/Pets/PetsCategoryRow";
import PetsFilterSidebar from "@/components/layout/Pets/PetFilterSidebar";
import PetsGrid from "@/components/layout/Pets/PetGrid";
import ProductsGrid from "@/components/layout/Pets/ProductsGrid";
import PetsFooter from "@/components/ui/Footer";
import { pets, breedsByCategory } from "@/components/layout/Pets/pets";
import { products, PRODUCT_CATEGORIES, ANIMAL_FILTERS } from "@/components/layout/Pets/products";
import Navbar from "@/components/ui/Navbar";
import "@/styles/Pet.css";

const PAGE_SIZE = 9;

export default function PetsPage() {
  const [searchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get("category");

  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl || "Cat");
  const [selectedBreed, setSelectedBreed] = useState("");
  const [selectedPersonality, setSelectedPersonality] = useState("");
  const [page, setPage] = useState(1);

  const isProductMode = PRODUCT_CATEGORIES.includes(selectedCategory);

  const currentBreedItems = useMemo(() => {
    if (isProductMode) {
      return ANIMAL_FILTERS.map((animal) => ({
        label: animal,
        count: products.filter(
          (p) => p.productCategory === selectedCategory && p.animals.includes(animal)
        ).length,
      }));
    }
    return breedsByCategory[selectedCategory] || [];
  }, [selectedCategory, isProductMode]);

  const filteredPets = useMemo(() => {
    if (isProductMode) return [];
    return pets.filter((pet) => {
      const matchesCategory = pet.category === selectedCategory;
      const matchesBreed = !selectedBreed || pet.breed === selectedBreed;
      const matchesPersonality = !selectedPersonality || pet.personality.includes(selectedPersonality);
      return matchesCategory && matchesBreed && matchesPersonality;
    });
  }, [selectedCategory, selectedBreed, selectedPersonality, isProductMode]);

  const filteredProducts = useMemo(() => {
    if (!isProductMode) return [];
    return products.filter((product) => {
      const matchesCategory = product.productCategory === selectedCategory;
      const matchesAnimal = !selectedBreed || product.animals.includes(selectedBreed);
      return matchesCategory && matchesAnimal;
    });
  }, [selectedCategory, selectedBreed, isProductMode]);

  const activeCount = isProductMode ? filteredProducts.length : filteredPets.length;
  const totalPages = Math.max(1, Math.ceil(activeCount / PAGE_SIZE));

  const visiblePets = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredPets.slice(start, start + PAGE_SIZE);
  }, [filteredPets, page]);

  const visibleProducts = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredProducts.slice(start, start + PAGE_SIZE);
  }, [filteredProducts, page]);

  function handleSelectCategory(label: string) {
    setSelectedCategory(label);
    setSelectedBreed("");
    setSelectedPersonality("");
    setPage(1);
  }

  function handleSelectBreed(label: string) {
    setSelectedBreed((prev) => (prev === label ? "" : label));
    setPage(1);
  }

  function handleSelectPersonality(label: string) {
    setSelectedPersonality((prev) => (prev === label ? "" : label));
    setPage(1);
  }

  return (
    <div className="pets-page">
      <Navbar />
      <PetsHero />
      <PetsCategoryRow />

      <div className="pets-content">
        <PetsFilterSidebar
          selectedCategory={selectedCategory}
          selectedBreed={selectedBreed}
          selectedPersonality={selectedPersonality}
          breedItems={currentBreedItems}
          breedFilterTitle={isProductMode ? "Filter by animal" : "Filter by breed"}
          showPersonality={!isProductMode}
          onSelectCategory={handleSelectCategory}
          onSelectBreed={handleSelectBreed}
          onSelectPersonality={handleSelectPersonality}
        />
        {isProductMode ? (
          <ProductsGrid
            products={visibleProducts}
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            totalCount={filteredProducts.length}
            pageSize={PAGE_SIZE}
          />
        ) : (
          <PetsGrid
            pets={visiblePets}
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            totalCount={filteredPets.length}
            pageSize={PAGE_SIZE}
          />
        )}
      </div>

      <PetsFooter />
    </div>
  );
}