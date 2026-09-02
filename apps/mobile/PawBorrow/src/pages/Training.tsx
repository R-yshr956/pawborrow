import { useNavigate } from 'react-router-dom';
import { IonContent, IonPage, IonIcon } from '@ionic/react';
import { chevronBackOutline, playOutline, star } from 'ionicons/icons';
import { trainingCourses } from '../data/trainingCourses';
import './Training.css';

const Training = () => {
  const navigate = useNavigate();

  return (
    <IonPage>
      <IonContent fullscreen className="training-content">
        <div className="training">
          <header className="training-header">
            <button className="training-back" aria-label="Go back" onClick={() => navigate('/dashboard')}>
              <IonIcon icon={chevronBackOutline} />
            </button>
            <h1>Training</h1>
          </header>

          <div className="training-list">
            {trainingCourses.map((course) => (
              <div className="training-card" key={course.id}>
                <div className="training-thumb">
                  <img src={course.thumbnail} alt={course.title} />
                  <button className="training-play" aria-label={`Play ${course.title}`}>
                    <IonIcon icon={playOutline} />
                  </button>
                </div>
                <div className="training-info">
                  <p className="training-title">{course.title}</p>
                  <p className="training-author">By {course.author}</p>
                  <div className="training-rating">
                    <IonIcon icon={star} />
                    <span>{course.rating}</span>
                    <span className="training-reviews">({course.reviews})</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Training;
