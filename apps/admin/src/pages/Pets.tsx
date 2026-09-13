import { useState } from 'react';
import Header from '../components/Header';
import DataTable from '../components/DataTable';

type PetCategory = 'Cat' | 'Dog' | 'Guinea Pig' | 'Rabbit';
type PetStatus = 'Available' | 'Unavailable';

interface PetRow {
  id: string;
  name: string;
  category: PetCategory;
  breed: string;
  age: number;
  personality: string;
  status: PetStatus;
}

const breedsByCategory: Record<PetCategory, string[]> = {
  Cat: ['Sphinx', 'Persian', 'Siamese', 'British Shorthair'],
  Dog: ['Golden Retriever', 'Corgi', 'Poodle', 'Shih Tzu'],
  'Guinea Pig': ['American', 'Abyssinian', 'Peruvian'],
  Rabbit: ['Holland Lop', 'Netherland Dwarf', 'Rex'],
};
const petNames = ['Haru', 'Mitski', 'Biscuit', 'Momo', 'Coco', 'Luna', 'Milo', 'Nala'];
const personalities = ['Chaotic', 'Gentle', 'Playful', 'Shy', 'Affectionate'];
const personalityColor: Record<string, string> = {
  Chaotic: 'text-rose-500',
  Gentle: 'text-emerald-500',
  Playful: 'text-sky-500',
  Shy: 'text-gray-500',
  Affectionate: 'text-amber-500',
};
const categories: PetCategory[] = ['Cat', 'Dog', 'Guinea Pig', 'Rabbit'];

// Placeholder pets — swap for real pet data once it exists.
const initialPets: PetRow[] = Array.from({ length: 100 }, (_, i) => {
  const category = categories[i % categories.length];
  const breeds = breedsByCategory[category];
  return {
    id: `#${String(i + 1).padStart(4, '0')}`,
    name: petNames[i % petNames.length],
    category,
    breed: breeds[i % breeds.length],
    age: (i % 10) + 1,
    personality: personalities[i % personalities.length],
    status: i % 5 === 0 ? 'Unavailable' : 'Available',
  };
});

export default function Pets() {
  const [pets, setPets] = useState<PetRow[]>(initialPets);

  function toggleStatus(id: string) {
    setPets((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status: p.status === 'Available' ? 'Unavailable' : 'Available' }
          : p
      )
    );
  }

  return (
    <div className="flex-1 bg-gray-50">
      <Header title="PET INVENTORY" />
      <div className="p-8">
        <DataTable
          data={pets}
          rowKey={(row) => row.id}
          columns={[
            { key: 'id', label: 'Pet ID', render: (r) => <span className="text-gray-400">{r.id}</span> },
            { key: 'name', label: 'Name', render: (r) => <span className="font-medium text-gray-800">{r.name}</span> },
            { key: 'category', label: 'Category', render: (r) => <span className="text-gray-500">{r.category}</span> },
            { key: 'breed', label: 'Breed', render: (r) => <span className="text-gray-500">{r.breed}</span> },
            { key: 'age', label: 'Age', render: (r) => <span className="font-semibold text-amber-500">{r.age}</span> },
            {
              key: 'personality',
              label: 'Personality',
              render: (r) => (
                <span className={`font-semibold ${personalityColor[r.personality]}`}>{r.personality}</span>
              ),
            },
            {
              key: 'status',
              label: 'Status',
              render: (r) => (
                <button
                  onClick={() => toggleStatus(r.id)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                    r.status === 'Available'
                      ? 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  {r.status}
                </button>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
}