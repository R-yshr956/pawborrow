import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { useBookings } from "@repo/api";
import "@/styles/Favorites.css";

export default function BookingHistory() {
  const navigate = useNavigate();
  const {
    data: bookings,
    isLoading,
    error,
  } = useBookings();

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

          {isLoading && (
            <p className="favorites-empty">Loading your bookings...</p>
          )}

          {error && (
            <p className="favorites-empty">
              Failed to load your bookings:{" "}
              {error instanceof Error ? error.message : String(error)}
            </p>
          )}

          {!isLoading && !error && (!bookings || bookings.length === 0) && (
            <p className="favorites-empty">
              You have no past or upcoming bookings.
            </p>
          )}

          {!isLoading && !error && bookings && bookings.length > 0 && (
            <div className="booking-list">
              {bookings.map((booking) => {
                const pet = booking.pet;
                const canReview =
                  booking.status.toLowerCase() === "completed";

                return (
                  <div key={booking.booking_id} className="booking-row">
                    <img
                      src={pet?.image_url ?? "/images/pet-placeholder.jpg"}
                      alt={pet?.name ?? "Pet"}
                      className="booking-row__img"
                    />

                    <div className="booking-row__info">
                      <h4>{pet?.name ?? "Unknown pet"}</h4>
                      <p>{pet?.breed ?? "Unknown breed"}</p>
                    </div>

                    <span className="booking-row__date">
                      {booking.reservation_date}
                    </span>

                    <span
                      className={`booking-status booking-status--${booking.status.toLowerCase()}`}
                    >
                      {booking.status}
                    </span>

                    {canReview && (
                      <button
                        className="booking-review-btn"
                        onClick={() =>
                          navigate(`/review/${booking.booking_id}`, {
                            state: { booking },
                          })
                        }
                      >
                        Review
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}