import { useState } from "react";
import { Heart } from "lucide-react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import "@/styles/Favorites.css";

type BookingStatus = "Upcoming" | "Completed" | "Cancelled";

interface Booking {
  id: number;
  petName: string;
  image: string;
  breed: string;
  date: string;
  status: BookingStatus;
}

interface LikedPet {
  id: number;
  name: string;
  image: string;
  breed: string;
  age?: string;
  bookedDate: string;
}

const BOOKINGS: Booking[] = [
  {
    id: 1,
    petName: "Milo",
    image: "/images/featured-milo.jpg",
    breed: "Scottish Fold",
    date: "August 8",
    status: "Completed",
  },
  {
    id: 2,
    petName: "Buddy",
    image: "/images/featured-buddy.jpg",
    breed: "Pug",
    date: "August 15",
    status: "Upcoming",
  },
];

const LIKED_PETS: LikedPet[] = [
  {
    id: 1,
    name: "Nidra",
    image: "/images/cat.png", // no nidra image exists — using a placeholder for now
    breed: "Scottish Fold",
    bookedDate: "August 8",
  },
  {
    id: 2,
    name: "Yuki",
    image: "/images/cat.png", // no yuki image exists — using a placeholder for now
    breed: "Scottish Fold",
    age: "5 Months (Kitten)",
    bookedDate: "August 8",
  },
  {
    id: 3,
    name: "Chewy",
    image: "/images/chewy.png",
    breed: "Scottish Fold",
    bookedDate: "August 8",
  },
  {
    id: 4,
    name: "Haru",
    image: "/images/haru1.png",
    breed: "Scottish Fold",
    bookedDate: "August 8",
  },
  {
    id: 5,
    name: "Haru",
    image: "/images/haru2.png",
    breed: "Scottish Fold",
    bookedDate: "August 8",
  },
];

function LikedPetCard({
  pet,
  onDelete,
}: {
  pet: LikedPet;
  onDelete: (id: number) => void;
}) {
  const [liked, setLiked] = useState(true);

  return (
    <div className="liked-card">
      <div className="liked-card__image">
        <img src={pet.image} alt={pet.name} />
      </div>

      <div className="liked-card__body">
        <div className="liked-card__title-row">
          <h3>{pet.name}</h3>
          <button
            className="liked-card__heart"
            aria-label={liked ? "Unlike" : "Like"}
            onClick={() => setLiked((l) => !l)}
          >
            <Heart
              size={18}
              fill={liked ? "#f26d6d" : "none"}
              stroke="#f26d6d"
            />
          </button>
        </div>

        <p className="liked-card__meta">Breed: {pet.breed}</p>
        {pet.age && <p className="liked-card__meta">Age: {pet.age}</p>}

        <p className="liked-card__booked">Booked {pet.bookedDate}</p>

        <div className="liked-card__actions">
          <button className="btn btn--book-again">Book Again</button>
          <button
            className="btn btn--delete"
            onClick={() => onDelete(pet.id)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Favorites() {
  const [likedPets, setLikedPets] = useState(LIKED_PETS);

  const handleDelete = (id: number) => {
    setLikedPets((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <>
      <Navbar />

      <main className="favorites-page">
        <section className="favorites-section">
          <h1 className="favorites-heading">Booking History</h1>

          {BOOKINGS.length === 0 ? (
            <p className="favorites-empty">You have no past or upcoming bookings.</p>
          ) : (
            <div className="booking-list">
              {BOOKINGS.map((b) => (
                <div key={b.id} className="booking-row">
                  <img src={b.image} alt={b.petName} className="booking-row__img" />
                  <div className="booking-row__info">
                    <h4>{b.petName}</h4>
                    <p>{b.breed}</p>
                  </div>
                  <span className="booking-row__date">{b.date}</span>
                  <span className={`booking-status booking-status--${b.status.toLowerCase()}`}>
                    {b.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="favorites-section">
          <h1 className="favorites-heading">Pets You Liked</h1>

          {likedPets.length === 0 ? (
            <p className="favorites-empty">You haven't liked any pets yet.</p>
          ) : (
            <div className="liked-grid">
              {likedPets.map((pet) => (
                <LikedPetCard key={pet.id} pet={pet} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}