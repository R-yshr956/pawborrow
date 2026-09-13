import placeholderPhoto from '../assets/images/utils/placeholder.png';

export interface Pet {
  id: string;
  name: string;
  animalId: string;
  breedId: string;
  image: string;
  age: string;
  breed: string;
  about: string;
  availableMonth: string;
  availableDays: { day: string; date: string }[];
  availableTimes: string[];
}

export const pets: Pet[] = [
  {
    id: 'yuki',
    name: 'Yuki',
    animalId: 'cat',
    breedId: 'persian',
    image: placeholderPhoto,
    age: '5 y/o',
    breed: 'Persian',
    about:
      'Yuki is a Persian-Breed Cat, a gentle, quiet, and affectionate pet that loves a calm home and relaxing on soft furniture.',
    availableMonth: 'February, 2024',
    availableDays: [
      { day: 'Fri', date: '6' },
      { day: 'Sat', date: '7' },
      { day: 'Sun', date: '8' },
      { day: 'Mon', date: '9' },
      { day: 'Tue', date: '10' },
    ],
    availableTimes: ['09.00', '15.00', '19.00'],
  },
  // TODO: placeholder entries — add real pets per breed as you have content for them
  {
    id: 'mochi',
    name: 'Mochi',
    animalId: 'cat',
    breedId: 'siamese',
    image: placeholderPhoto,
    age: '3 y/o',
    breed: 'Siamese',
    about:
      'Mochi is a Siamese cat, playful and vocal, who loves attention and following her owner from room to room.',
    availableMonth: 'February, 2024',
    availableDays: [
      { day: 'Fri', date: '6' },
      { day: 'Sat', date: '7' },
      { day: 'Sun', date: '8' },
      { day: 'Mon', date: '9' },
      { day: 'Tue', date: '10' },
    ],
    availableTimes: ['10.00', '14.00', '18.00'],
  },
];