import { useMemo, useState } from "react";
import {
  useSearchParams,
  useNavigate,
} from "react-router-dom";

import PetsCategoryRow from "@/components/layout/Pets/PetsCategoryRow";
import PetsFilterSidebar from "@/components/layout/Pets/PetFilterSidebar";
import PetsGrid from "@/components/layout/Pets/PetGrid";
import ProductsGrid from "@/components/layout/Pets/ProductsGrid";
import Footer from "@/components/ui/Footer";
import Navbar from "@/components/ui/Navbar";

import {
  usePets,
  useCategories,
  useLikedPets,
  useAddLikedPet,
  useRemoveLikedPet,
  usePetRealTime,
  useAuth,
} from "@repo/api";

import {
  products,
  PRODUCT_CATEGORIES,
  ANIMAL_FILTERS,
} from "@/components/layout/Pets/products";

import "@/styles/Pet.css";

const PAGE_SIZE = 9;

export default function PetsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  usePetRealTime();
  const categoryFromUrl = searchParams.get("category");

  const {
    data: pets = [],
    isLoading: petsLoading,
    isError: petsError,
  } = usePets();

  const {
    data: categories = [],
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useCategories();
 const {
  data: likedPets = [],
  isLoading: likedPetsLoading,
  error: likedPetsError,
} = useLikedPets(Boolean(user));

  const {
    mutate: addLikedPet,
    isPending: isAddingLikedPet,
  } = useAddLikedPet();

  const {
    mutate: removeLikedPet,
    isPending: isRemovingLikedPet,
  } = useRemoveLikedPet();

  const [selectedCategory, setSelectedCategory] = useState(
    categoryFromUrl || "Cat",
  );

  const [selectedBreed, setSelectedBreed] = useState("");

  const [selectedPersonality, setSelectedPersonality] = useState("");

  const [page, setPage] = useState(1);

  const isLoading = authLoading || petsLoading || categoriesLoading || (Boolean(user) && likedPetsLoading);

  const isError = petsError || categoriesError;

  const isProductMode = PRODUCT_CATEGORIES.includes(selectedCategory);

  const likedPetIds = useMemo(() => {
  return new Set(
    likedPets.map((likedPet) => Number(likedPet.pet_id))
  );
}, [likedPets]);

const isUpdatingLike =
  isAddingLikedPet || isRemovingLikedPet;

  const categoryItems = useMemo(() => {
    return categories.map((category) => ({
      label: category.label,

      count: pets.filter((pet) => pet.category === category.label).length,
    }));
  }, [categories, pets]);



  const breedItems = useMemo(() => {
    if (isProductMode) {
      return ANIMAL_FILTERS.map((animal) => ({
        label: animal,

        count: products.filter(
          (product) =>
            product.productCategory === selectedCategory &&
            product.animals.includes(animal),
        ).length,
      }));
    }

    const categoryPets = pets.filter(
      (pet) => pet.category === selectedCategory,
    );

    const breedCounts = new Map<string, number>();

    categoryPets.forEach((pet) => {
      if (!pet.breed) {
        return;
      }

      breedCounts.set(pet.breed, (breedCounts.get(pet.breed) ?? 0) + 1);
    });

    return Array.from(breedCounts.entries()).map(([breed, count]) => ({
      label: breed,
      count,
    }));
  }, [pets, selectedCategory, isProductMode]);


  const breedFilterTitle = isProductMode
    ? "Filter by animal"
    : "Filter by breed";

  const showPersonality = !isProductMode;

  const filteredPets = useMemo(() => {
    if (isProductMode) {
      return [];
    }

    return pets.filter((pet) => {
      const matchesCategory = pet.category === selectedCategory;

      const matchesBreed = !selectedBreed || pet.breed === selectedBreed;

      const matchesPersonality =
        !selectedPersonality || pet.personality.includes(selectedPersonality);

      return matchesCategory && matchesBreed && matchesPersonality;
    });
  }, [
    pets,
    selectedCategory,
    selectedBreed,
    selectedPersonality,
    isProductMode,
  ]);

  const filteredProducts = useMemo(() => {
    if (!isProductMode) {
      return [];
    }

    return products.filter((product) => {
      const matchesCategory = product.productCategory === selectedCategory;

      const matchesAnimal =
        !selectedBreed || product.animals.includes(selectedBreed);

      return matchesCategory && matchesAnimal;
    });
  }, [selectedCategory, selectedBreed, isProductMode]);

  const activeCount = isProductMode
    ? filteredProducts.length
    : filteredPets.length;

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
    setSelectedBreed((previous) => (previous === label ? "" : label));

    setPage(1);
  }

  function handleSelectPersonality(label: string) {
    setSelectedPersonality((previous) => (previous === label ? "" : label));

    setPage(1);
  }
  function handleToggleLike(petId: number) {
  if (!user) {
    navigate("/login", {
      state: {
        message: "Please sign in to like pets.",
        returnTo: "/pets",
      },
    });

    return;
  }

  if (isUpdatingLike) return;

  if (likedPetIds.has(petId)) {
    removeLikedPet(petId, {
      onError: (error) => {
        console.error("Failed to remove liked pet:", error);
      },
    });

    return;
  }

  addLikedPet(petId, {
    onError: (error) => {
      console.error("Failed to add liked pet:", error);
    },
  });
}

  if (isError) {
    return (
      <>
        <Navbar />

        <main className="flex min-h-[60vh] items-center justify-center">
          <p className="text-sm text-red-500">Failed to load pets.</p>
        </main>
      </>
    );
  }

  return (
    <main>
      <Navbar />

      <header className="pets-hero">
        <div className="pets-hero-content">
          <div className="pets-hero-text">
            <span className="eyebrow">PawBorrow &middot; Quezon City</span>

            <h1 className="text-5xl leading-[1.12] font-extrabold mb-4">
              Friends come with {""}
              <span className="text-froly-500">four paws.</span>
            </h1>

            <p>
              Browse available companions ready to share their love. Use the
              filters below to find the perfect match and all the gear you'll
              need.
            </p>
          </div>

          <div className="pets-hero-image">
            <div className="hero-blob" />

            <img src="/images/hero-pets.png" alt="Cat and dog" />
          </div>
        </div>
      </header>

      <PetsCategoryRow />

      <div className="pets-content">
        <PetsFilterSidebar
          categoryItems={categoryItems}
          selectedCategory={selectedCategory}
          selectedBreed={selectedBreed}
          selectedPersonality={selectedPersonality}
          breedItems={breedItems}
          breedFilterTitle={breedFilterTitle}
          showPersonality={showPersonality}
          onSelectCategory={handleSelectCategory}
          onSelectBreed={handleSelectBreed}
          onSelectPersonality={handleSelectPersonality}
        />

{user && likedPetsError && (
  <p className="text-sm text-red-500">
    {likedPetsError instanceof Error
      ? likedPetsError.message
      : "Failed to load liked pets."}
  </p>
)}

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
    likedPetIds={likedPetIds}
    onToggleLike={handleToggleLike}
    isUpdatingLike={isUpdatingLike}
  />
)}
      </div>

      <Footer />
    </main>
  );
}
