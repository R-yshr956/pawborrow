import placeholderPhoto from '../assets/images/utils/placeholder.png';
import petsPhoto from '../assets/images/shop/pets.png';
import foodsPhoto from '../assets/images/shop/foods.png';
import healthyPhoto from '../assets/images/shop/healthy.png';
import toysPhoto from '../assets/images/shop/toys.png';
import accessoriesPhoto from '../assets/images/shop/accessories.png';
import clothesPhoto from '../assets/images/shop/clothes.png';

export type ProductCategory = 'Pet Food' | 'Pet Bed' | 'Pet Toy' | 'Grooming' | 'Accessories';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  animals: string[];
  price: number;
  image: string;
  description: string;
}

export const products: Product[] = [
  {
    id: 'prod-food-1',
    name: 'Premium Cat Food',
    category: 'Pet Food',
    animals: ['Cat'],
    price: 220,
    image: foodsPhoto,
    description: 'Balanced nutrition for a healthy cat.',
  },
  {
    id: 'prod-food-2',
    name: 'Grain-Free Dog Kibble',
    category: 'Pet Food',
    animals: ['Dog'],
    price: 260,
    image: foodsPhoto,
    description: 'High-protein kibble made for active dogs.',
  },
  {
    id: 'prod-food-3',
    name: 'Guinea Pig Pellets',
    category: 'Pet Food',
    animals: ['Guinea Pig'],
    price: 180,
    image: foodsPhoto,
    description: 'Fiber-rich pellets for small pets.',
  },
  {
    id: 'prod-food-4',
    name: 'Timothy Hay Mix',
    category: 'Pet Food',
    animals: ['Rabbit', 'Guinea Pig'],
    price: 200,
    image: healthyPhoto,
    description: 'Fresh hay blend rich in fiber and nutrients.',
  },
  {
    id: 'prod-bed-1',
    name: 'Cozy Orthopedic Bed',
    category: 'Pet Bed',
    animals: ['Dog', 'Cat'],
    price: 680,
    image: healthyPhoto,
    description: 'Supportive cushion for rest and recovery.',
  },
  {
    id: 'prod-bed-2',
    name: 'Plush Round Bed',
    category: 'Pet Bed',
    animals: ['Cat', 'Rabbit'],
    price: 520,
    image: petsPhoto,
    description: 'Soft round bed for curling up in comfort.',
  },
  {
    id: 'prod-bed-3',
    name: 'Cooling Mat Bed',
    category: 'Pet Bed',
    animals: ['Dog', 'Cat'],
    price: 740,
    image: healthyPhoto,
    description: 'Keeps your pet cool during warm days.',
  },
  {
    id: 'prod-toy-1',
    name: 'Squeaky Chew Toy',
    category: 'Pet Toy',
    animals: ['Dog'],
    price: 150,
    image: toysPhoto,
    description: 'Durable chew toy for playful pups.',
  },
  {
    id: 'prod-toy-2',
    name: 'Feather Wand',
    category: 'Pet Toy',
    animals: ['Cat'],
    price: 120,
    image: toysPhoto,
    description: 'Interactive wand for fun and exercise.',
  },
  {
    id: 'prod-toy-3',
    name: 'Puzzle Feeder Toy',
    category: 'Pet Toy',
    animals: ['Dog', 'Cat'],
    price: 190,
    image: toysPhoto,
    description: 'Slow-feeder puzzle that encourages play.',
  },
  {
    id: 'prod-groom-1',
    name: 'Deshedding Brush',
    category: 'Grooming',
    animals: ['Dog', 'Cat'],
    price: 320,
    image: placeholderPhoto,
    description: 'Helps manage shedding and keep coats healthy.',
  },
  {
    id: 'prod-accessory-1',
    name: 'Adjustable Harness',
    category: 'Accessories',
    animals: ['Dog', 'Cat'],
    price: 450,
    image: accessoriesPhoto,
    description: 'Comfortable daily-use harness for walks.',
  },
  {
    id: 'prod-accessory-2',
    name: 'Travel Carrier',
    category: 'Accessories',
    animals: ['Cat', 'Rabbit', 'Guinea Pig'],
    price: 890,
    image: accessoriesPhoto,
    description: 'Secure and lightweight carrier for travel.',
  },
  {
    id: 'prod-accessory-3',
    name: 'Ceramic Water Fountain',
    category: 'Accessories',
    animals: ['Dog', 'Cat'],
    price: 650,
    image: clothesPhoto,
    description: 'Encourages hydration with fresh filtered water.',
  },
];

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  'Pet Food',
  'Pet Bed',
  'Pet Toy',
  'Grooming',
  'Accessories',
];

export const ANIMAL_FILTERS = ['Cat', 'Dog', 'Guinea Pig', 'Rabbit'];
