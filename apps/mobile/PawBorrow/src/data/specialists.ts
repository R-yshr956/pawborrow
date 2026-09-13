import drAnnaPhoto from '../assets/images/service/dr-anna-johanson.png';
import drVernonPhoto from '../assets/images/service/dr-vernon-chwe.png';

export interface AvailableDay {
  day: string;
  date: string;
}

export interface Specialist {
  id: string;
  name: string;
  specialty: string;
  rating: string;
  distance: string;
  photo: string;
  age: string;
  price: string;
  distanceKm: string;
  about: string;
  availableMonth: string;
  availableDays: AvailableDay[];
  availableTimes: string[];
}

export const specialists: Specialist[] = [
  {
    id: 'dr-anna-johanson',
    name: 'Dr. Anna Johanson',
    specialty: 'Veterinary Behavioral',
    rating: '4.8',
    distance: '1 km',
    photo: drAnnaPhoto,
    age: '11 years',
    price: '$250',
    distanceKm: '2.5 Km',
    about:
      'Dr. Maria Nalis is a highly experienced veterinarian with 11 years of dedicated practice, showcasing a profound commitment to animal health and welfare.',
    availableMonth: 'February, 2024',
    availableDays: [
      { day: 'Fri', date: '6' },
      { day: 'Sat', date: '7' },
      { day: 'Sun', date: '8' },
      { day: 'Mon', date: '9' },
      { day: 'Tue', date: '10' },
    ],
    availableTimes: ['09:00', '15:00', '19:00'],
  },
  {
    // TODO: placeholder content — swap in Dr. Vernon's real details once you have them
    id: 'dr-vernon-chwe',
    name: 'Dr. Vernon Chwe',
    specialty: 'Veterinary Surgery',
    rating: '4.9',
    distance: '15 km',
    photo: drVernonPhoto,
    age: '8 years',
    price: '$300',
    distanceKm: '15 Km',
    about:
      'Dr. Vernon Chwe specializes in veterinary surgery, bringing precision and care to every procedure with a focus on fast, safe recovery.',
    availableMonth: 'February, 2024',
    availableDays: [
      { day: 'Fri', date: '6' },
      { day: 'Sat', date: '7' },
      { day: 'Sun', date: '8' },
      { day: 'Mon', date: '9' },
      { day: 'Tue', date: '10' },
    ],
    availableTimes: ['10:00', '14:00', '18:00'],
  },
];