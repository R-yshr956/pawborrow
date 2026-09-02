import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { IonContent, IonPage, IonIcon } from '@ionic/react';
import { chevronBackOutline, calendarOutline, locationOutline } from 'ionicons/icons';
import { specialists } from '../data/specialists';
import './DoctorDetails.css';

const DoctorDetails = () => {
  const { doctorId } = useParams<{ doctorId: string }>();
  const navigate = useNavigate();
  const doctor = specialists.find((d) => d.id === doctorId);

  // Defaults pre-select "Sun, 8" and "09:00" to match the reference screenshot
  const [selectedDay, setSelectedDay] = useState(doctor?.availableDays[2]?.date ?? '');
  const [selectedTime, setSelectedTime] = useState(doctor?.availableTimes[0] ?? '');

  if (!doctor) {
    return (
      <IonPage>
        <IonContent fullscreen className="doctor-content">
          <div className="doctor-not-found">
            <p>Doctor not found.</p>
            <button onClick={() => navigate('/service')}>Back to Service</button>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonContent fullscreen className="doctor-content">
        <div className="doctor-photo-wrap">
          <img className="doctor-photo" src={doctor.photo} alt={doctor.name} />
          <button className="doctor-back" aria-label="Go back" onClick={() => navigate('/service')}>
            <IonIcon icon={chevronBackOutline} />
          </button>
          <h1 className="doctor-photo-title">Pet</h1>
        </div>

        <div className="doctor-sheet">
          <p className="doctor-label">Name</p>
          <h2 className="doctor-name">{doctor.name}</h2>

          <div className="doctor-stats">
            <div className="doctor-stat">
              <p className="doctor-stat-label">Age</p>
              <p className="doctor-stat-value">{doctor.age}</p>
            </div>
            <div className="doctor-stat">
              <p className="doctor-stat-label">Price</p>
              <p className="doctor-stat-value">{doctor.price}</p>
            </div>
            <div className="doctor-stat">
              <p className="doctor-stat-label">Distance</p>
              <p className="doctor-stat-value">{doctor.distanceKm}</p>
            </div>
          </div>

          <h3 className="doctor-section-title">About</h3>
          <p className="doctor-about">{doctor.about}</p>

          <div className="doctor-days-header">
            <h3 className="doctor-section-title">Available Days</h3>
            <span className="doctor-month">
              <IonIcon icon={calendarOutline} />
              {doctor.availableMonth}
            </span>
          </div>
          <div className="doctor-days">
            {doctor.availableDays.map((d) => (
              <button
                key={d.date}
                className={`doctor-day ${selectedDay === d.date ? 'doctor-day--active' : ''}`}
                onClick={() => setSelectedDay(d.date)}
              >
                {d.day}, {d.date}
              </button>
            ))}
          </div>

          <h3 className="doctor-section-title">Available Time</h3>
          <div className="doctor-times">
            {doctor.availableTimes.map((t) => (
              <button
                key={t}
                className={`doctor-time ${selectedTime === t ? 'doctor-time--active' : ''}`}
                onClick={() => setSelectedTime(t)}
              >
                {t}
              </button>
            ))}
          </div>

          <button className="doctor-location-btn">
            <IonIcon icon={locationOutline} />
            See Location
          </button>

          <button className="doctor-book-btn">Book Now</button>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default DoctorDetails;
