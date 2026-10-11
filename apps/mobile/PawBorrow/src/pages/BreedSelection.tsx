import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IonContent, IonPage } from "@ionic/react";
import { ChevronLeft, PawPrint } from "lucide-react";
import { usePets } from "@repo/api";

import { getPetImage, handlePetImageError } from "../utils/petImage";

function createSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatCategoryLabel(value?: string): string {
  if (!value) {
    return "Pet";
  }

  return value
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

type BreedItem = {
  id: string;
  name: string;
  photo: string | null;
  count: number;
};

const BreedSelection: React.FC = () => {
  const { animalId } = useParams<{
    animalId: string;
  }>();

  const navigate = useNavigate();

  const { data: pets = [], isLoading, isError, error, refetch } = usePets();

  const normalizedAnimalId = animalId ?? "";

  const categoryPets = useMemo(() => {
    return pets.filter((pet) => {
      return createSlug(pet.category) === normalizedAnimalId;
    });
  }, [pets, normalizedAnimalId]);

  const breeds = useMemo(() => {
    const breedMap = new Map<string, BreedItem>();

    categoryPets.forEach((pet) => {
      if (!pet.breed?.trim()) {
        return;
      }

      const breedName = pet.breed.trim();
      const breedId = createSlug(breedName);
      const existingBreed = breedMap.get(breedId);

      if (existingBreed) {
        existingBreed.count += 1;

        if (!existingBreed.photo && pet.image) {
          existingBreed.photo = pet.image;
        }

        return;
      }

      breedMap.set(breedId, {
        id: breedId,
        name: breedName,
        photo: pet.image,
        count: 1,
      });
    });

    return Array.from(breedMap.values()).sort((first, second) =>
      first.name.localeCompare(second.name),
    );
  }, [categoryPets]);

  const categoryLabel =
    categoryPets[0]?.category ?? formatCategoryLabel(animalId);

  function handleSelectBreed(breedId: string) {
    navigate(`/breed-pets/${normalizedAnimalId}/${breedId}`);
  }

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
            mx-auto box-border min-h-full
            w-full max-w-120
            px-[clamp(16px,4vw,24px)]
            pb-[calc(100px+env(safe-area-inset-bottom))]
            font-poppins
          "
        >
          <header
            className="
              relative mb-5
              mt-[clamp(16px,5vh,30px)]
              flex items-center justify-center
              [@media(max-height:640px)]:mt-4
            "
          >
            <button
              type="button"
              aria-label="Back to pet categories"
              onClick={() => navigate("/pet-category")}
              className="
                absolute left-0 flex h-9 w-9
                items-center justify-center
                rounded-full border-0
                bg-froly-400 text-white
                shadow-sm transition duration-200
                active:scale-95
                active:bg-froly-500
                focus-visible:outline-2
                focus-visible:outline-offset-2
                focus-visible:outline-froly-400
              "
            >
              <ChevronLeft size={20} strokeWidth={2.5} />
            </button>

            <h1
              className="
                mx-12 my-0 truncate
                text-center font-cherry
                text-3xl leading-none
                text-froly-400
              "
            >
              {categoryLabel} Breeds
            </h1>
          </header>

          {isLoading && (
            <div className="mt-10 text-center">
              <div
                className="
                  mx-auto mb-4 h-9 w-9
                  animate-spin rounded-full
                  border-4 border-froly-100
                  border-t-froly-400
                "
                aria-hidden="true"
              />

              <p className="m-0 text-sm text-alabaster-500">
                Loading breeds...
              </p>
            </div>
          )}

          {isError && (
            <div
              className="
                mt-10 rounded-2xl border-2
                border-froly-100 bg-froly-50
                px-6 py-10 text-center
              "
            >
              <div
                className="
                  mx-auto mb-4 flex h-14 w-14
                  items-center justify-center
                  rounded-full bg-froly-100
                  text-froly-500
                "
              >
                <PawPrint size={26} strokeWidth={2} />
              </div>

              <p className="m-0 text-sm text-froly-700">
                {error instanceof Error
                  ? error.message
                  : "Failed to load breeds."}
              </p>

              <button
                type="button"
                onClick={() => {
                  void refetch();
                }}
                className="
                  mt-5 min-h-11 rounded-xl
                  border-0 bg-froly-400
                  px-5 py-2 text-sm
                  font-semibold text-white
                  transition duration-200
                  active:scale-95
                  active:bg-froly-500
                  focus-visible:outline-2
                  focus-visible:outline-offset-2
                  focus-visible:outline-froly-400
                "
              >
                Try Again
              </button>
            </div>
          )}

          {!isLoading && !isError && breeds.length === 0 && (
            <div
              className="
                  mt-10 rounded-2xl border-2
                  border-alabaster-100
                  bg-alabaster-50
                  px-6 py-10 text-center
                "
            >
              <div
                className="
                    mx-auto mb-4 flex h-14 w-14
                    items-center justify-center
                    rounded-full bg-froly-50
                    text-froly-400
                  "
              >
                <PawPrint size={26} strokeWidth={2} />
              </div>

              <p
                className="
                    m-0 text-sm leading-6
                    text-alabaster-600
                  "
              >
                No available breeds were found for this category.
              </p>

              <button
                type="button"
                onClick={() => navigate("/pet-category")}
                className="
                    mt-5 min-h-11 rounded-xl
                    border-0 bg-froly-400
                    px-5 py-2 text-sm
                    font-semibold text-white
                    transition duration-200
                    active:scale-95
                    active:bg-froly-500
                    focus-visible:outline-2
                    focus-visible:outline-offset-2
                    focus-visible:outline-froly-400
                  "
              >
                Back to Categories
              </button>
            </div>
          )}

          {!isLoading && !isError && breeds.length > 0 && (
            <section className="grid grid-cols-2 gap-4">
              {breeds.map((breed) => (
                <button
                  type="button"
                  key={breed.id}
                  aria-label={`Browse ${breed.name}`}
                  onClick={() => handleSelectBreed(breed.id)}
                  className="
                      group min-w-0 cursor-pointer
                      overflow-hidden rounded-2xl
                      border-2 border-alabaster-100
                      bg-white p-0 text-left
                      shadow-[0_4px_14px_rgba(22,34,51,0.08)]
                      transition duration-200
                      active:scale-[0.98]
                      focus-visible:outline-2
                      focus-visible:outline-offset-3
                      focus-visible:outline-froly-400
                    "
                >
                  <div
                    className="
                        aspect-[1.1] w-full
                        overflow-hidden
                        bg-alabaster-50
                      "
                  >
                    <img
                      src={getPetImage(breed.photo)}
                      alt={breed.name}
                      loading="lazy"
                      onError={handlePetImageError}
                      className="
                          h-full w-full
                          object-cover object-center
                          transition-transform
                          duration-300
                          group-hover:scale-105
                        "
                    />
                  </div>

                  <div className="p-3 text-center">
                    <span
                      className="
                          block truncate
                          text-[clamp(13px,3.5vw,15px)]
                          font-semibold
                          text-alabaster-950
                        "
                    >
                      {breed.name}
                    </span>

                    <small
                      className="
                          mt-1.5 block text-[11px]
                          font-medium
                          text-alabaster-500
                        "
                    >
                      {breed.count} {breed.count === 1 ? "pet" : "pets"}
                    </small>
                  </div>
                </button>
              ))}
            </section>
          )}
        </main>
      </IonContent>
    </IonPage>
  );
};

export default BreedSelection;
