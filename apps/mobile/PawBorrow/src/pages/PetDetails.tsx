import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { IonContent, IonPage, IonIcon } from '@ionic/react';
import { chevronBackOutline, calendarOutline, locationOutline } from 'ionicons/icons';
import { pets } from '../data/pets';
import { useBookings } from '../context/BookingsContext';
import '../style/PetDetails.css';

const PetDetails = () => {
  const { petId } = useParams<{ petId: string }>();
  const navigate = useNavigate();
  const pet = pets.find((p) => p.id === petId);

  const [selectedDay, setSelectedDay] = useState(pet?.availableDays[2]?.date ?? '');
  const [selectedTime, setSelectedTime] = useState(pet?.availableTimes[0] ?? '');
  const { addBooking } = useBookings();

  if (!pet) {
    return (
      <IonPage>
        <IonContent fullscreen className="pet-details-content">
          <div className="pet-details-not-found">
            <p>Pet not found.</p>
            <button onClick={() => navigate('/dashboard')}>Back to Home</button>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  const handleBookNow = () => {
  const dayInfo = pet.availableDays.find((d) => d.date === selectedDay);
  navigate('/booking-review', {
    state: {
      type: 'pet',
      category: 'Cat',
      name: pet.name,
      subtitle: pet.breed,
      detail: `Age: ${pet.age}`,
      photo: pet.image,
      date: dayInfo ? `${dayInfo.day}, ${dayInfo.date} ${pet.availableMonth}` : pet.availableMonth,
      time: selectedTime,
    },
  });
};

  return (
    <IonPage>
      <IonContent fullscreen className="pet-details-content">
        <div className="pet-details-photo-wrap">
          <img className="pet-details-photo" src={pet.image} alt={pet.name} />
          <button className="pet-details-back" aria-label="Go back" onClick={() => navigate(-1)}>
            <IonIcon icon={chevronBackOutline} />
          </button>
          <h1 className="pet-details-photo-title">Pet</h1>
        </div>

        <div className="pet-details-sheet">
          <p className="pet-details-label">Name</p>
          <h2 className="pet-details-name">{pet.name}</h2>

          <div className="pet-details-stats">
            <div className="pet-details-stat">
              <p className="pet-details-stat-label">Name</p>
              <p className="pet-details-stat-value">{pet.name}</p>
            </div>
            <div className="pet-details-stat">
              <p className="pet-details-stat-label">Age</p>
              <p className="pet-details-stat-value">{pet.age}</p>
            </div>
            <div className="pet-details-stat">
              <p className="pet-details-stat-label">Breed</p>
              <p className="pet-details-stat-value">{pet.breed}</p>
            </div>
          </div>

          <h3 className="pet-details-section-title">About</h3>
          <p className="pet-details-about">{pet.about}</p>

          <div className="pet-details-days-header">
            <h3 className="pet-details-section-title">Available Days</h3>
            <span className="pet-details-month">
              <IonIcon icon={calendarOutline} />
              {pet.availableMonth}
            </span>
          </div>
          <div className="pet-details-days">
            {pet.availableDays.map((d) => (
              <button
                key={d.date}
                className={`pet-details-day ${selectedDay === d.date ? 'pet-details-day--active' : ''}`}
                onClick={() => setSelectedDay(d.date)}
              >
                {d.day}, {d.date}
              </button>
            ))}
          </div>

          <h3 className="pet-details-section-title">Available Time</h3>
          <div className="pet-details-times">
            {pet.availableTimes.map((t) => (
              <button
                key={t}
                className={`pet-details-time ${selectedTime === t ? 'pet-details-time--active' : ''}`}
                onClick={() => setSelectedTime(t)}
              >
                {t}
              </button>
            ))}
          </div>

          <button className="pet-details-book-btn" onClick={handleBookNow}>
            Book Now
          </button>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default PetDetails;