import persianPhoto from '../assets/images/breeds/cat/persian.png';
import siamesePhoto from '../assets/images/breeds/cat/siamese.png';
import mainCoonPhoto from '../assets/images/breeds/cat/maine-coon.png';
import placeholderPhoto from '../assets/images/utils/placeholder.png';

import labradorPhoto from '../assets/images/breeds/dog/labrador.png';
import germanShepherdPhoto from '../assets/images/breeds/dog/german-sheperd.png';
import beaglePhoto from '../assets/images/breeds/dog/beagle.png';

import hollandLopPhoto from '../assets/images/breeds/rabbit/holland-lop.png';
import netherlandDwarfPhoto from '../assets/images/breeds/rabbit/netherland-dwarf.png';

import americanGuineaPigPhoto from '../assets/images/breeds/guinea-pig/american.png';
import abyssinianGuineaPigPhoto from '../assets/images/breeds/guinea-pig/abyssinian.png';

export interface Breed {
  id: string;
  name: string;
  photo: string;
}

export interface AnimalCategory {
  id: string;
  label: string;
  breeds: Breed[];
}

const catBreeds: Breed[] = [
  { id: 'sphinx', name: 'Sphinx', photo: placeholderPhoto },
  { id: 'persian', name: 'Persian', photo: persianPhoto },
  { id: 'siamese', name: 'Siamese', photo: siamesePhoto },
  { id: 'british-shorthair', name: 'British Shorthair', photo: placeholderPhoto },
  { id: 'maine-coon', name: 'Maine Coon', photo: mainCoonPhoto },
];

const dogBreeds: Breed[] = [
  { id: 'golden-retriever', name: 'Golden Retriever', photo: placeholderPhoto },
  { id: 'corgi', name: 'Corgi', photo: placeholderPhoto },
  { id: 'poodle', name: 'Poodle', photo: placeholderPhoto },
  { id: 'shih-tzu', name: 'Shih Tzu', photo: placeholderPhoto },
  { id: 'labrador', name: 'Labrador', photo: labradorPhoto },
  { id: 'german-shepherd', name: 'German Shepherd', photo: germanShepherdPhoto },
  { id: 'beagle', name: 'Beagle', photo: beaglePhoto },
];

const rabbitBreeds: Breed[] = [
  { id: 'holland-lop', name: 'Holland Lop', photo: hollandLopPhoto },
  { id: 'netherland-dwarf', name: 'Netherland Dwarf', photo: netherlandDwarfPhoto },
  { id: 'rex', name: 'Rex', photo: placeholderPhoto },
];

const guineaPigBreeds: Breed[] = [
  { id: 'american', name: 'American', photo: americanGuineaPigPhoto },
  { id: 'abyssinian', name: 'Abyssinian', photo: abyssinianGuineaPigPhoto },
  { id: 'peruvian', name: 'Peruvian', photo: placeholderPhoto },
];

export const animalBreeds: AnimalCategory[] = [
  { id: 'cat', label: 'Cat', breeds: catBreeds },
  { id: 'dog', label: 'Dog', breeds: dogBreeds },
  { id: 'rabbit', label: 'Rabbit', breeds: rabbitBreeds },
  { id: 'guinea-pig', label: 'Guinea Pig', breeds: guineaPigBreeds },
];
