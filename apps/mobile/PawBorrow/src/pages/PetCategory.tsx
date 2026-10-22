import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IonContent, IonPage } from "@ionic/react";
import { useCategories } from "@repo/api";
import { PawPrint } from 'lucide-react';

import SearchBar from "./SearchBar";

const placeholderPhoto = "/images/utils/placeholder.png";

const categoryPhotos: Record<string, string> = {
  capybara: "/images/pets/capybara.jpg",
  capybaras: "/images/pets/capybara.jpg",

  cat: "/images/pets/cat.avif",
  cats: "/images/pets/cat.avif",

  dog: "/images/pets/dog.avif",
  dogs: "/images/pets/dog.avif",

  rabbit: "/images/pets/rabbit.jpg",
  rabbits: "/images/pets/rabbit.jpg",
};

const categoryBorderColors: Record<string, string> = {
  capybara: "border-charlotte-300",
  capybaras: "border-charlotte-300",

  cat: "border-froly-300",
  cats: "border-froly-300",

  dog: "border-buttermilk-300",
  dogs: "border-buttermilk-300",

  rabbit: "border-tuft-bush-300",
  rabbits: "border-tuft-bush-300",
};

function normalizeCategory(value: string): string {
  return value.trim().toLowerCase();
}

function matchesSearch(value: string, searchTerm: string): boolean {
  const normalizedValue = normalizeCategory(value);
  const normalizedSearch = normalizeCategory(searchTerm);

  if (!normalizedSearch) {
    return true;
  }

  return normalizedValue.includes(normalizedSearch);
}

function createSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getCategoryPhoto(categoryName: string): string {
  const normalizedCategory = normalizeCategory(categoryName);

  return categoryPhotos[normalizedCategory] ?? placeholderPhoto;
}

function getCategoryBorderColor(categoryName: string): string {
  const normalizedCategory = normalizeCategory(categoryName);

  return categoryBorderColors[normalizedCategory] ?? "border-alabaster-200";
}

const PetCategory: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: categories = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useCategories();

  const filteredCategories = categories.filter((category) =>
    matchesSearch(category.label, searchTerm),
  );

  return (
    <IonPage>
      <IonContent
        fullscreen
        scrollY={true}
        className="
          [--background:#ffffff]
          [--padding-bottom:calc(100px+env(safe-area-inset-bottom))]
        "
      >
        <main
          className="
            mx-auto box-border min-h-full w-full max-w-[480px]
            px-[clamp(16px,4vw,24px)]
            pt-[clamp(16px,4vw,24px)]
            pb-[calc(25px+env(safe-area-inset-bottom))]
          "
        >
          <header
            className="
              relative mb-[18px]
              flex flex-row items-center justify-center gap-2 
              [@media(max-height:640px)]:mt-4
            "
          >
            <PawPrint size={24} className="text-froly-400 shrink-0 translate-y-1" />
            <h1 className="m-0 font-cherry text-3xl leading-none text-froly-400">
              PawBorrow Pets
            </h1>
          </header>

          {isLoading && (
            <div className="space-y-5" aria-label="Loading pet categories">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="
                    animate-pulse overflow-hidden rounded-2xl
                    border-2 border-alabaster-100 bg-white
                    shadow-card
                  "
                >
                  <div className="aspect-[3/2] w-full bg-alabaster-100" />

                  <div className="space-y-2 px-4 py-4">
                    <div className="h-4 w-1/3 rounded-full bg-alabaster-200" />
                    <div className="h-3 w-1/2 rounded-full bg-alabaster-100" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {isError && (
            <div
              className="
                rounded-2xl border-2 border-froly-200
                bg-froly-50 px-5 py-8 text-center
              "
            >
              <p className="mb-4 mt-0 text-sm text-froly-700">
                {error instanceof Error
                  ? error.message
                  : "Failed to load categories."}
              </p>

              <button
                type="button"
                className="
                  min-h-11 cursor-pointer rounded-xl border-0
                  bg-froly-400 px-5 py-2
                  text-sm font-semibold text-white
                  transition duration-200
                  active:scale-95 active:bg-froly-500
                  focus-visible:outline-2
                  focus-visible:outline-offset-2
                  focus-visible:outline-froly-400
                "
                onClick={() => {
                  void refetch();
                }}
              >
                Try Again
              </button>
            </div>
          )}

          {!isLoading && !isError && filteredCategories.length === 0 && (
            <div
              className="
                rounded-2xl border-2 border-alabaster-200
                bg-alabaster-50 px-5 py-10 text-center
              "
            >
              <p className="m-0 text-sm font-medium text-alabaster-600">
                No pet categories found.
              </p>

              {searchTerm.trim() && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="
                    mt-4 min-h-11 rounded-xl border-0
                    bg-froly-400 px-5
                    text-sm font-semibold text-white
                    transition duration-200
                    active:scale-95 active:bg-froly-500
                  "
                >
                  Clear Search
                </button>
              )}
            </div>
          )}

          {!isLoading && !isError && filteredCategories.length > 0 && (
            <section className="grid grid-cols-1 gap-5">
              {filteredCategories.map((category) => {
                const categorySlug = createSlug(category.label);
                const categoryPhoto = getCategoryPhoto(category.label);
                const borderColor = getCategoryBorderColor(category.label);

                return (
                  <button
                    type="button"
                    key={category.id}
                    aria-label={`Browse ${category.label}`}
                    onClick={() => navigate(`/breed-selection/${categorySlug}`)}
                    className={`
                      group min-w-0 cursor-pointer overflow-hidden
                      rounded-2xl border-2 bg-white p-0 text-left
                      shadow-card transition duration-200
                      active:scale-[0.98]
                      focus-visible:outline-2
                      focus-visible:outline-offset-4
                      focus-visible:outline-froly-400
                      ${borderColor}
                    `}
                  >
                    <div className="aspect-[2/1] w-full overflow-hidden bg-alabaster-50">
                      <img
                        src={categoryPhoto}
                        alt={category.label}
                        loading="lazy"
                        className="
                          h-full w-full object-cover object-center
                          transition-transform duration-300
                          group-hover:scale-105
                        "
                        onError={(event) => {
                          event.currentTarget.onerror = null;
                          event.currentTarget.src = placeholderPhoto;
                        }}
                      />
                    </div>

                    <div className="px-4 py-4">
                      <span className="block font-poppins text-base font-semibold text-alabaster-950">
                        {category.label}
                      </span>

                      <span className="mt-1 block font-inter text-xs text-alabaster-500">
                        View available {category.label.toLowerCase()}
                      </span>
                    </div>
                  </button>
                );
              })}
            </section>
          )}
        </main>
      </IonContent>
    </IonPage>
  );
};

export default PetCategory;
