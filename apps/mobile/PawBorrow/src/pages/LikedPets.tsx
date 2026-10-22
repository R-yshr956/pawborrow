import { type CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import { IonContent, IonPage, IonIcon } from "@ionic/react";
import {
  chevronBackOutline,
  heartDislikeOutline,
  heart,
  pawOutline,
} from "ionicons/icons";
import { useLikedPets, useRemoveLikedPet } from "@repo/api";

import { useAuth } from "../context/AuthContext";
import { getPetImage, handlePetImageError } from "../utils/petImage";

const contentStyle = {
  "--background": "linear-gradient(180deg, #ffffff 0%, #fbf1eb 100%)",
} as CSSProperties;

const LikedPets = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const {
    data: likedPets = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useLikedPets(Boolean(user));

  const {
    mutate: removeLikedPet,
    isPending: isRemoving,
    variables: removingPetId,
    error: removeError,
  } = useRemoveLikedPet();

  function handleRemovePet(petId: number) {
    removeLikedPet(petId, {
      onError: (error) => {
        console.error("Failed to remove liked pet:", error);
      },
    });
  }

  return (
    <IonPage>
      <IonContent fullscreen style={contentStyle}>
        <div className="mx-auto box-border w-full max-w-lg px-[clamp(16px,4vw,22px)] pt-[clamp(16px,4vw,22px)] pb-[clamp(90px,18vh,120px)]">
          <header className="relative mt-2 mb-5 flex items-center justify-center">
            <button
              type="button"
              className="absolute left-0 flex h-9 w-9 items-center justify-center rounded-full border-0 bg-white text-froly-400 cursor-pointer"
              aria-label="Go back"
              onClick={() => navigate(-1)}
            >
              <IonIcon icon={chevronBackOutline} />
            </button>

            <h1 className="text-[clamp(17px,4.5vw,20px)] text-[#111827]">
              Liked Pets
            </h1>
          </header>

          {isLoading && (
            <p className="p-6 text-center">Loading liked pets...</p>
          )}

          {isError && (
            <div className="flex min-h-105 flex-col items-center justify-center rounded-3xl bg-linear-to-b from-[#fffaf5] to-white px-4.5 py-7.5 text-center">
              <div className="mb-4 flex h-18 w-18 items-center justify-center rounded-full bg-[#fde7d8] text-[30px] text-froly-400">
                <IonIcon icon={heartDislikeOutline} />
              </div>

              <h2 className="mb-2 text-[#1f2937]">Unable to load liked pets</h2>

              <p className="mb-5 leading-[1.6] text-[#6b7280]">
                {error instanceof Error
                  ? error.message
                  : "Something went wrong while loading your liked pets."}
              </p>

              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full border-0 bg-froly-400 px-4.5 py-3 text-sm font-semibold text-white cursor-pointer"
                onClick={() => refetch()}
              >
                Try Again
              </button>
            </div>
          )}

          {!isLoading && !isError && likedPets.length === 0 && (
            <div className="flex min-h-105 flex-col items-center justify-center rounded-3xl bg-linear-to-b from-[#fffaf5] to-white px-4.5 py-7.5 text-center">
              <div className="mb-4 flex h-18 w-18 items-center justify-center rounded-full bg-[#fde7d8] text-[30px] text-froly-400">
                <IonIcon icon={heartDislikeOutline} />
              </div>

              <h2 className="mb-2 text-[#1f2937]">No liked pets yet</h2>

              <p className="mb-5 leading-[1.6] text-[#6b7280]">
                Browse available pets and save the ones you love.
              </p>

              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full border-0 bg-froly-400 px-4.5 py-3 text-sm font-semibold text-white cursor-pointer"
                onClick={() => navigate("/pet-category")}
              >
                <IonIcon icon={pawOutline} />
                Browse Pets
              </button>
            </div>
          )}

          {!isLoading && !isError && likedPets.length > 0 && (
            <div className="grid grid-cols-2 gap-x-3 gap-y-3.5">
              {likedPets.map((likedPet) => {
                const pet = likedPet.pet;

                if (!pet) return null;

                const normalizedStatus = pet.status?.toLowerCase().trim() ?? "";
                const isAvailable = normalizedStatus === "available";
                const isThisPetRemoving =
                  isRemoving && Number(removingPetId) === pet.pet_id;

                return (
                  <div
                    className="relative min-w-0 overflow-hidden rounded-[18px] bg-white text-center shadow-[0_5px_18px_rgba(15,23,42,0.08)]"
                    key={likedPet.liked_pet_id}
                  >
                    <button
                      type="button"
                      className="w-full border-0 bg-transparent p-0 text-left text-inherit cursor-pointer"
                      onClick={() => navigate(`/dashboard/pet/${pet.pet_id}`)}
                    >
                      <div className="relative w-full">
                        <img
                          className="block h-37.5 w-full object-cover"
                          src={getPetImage(pet.image_url)}
                          alt={pet.name}
                          loading="lazy"
                          onError={handlePetImageError}
                        />

                        <span
                          className={[
                            "absolute top-2.5 left-2.5 rounded-full px-2.5 py-1.25",
                            "text-[11px] font-bold",
                            isAvailable
                              ? "bg-[#dcfce7] text-[#15803d]"
                              : "bg-[#fee2e2] text-[#dc2626]",
                          ].join(" ")}
                        >
                          {isAvailable
                            ? "Available"
                            : normalizedStatus === "booked"
                              ? "Booked"
                              : "Unavailable"}
                        </span>
                      </div>

                      <span className="block px-3 pt-3 text-base font-extrabold text-[#111827]">
                        {pet.name}
                      </span>

                      <span className="block px-3 pt-1 pb-3 text-xs text-[#6b7280]">
                        {pet.breed ?? "Breed not specified"}
                      </span>
                    </button>

                    <button
                      type="button"
                      className="mx-3 mb-3 flex w-[calc(100%-24px)] h-6 items-center justify-center gap-1.5 rounded-l-3xl border-0 bg-[#fff1f2] px-5 py-5 text-xs font-bold text-[#ef4444] cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                      aria-label={`Unlike ${pet.name}`}
                      onClick={() => handleRemovePet(pet.pet_id)}
                      disabled={isThisPetRemoving}
                    >
                      <IonIcon icon={heart} />

                      <span>
                        {isThisPetRemoving ? "Removing..." : "Unlike"}
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {removeError && (
            <p className="p-6 text-center text-[#dc2626]" role="alert">
              {removeError instanceof Error
                ? removeError.message
                : "Failed to remove the liked pet."}
            </p>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default LikedPets;
      

