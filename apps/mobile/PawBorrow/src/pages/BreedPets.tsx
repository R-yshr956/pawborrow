import { useMemo, useState, type MouseEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IonContent, IonPage } from "@ionic/react";
import { ChevronLeft, Heart } from "lucide-react";
import {
  useAddLikedPet,
  useLikedPets,
  usePets,
  useRemoveLikedPet,
} from "@repo/api";

import SearchBar from "./SearchBar";
import { useAuth } from "../context/AuthContext";
import { matchesSearch } from "../utils/search";
import { getPetImage, handlePetImageError } from "../utils/petImage";

function createSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatLabel(value: string): string {
  return value
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getStatusLabel(status: string): string {
  switch (status) {
    case "available":
      return "Available";

    case "booked":
      return "Booked";

    default:
      return "Unavailable";
  }
}

function getStatusClasses(status: string): string {
  switch (status) {
    case "available":
      return "bg-[#dff7e8] text-[#16834a]";

    case "booked":
      return "bg-buttermilk-100 text-rusty-nail-900";

    default:
      return "bg-froly-100 text-froly-700";
  }
}

const BreedPets: React.FC = () => {
  const { animalId, breedId } = useParams<{
    animalId: string;
    breedId: string;
  }>();

  const navigate = useNavigate();
  const { user } = useAuth();

  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: pets = [],
    isLoading: petsLoading,
    isError: petsError,
    error: petsErrorDetails,
    refetch: refetchPets,
  } = usePets();

  const {
    data: likedPets = [],
    isLoading: likedPetsLoading,
    isError: likedPetsError,
  } = useLikedPets(Boolean(user));

  const { mutate: addLikedPet, isPending: isAddingLikedPet } = useAddLikedPet();

  const { mutate: removeLikedPet, isPending: isRemovingLikedPet } =
    useRemoveLikedPet();

  const likedPetIds = useMemo(() => {
    return new Set(likedPets.map((likedPet) => Number(likedPet.pet_id)));
  }, [likedPets]);

  const breedPets = useMemo(() => {
    if (!animalId || !breedId) {
      return [];
    }

    return pets.filter((pet) => {
      const categoryMatches = createSlug(pet.category) === animalId;

      const breedMatches = createSlug(pet.breed ?? "") === breedId;

      return categoryMatches && breedMatches;
    });
  }, [pets, animalId, breedId]);

  const filteredBreedPets = useMemo(() => {
    return breedPets.filter((pet) =>
      matchesSearch(`${pet.name} ${pet.breed ?? ""}`, searchTerm),
    );
  }, [breedPets, searchTerm]);

  const isUpdatingLike = isAddingLikedPet || isRemovingLikedPet;

  const isLoading = petsLoading || (Boolean(user) && likedPetsLoading);

  const breedName = breedPets[0]?.breed ?? formatLabel(breedId ?? "pets");

  function handleToggleLike(
    event: MouseEvent<HTMLButtonElement>,
    petId: number,
  ) {
    event.stopPropagation();

    if (!user) {
      navigate("/login");
      return;
    }

    if (isUpdatingLike) {
      return;
    }

    if (likedPetIds.has(petId)) {
      removeLikedPet(petId, {
        onError: (error) => {
          console.error("Failed to unlike pet:", error);
        },
      });

      return;
    }

    addLikedPet(petId, {
      onError: (error) => {
        console.error("Failed to like pet:", error);
      },
    });
  }

  function handleOpenPet(petId: number) {
    navigate(`/dashboard/pet/${petId}`);
  }

  if (petsError) {
    return (
      <IonPage>
        <IonContent
          fullscreen
          scrollY={true}
          className="[--background:#ffffff]"
        >
          <main
            className="
              mx-auto box-border flex min-h-full
              w-full max-w-[480px] items-center
              justify-center
              px-[clamp(16px,4vw,24px)]
              py-[clamp(16px,4vw,24px)]
              font-poppins
            "
          >
            <div
              className="
                w-full rounded-2xl border-2
                border-froly-100 bg-froly-50
                px-6 py-10 text-center
              "
            >
              <p className="m-0 text-sm text-froly-700">
                {petsErrorDetails instanceof Error
                  ? petsErrorDetails.message
                  : "Failed to load pets."}
              </p>

              <div
                className="
                  mt-5 flex flex-wrap
                  items-center justify-center gap-2
                "
              >
                <button
                  type="button"
                  onClick={() => {
                    void refetchPets();
                  }}
                  className="
                    min-h-11 rounded-xl border-0
                    bg-froly-400 px-5 py-2
                    text-sm font-semibold text-white
                    transition duration-200
                    active:scale-95 active:bg-froly-500
                    focus-visible:outline-2
                    focus-visible:outline-offset-2
                    focus-visible:outline-froly-400
                  "
                >
                  Try Again
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/pet-category")}
                  className="
                    min-h-11 rounded-xl
                    border border-froly-400 bg-white
                    px-5 py-2 text-sm font-semibold
                    text-froly-500
                    transition duration-200
                    active:scale-95 active:bg-froly-50
                    focus-visible:outline-2
                    focus-visible:outline-offset-2
                    focus-visible:outline-froly-400
                  "
                >
                  Back to Pets
                </button>
              </div>
            </div>
          </main>
        </IonContent>
      </IonPage>
    );
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
            mx-auto box-border min-h-full w-full
            max-w-[480px]
            px-[clamp(16px,4vw,24px)]
            pb-[calc(100px+env(safe-area-inset-bottom))]
            font-poppins
          "
        >
          <header
            className="
              relative mb-5 mt-[clamp(16px,5vh,30px)]
              flex items-center justify-center
              [@media(max-height:640px)]:mt-4
            "
          >
            <button
              type="button"
              aria-label="Go back"
              onClick={() => navigate(-1)}
              className="
                absolute left-0 flex h-9 w-9
                items-center justify-center
                rounded-full border-0 bg-froly-400
                text-white shadow-sm
                transition duration-200
                active:scale-95 active:bg-froly-500
                focus-visible:outline-2
                focus-visible:outline-offset-2
                focus-visible:outline-froly-400
              "
            >
              <ChevronLeft size={20} strokeWidth={2.5} />
            </button>

            <h1
              className="
                mx-12 my-0 truncate text-center
                font-cherry text-3xl leading-none
                text-froly-400
              "
            >
              {breedName}
            </h1>
          </header>

          <div className="mb-6">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search pets..."
            />
          </div>

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

              <p className="m-0 text-sm text-alabaster-500">Loading pets...</p>
            </div>
          )}

          {!isLoading && likedPetsError && (
            <p
              className="
                mb-5 mt-0 rounded-xl
                bg-buttermilk-50 px-4 py-3
                text-center text-xs text-rusty-nail-900
              "
            >
              Failed to load liked pets. You can still browse pets.
            </p>
          )}

          {!isLoading && breedPets.length === 0 && (
            <div
              className="
                mt-10 rounded-2xl border-2
                border-alabaster-100 bg-alabaster-50
                px-6 py-10 text-center
              "
            >
              <p className="m-0 text-sm text-alabaster-600">
                No {breedName} pets are available yet.
              </p>

              <button
                type="button"
                onClick={() => navigate(`/breed-selection/${animalId ?? ""}`)}
                className="
                  mt-5 min-h-11 rounded-xl border-0
                  bg-froly-400 px-5 py-2
                  text-sm font-semibold text-white
                  transition duration-200
                  active:scale-95 active:bg-froly-500
                  focus-visible:outline-2
                  focus-visible:outline-offset-2
                  focus-visible:outline-froly-400
                "
              >
                Back to Breeds
              </button>
            </div>
          )}

          {!isLoading &&
            breedPets.length > 0 &&
            filteredBreedPets.length === 0 && (
              <div
                className="
                  mt-10 rounded-2xl
                  bg-alabaster-50 px-5 py-10
                  text-center
                "
              >
                <p className="m-0 text-sm text-alabaster-500">
                  No pets match your search.
                </p>

                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="
                    mt-4 min-h-10 rounded-xl border-0
                    bg-froly-400 px-4 py-2
                    text-xs font-semibold text-white
                    transition duration-200
                    active:scale-95 active:bg-froly-500
                  "
                >
                  Clear Search
                </button>
              </div>
            )}

          {!isLoading && filteredBreedPets.length > 0 && (
            <section className="grid grid-cols-2 gap-4">
              {filteredBreedPets.map((pet) => {
                const isLiked = likedPetIds.has(pet.id);
                const status = pet.status.trim().toLowerCase();

                return (
                  <article
                    key={pet.id}
                    role="button"
                    tabIndex={0}
                    aria-label={`View ${pet.name}`}
                    onClick={() => handleOpenPet(pet.id)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        handleOpenPet(pet.id);
                      }
                    }}
                    className="
                        group relative min-w-0 cursor-pointer
                        overflow-hidden rounded-2xl
                        border-2 border-alabaster-100
                        bg-white
                        shadow-[0_4px_14px_rgba(22,34,51,0.08)]
                        transition duration-200
                        active:scale-[0.98]
                        focus-visible:outline-2
                        focus-visible:outline-offset-3
                        focus-visible:outline-froly-400
                      "
                  >
                    <button
                      type="button"
                      aria-label={
                        isLiked ? `Unlike ${pet.name}` : `Like ${pet.name}`
                      }
                      onClick={(event) => handleToggleLike(event, pet.id)}
                      disabled={isUpdatingLike}
                      className={`
                          absolute right-2 top-2 z-10
                          flex h-8 w-8
                          items-center justify-center
                          rounded-full border-0
                          shadow-[0_6px_12px_rgba(0,0,0,0.12)]
                          backdrop-blur-sm
                          transition duration-200
                          active:scale-90
                          disabled:cursor-not-allowed
                          disabled:opacity-60
                          focus-visible:outline-2
                          focus-visible:outline-offset-2
                          focus-visible:outline-froly-400
                          ${
                            isLiked
                              ? "bg-froly-100/95 text-froly-500"
                              : "bg-white/90 text-alabaster-300"
                          }
                        `}
                    >
                      <Heart
                        size={17}
                        strokeWidth={2.25}
                        fill={isLiked ? "currentColor" : "none"}
                      />
                    </button>

                    <div
                      className="
                          aspect-[1.1] w-full
                          overflow-hidden bg-alabaster-50
                        "
                    >
                      <img
                        src={getPetImage(pet.image)}
                        alt={pet.name}
                        loading="lazy"
                        onError={handlePetImageError}
                        className="
                            h-full w-full
                            object-cover object-center
                            transition-transform duration-300
                            group-hover:scale-105
                          "
                      />
                    </div>

                    <div className="p-3 text-center">
                      <span
                        className="
                            block m-0 truncate text-[clamp(13px,3.5vw,15px)]
                            font-semibold text-alabaster-950
                          "
                      >
                        {pet.name}
                      </span>

                      <span
                        className={`
                            mt-1 inline-flex rounded-full
                            px-2 py-1 text-[11px]
                            font-medium
                            ${getStatusClasses(status)}
                          `}
                      >
                        {getStatusLabel(status)}
                      </span>
                    </div>
                  </article>
                );
              })}
            </section>
          )}
        </main>
      </IonContent>
    </IonPage>
  );
};

export default BreedPets;
