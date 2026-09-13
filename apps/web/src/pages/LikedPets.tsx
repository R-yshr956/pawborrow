import { useState } from "react";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import "@/styles/Favorites.css";

interface LikedPet {
  id: number;
  name: string;
  image: string;
  breed: string;
  age?: string;
  bookedDate: string;
}

const LIKED_PETS: LikedPet[] = [
  {
    id: 1,
    name: "Nidra",
    image: "/images/nidra.png",
    breed: "Scottish Fold",
    bookedDate: "August 8",
  },
  {
    id: 2,
    name: "Yuki",
    image: "/images/yuki.png",
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

        <div className="liked-card__meta-block">
          <p className="liked-card__meta">Breed: {pet.breed}</p>
          {pet.age && <p className="liked-card__meta">Age: {pet.age}</p>}
        </div>

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

export default function LikedPets() {
  const [likedPets, setLikedPets] = useState(LIKED_PETS);

  const handleDelete = (id: number) => {
    setLikedPets((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <>
      <Navbar />

      <main className="favorites-page">
        <div className="favorites-tabs">
          <Link to="/bookings" className="favorites-tab">
            Booking History
          </Link>
          <Link to="/favorites" className="favorites-tab is-active">
            Pets You Liked
          </Link>
        </div>

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