import obedienceThumb from '../assets/images/training/obedience-courses.png';
import specialtyThumb from '../assets/images/training/specialty-classes.png';
import kindergartenThumb from '../assets/images/training/puppy-kindergarten.png';
import goodCitizenThumb from '../assets/images/training/canine-good-citizen.png';
import therapyThumb from '../assets/images/training/therapy-dogs.png';

export interface TrainingCourse {
  id: string;
  title: string;
  author: string;
  rating: string;
  reviews: string;
  thumbnail: string;
}

export const trainingCourses: TrainingCourse[] = [
  {
    id: 'obedience-courses',
    title: 'Obedience Courses',
    author: 'Jhon Smith',
    rating: '4.9',
    reviews: '335',
    thumbnail: obedienceThumb,
  },
  {
    id: 'specialty-classes',
    title: 'Specialty Classes & Workshops',
    author: 'Duke Fuzzington',
    rating: '5.0',
    reviews: '500',
    thumbnail: specialtyThumb,
  },
  {
    id: 'puppy-kindergarten',
    title: 'Puppy Kindergarten and Playgroups',
    author: 'Sir Huffington',
    rating: '5.0',
    reviews: '500',
    thumbnail: kindergartenThumb,
  },
  {
    id: 'canine-good-citizen',
    title: 'Canine Good Citizen Test',
    author: 'Baron Fuzzypaws',
    rating: '4.8',
    reviews: '220',
    thumbnail: goodCitizenThumb,
  },
  {
    id: 'therapy-dogs',
    title: 'Theraphy Dogs',
    author: 'Duke Fuzzington',
    rating: '5.0',
    reviews: '500',
    thumbnail: therapyThumb,
  },
];