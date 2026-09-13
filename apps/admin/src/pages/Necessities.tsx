import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import Header from '../components/Header';
import DataTable from '../components/DataTable';

type Category = 'Pet Food' | 'Pet Bed' | 'Pet Toy' | 'Grooming' | 'Accessories';
type Status = 'Available' | 'Out of Stock';

interface InventoryItem {
  id: string;
  name: string;
  category: Category;
  price: number;
  quantity: number;
  status: Status;
}

const categories: Category[] = ['Pet Food', 'Pet Bed', 'Pet Toy', 'Grooming', 'Accessories'];

const namesByCategory: Record<Category, string[]> = {
  'Pet Food': ['Premium Cat Food', 'Grain-Free Dog Kibble', 'Guinea Pig Pellets', 'Timothy Hay Mix'],
  'Pet Bed': ['Cozy Orthopedic Bed', 'Plush Round Bed', 'Cooling Mat Bed'],
  'Pet Toy': ['Squeaky Chew Toy', 'Feather Wand', 'Puzzle Feeder Toy'],
  Grooming: ['Deshedding Brush', 'Nail Clipper Set', 'Oatmeal Shampoo'],
  Accessories: ['Adjustable Harness', 'Travel Carrier', 'Ceramic Water Fountain'],
};

// Placeholder catalog — swap for real inventory data once it exists.
const initialInventory: InventoryItem[] = Array.from({ length: 100 }, (_, i) => {
  const category = categories[i % categories.length];
  const names = namesByCategory[category];
  const quantity = i % 15; // some start at 0 to show "Out of Stock" on load
  return {
    id: `#${String(i + 1).padStart(4, '0')}`,
    name: names[i % names.length],
    category,
    price: Math.round((Math.random() * 40 + 5) * 100) / 100,
    quantity,
    status: quantity > 0 ? 'Available' : 'Out of Stock',
  };
});

export default function Inventory() {
  const [items, setItems] = useState<InventoryItem[]>(initialInventory);

  function changeQuantity(id: string, delta: number) {
    setItems((prev) =>
      prev.map((it) => {
        if (it.id !== id) return it;
        const newQuantity = Math.max(0, it.quantity + delta);
        let status = it.status;
        // Auto-flip status only when crossing the zero boundary either way.
        if (newQuantity === 0) status = 'Out of Stock';
        else if (it.quantity === 0 && newQuantity > 0) status = 'Available';
        return { ...it, quantity: newQuantity, status };
      })
    );
  }

  function toggleStatus(id: string) {
    setItems((prev) =>
      prev.map((it) =>
        it.id === id
          ? { ...it, status: it.status === 'Available' ? 'Out of Stock' : 'Available' }
          : it
      )
    );
  }

  return (
    <div className="flex-1 bg-gray-50">
      <Header title="NECESSITIES" />
      <div className="p-8">
        <h2 className="mb-4 text-base font-bold text-gray-800">Necessities</h2>
        <DataTable
          data={items}
          rowKey={(row) => row.id}
          columns={[
            { key: 'id', label: 'Product ID', render: (r) => <span className="text-gray-400">{r.id}</span> },
            { key: 'name', label: 'Name', render: (r) => <span className="font-medium text-gray-800">{r.name}</span> },
            { key: 'category', label: 'Category', render: (r) => <span className="text-gray-500">{r.category}</span> },
            { key: 'price', label: 'Price', render: (r) => <span className="text-gray-500">₱{r.price.toFixed(2)}</span> },
            {
              key: 'quantity',
              label: 'Quantity',
              render: (r) => (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => changeQuantity(r.id, -1)}
                    disabled={r.quantity === 0}
                    className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 text-gray-500 disabled:opacity-30"
                    aria-label={`Decrease quantity for ${r.name}`}
                  >
                    <Minus size={12} />
                  </button>
                  <span className="w-5 text-center font-semibold text-gray-700">{r.quantity}</span>
                  <button
                    onClick={() => changeQuantity(r.id, 1)}
                    className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 text-gray-500"
                    aria-label={`Increase quantity for ${r.name}`}
                  >
                    <Plus size={12} />
                  </button>
                </div>
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
                      : 'bg-rose-100 text-rose-600 hover:bg-rose-200'
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