import { useEffect, useMemo, useState } from "react";
import { IonContent, IonIcon, IonPage } from "@ionic/react";
import {
  arrowForwardOutline,
  heartOutline,
  notificationsOutline,
  paw,
} from "ionicons/icons";
import { useNavigate } from "react-router-dom";
import { useBookings, usePets } from "@repo/api";

import { useAuth } from "../context/AuthContext";

const heroPhoto = "/images/dashboard/Ca4.png";
const fallbackImage = "/images/logo.png";

const categoryImages: Record<string, string> = {
  cat: "/images/pets/cats/American/Ruby.jpg",
  dog: "/images/pets/Dogs/Pug/Edgar.jpg",
  rabbit: "/images/pets/Rabbits/Flemish/Maple.jpg",
  capybara: "/images/pets/Capybara/Less/Carlos.jpg",
};

const sectionLink =
  "flex shrink-0 items-center gap-1 text-xs font-bold text-froly-400 transition hover:text-froly-600";

function createSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getGreeting(hour: number) {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  if (hour < 21) return "Good evening";
  return "Good night";
}

export const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date());
    }, 60_000);

    return () => window.clearInterval(timer);
  }, []);

  const {
    data: pets = [],
    isLoading: petsLoading,
    isError: petsError,
  } = usePets();

  const { data: bookings = [] } = useBookings();

  const categories = useMemo(() => {
    const categoryMap = new Map<
      string,
      {
        id: string;
        label: string;
        photo: string;
        count: number;
      }
    >();

    pets.forEach((pet) => {
      const categoryName = pet.category?.trim();
      if (!categoryName) return;

      const key = categoryName.toLowerCase();
      const existing = categoryMap.get(key);

      if (existing) {
        existing.count += 1;
      } else {
        categoryMap.set(key, {
          id: createSlug(categoryName),
          label: categoryName,
          photo: categoryImages[key] || pet.image || fallbackImage,
          count: 1,
        });
      }
    });

    return Array.from(categoryMap.values()).sort((a, b) =>
      a.label.localeCompare(b.label),
    );
  }, [pets]);

  const shuffledPets = useMemo(() => {
    const result = [...pets];

    for (let index = result.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));

      [result[index], result[randomIndex]] = [
        result[randomIndex],
        result[index],
      ];
    }

    return result;
  }, [pets]);

  const visiblePets = shuffledPets.slice(0, 6);

  const upcomingBookings = bookings.filter((booking) =>
    ["pending", "confirmed"].includes((booking.status ?? "").toLowerCase()),
  );

  const notificationCount = upcomingBookings.length;
  const greeting = getGreeting(now.getHours());
  const firstName =
    user?.fullName?.trim().split(/\s+/)[0] ||
    user?.displayName?.trim() ||
    "Pet Lover";

  return (
    <IonPage>
      <IonContent fullscreen className="[--background:#ffffff]">
        <main className="mx-auto w-full max-w-6xl px-4 pb-28 pt-[calc(14px+env(safe-area-inset-top))] font-sans text-[#272522] sm:px-6 sm:pt-[calc(18px+env(safe-area-inset-top))]">
          <header className="mb-5 flex min-h-10 items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <button
                type="button"
                aria-label="Dashboard home"
                onClick={() => navigate("/dashboard")}
                className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-froly-400"
              >
                <IonIcon
                  icon={paw}
                  aria-hidden="true"
                  className="text-[21px]"
                />
              </button>

              <div className="min-w-0 leading-tight">
                <p className="m-0 truncate text-[14px] font-bold text-[#272522]">
                  Hello, {firstName}!
                </p>
                <p className="m-0 mt-0.5 text-[10px] text-stone-500">
                  {greeting}!
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                aria-label="Liked pets"
                onClick={() => navigate("/liked-pets")}
                className="grid h-8 w-8 place-items-center rounded-full text-[#272522]"
              >
                <IonIcon
                  icon={heartOutline}
                  aria-hidden="true"
                  className="text-[19px]"
                />
              </button>

              <button
                type="button"
                aria-label={`Notifications, ${notificationCount} booking updates`}
                onClick={() => navigate("/notification")}
                className="relative grid h-8 w-8 place-items-center rounded-full text-[#272522]"
              >
                <IonIcon
                  icon={notificationsOutline}
                  aria-hidden="true"
                  className="text-[19px]"
                />

                {notificationCount > 0 && (
                  <span
                    aria-hidden="true"
                    className="absolute right-0 top-0 h-2 w-2 rounded-full border border-white bg-[#F45B5B]"
                  />
                )}
              </button>
            </div>
          </header>

          <section className="relative isolate h-[150px] overflow-hidden rounded-xl bg-[#F3931C] sm:h-[190px]">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-3 -top-3 h-full w-[180px] opacity-25 sm:w-[260px]"
              style={{
                backgroundImage:
                  "radial-gradient(circle, #FFD17C 6px, transparent 6.5px)",
                backgroundSize: "19px 19px",
              }}
            />

            <div className="relative z-10 w-[57%] pl-5 pt-5 text-white sm:pl-7 sm:pt-7">
              <h2 className="m-0 text-[24px] font-semibold leading-tight tracking-tight sm:text-[30px]">
                Book now!
              </h2>

              <p className="mt-3 text-[11px] leading-[17px] text-white/90 sm:text-sm sm:leading-5">
                See how you can find friends
                <br />
                who are a match for you
              </p>
            </div>

            <img
              src={heroPhoto}
              alt="A fluffy dog wearing a blue shirt"
              className="pointer-events-none absolute bottom-0 right-0 z-20 h-full w-[43%] object-contain object-bottom sm:right-5"
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = fallbackImage;
              }}
            />
          </section>

          <section className="mt-8">
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-xl font-cherry text-froly-400 tracking-tight">
                  Browse Categories
                </h2>
                <p className="mt-1 text-[11px] text-stone-400">
                  Discover a different mix of companions
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate("/pet-category")}
                className={sectionLink}
              >
                View all
                <IonIcon icon={arrowForwardOutline} aria-hidden="true" />
              </button>
            </div>

            {petsLoading && (
              <p role="status" className="my-3 text-xs text-stone-400">
                Loading pets...
              </p>
            )}

            {petsError && (
              <p role="alert" className="my-3 text-xs text-red-600">
                We could not load the pet categories.
              </p>
            )}

            {!petsLoading && !petsError && categories.length === 0 && (
              <p className="my-3 text-xs text-stone-400">
                No categories found.
              </p>
            )}

            {!petsLoading && !petsError && categories.length > 0 && (
              <div className="grid snap-x auto-cols-[82px] grid-flow-col gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:auto-cols-[minmax(88px,1fr)] sm:gap-4">
                {categories.slice(0, 6).map((category) => (
                  <button
                    type="button"
                    key={category.id}
                    onClick={() => navigate(`/breed-selection/${category.id}`)}
                    className="flex min-w-0 snap-start flex-col items-center text-[#272522]"
                  >
                    <span className="h-[66px] w-[66px] overflow-hidden rounded-full border border-stone-200 bg-white p-1 shadow-sm sm:h-[74px] sm:w-[74px]">
                      <img
                        src={category.photo}
                        alt=""
                        className="h-full w-full rounded-full object-cover"
                        onError={(event) => {
                          event.currentTarget.onerror = null;
                          event.currentTarget.src = fallbackImage;
                        }}
                      />
                    </span>

                    <strong className="mt-2 max-w-full truncate text-xs">
                      {category.label}
                    </strong>

                    <small className="mt-0.5 text-[9px] text-stone-400">
                      {category.count} pets
                    </small>
                  </button>
                ))}
              </div>
            )}
          </section>

          <section className="mt-8">
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-xl font-cherry text-froly-400 tracking-tight">
                  Our PawPals
                </h2>
                <p className="mt-1 text-[11px] text-stone-400">
                  Discover different companions
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate("/pet-category")}
                className={sectionLink}
              >
                View all
                <IonIcon icon={arrowForwardOutline} aria-hidden="true" />
              </button>
            </div>

            {petsLoading && (
              <p role="status" className="my-3 text-xs text-stone-400">
                Loading companions...
              </p>
            )}

            {petsError && (
              <p role="alert" className="my-3 text-xs text-red-600">
                We could not load the pets.
              </p>
            )}

            {!petsLoading && !petsError && visiblePets.length === 0 && (
              <p className="my-3 text-xs text-stone-400">No pets found.</p>
            )}

            {!petsLoading && !petsError && visiblePets.length > 0 && (
              <div className="grid snap-x auto-cols-[47%] grid-flow-col gap-4 overflow-x-auto px-px pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:auto-cols-[minmax(190px,24%)]">
                {visiblePets.map((pet, index) => (
                  <article
                    key={String(pet.id ?? `${pet.name}-${index}`)}
                    className="group snap-start overflow-hidden rounded-[18px] border border-stone-200 bg-white shadow-[0_10px_25px_rgba(59,46,35,0.07)]"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/breed-selection/${createSlug(
                            pet.category || "pets",
                          )}`,
                        )
                      }
                      aria-label={`View ${pet.name || "pet"}`}
                      className="block h-36 w-full overflow-hidden sm:h-44"
                    >
                      <img
                        src={pet.image || fallbackImage}
                        alt={pet.name || "Pet"}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105 motion-reduce:transition-none"
                        onError={(event) => {
                          event.currentTarget.onerror = null;
                          event.currentTarget.src = fallbackImage;
                        }}
                      />
                    </button>

                    <div className="flex items-center justify-between gap-2.5 px-3 py-3">
                      <strong className="truncate text-sm">
                        {pet.name || "New friend"}
                      </strong>

                      <span className="shrink-0 text-[10px] font-bold text-froly-500">
                        {pet.category || "Pet"}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className="mt-7 flex flex-col items-start justify-between gap-5 rounded-[20px] bg-buttermilk-100 px-6 py-6 sm:flex-row sm:items-center">
            <div>
              <span className="text-[10px] font-extrabold tracking-[0.16em]">
                MY BOOKINGS
              </span>

              <h2 className="my-1.5 text-xl font-bold">
                {upcomingBookings.length === 0
                  ? "Plan your next pet visit"
                  : `${upcomingBookings.length} upcoming ${
                      upcomingBookings.length === 1 ? "booking" : "bookings"
                    }`}
              </h2>

              <p className="m-0 text-">
                Keep track of your scheduled visits and booking updates.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/my-bookings")}
              className="flex shrink-0 items-center gap-2 rounded-xl bg-white px-4 py-3 text-xs font-bold"
            >
              View bookings
              <IonIcon icon={arrowForwardOutline} aria-hidden="true" />
            </button>
          </section>
        </main>
      </IonContent>
    </IonPage>
  );
};

export default Dashboard;
