import { Link } from "react-router-dom";
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

const BOOKINGS: Booking[] = [
  {
    id: 1,
    petName: "Milo",
    image: "/images/featured-milo.jpg",
    breed: "Golden Retriever",
    date: "August 8",
    status: "Completed",
  },
  {
    id: 2,
    petName: "Buddy",
    image: "/images/featured-buddy.jpg",
    breed: "Labrador",
    date: "August 15",
    status: "Upcoming",
  },
];

export default function BookingHistory() {
  return (
    <>
      <Navbar />

      <main className="favorites-page">
        <div className="favorites-tabs">
          <Link to="/bookings" className="favorites-tab is-active">
            Booking History
          </Link>
          <Link to="/favorites" className="favorites-tab">
            Pets You Liked
          </Link>
        </div>

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
      </main>

      <Footer />
    </>
  );
}