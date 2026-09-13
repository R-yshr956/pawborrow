import Header from '../components/Header';
import DataTable from '../components/DataTable';

type OrderStatus = 'Pending' | 'Completed' | 'Cancelled';

interface OrderRow {
  id: string;
  customer: string;
  item: string;
  total: number;
  date: string;
  status: OrderStatus;
}

const customers = ['Anthony Balungay', 'Elaiza Bugayong', 'Yu Miura', 'Reyniel Santos', 'John Michael Uayan', 'Juan Omoya'];
const items = [
  'Premium Cat Food (x2)',
  'Cozy Orthopedic Bed',
  'Squeaky Chew Toy (x3)',
  'Guinea Pig Pellets',
  'Adjustable Harness',
  'Grooming Kit',
];
const statuses: OrderStatus[] = ['Pending', 'Completed', 'Completed', 'Cancelled'];

const statusColor: Record<OrderStatus, string> = {
  Pending: 'text-amber-500',
  Completed: 'text-emerald-500',
  Cancelled: 'text-rose-500',
};

// Placeholder orders — swap for real order data once it exists.
const orders: OrderRow[] = Array.from({ length: 100 }, (_, i) => ({
  id: `#${String(i + 1).padStart(4, '0')}`,
  customer: customers[i % customers.length],
  item: items[i % items.length],
  total: Math.round((Math.random() * 3000 + 200) * 100) / 100,
  date: new Date(2026, 7, (i % 28) + 1).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' }),
  status: statuses[i % statuses.length],
}));

export default function Order() {
  return (
    <div className="flex-1 bg-gray-50">
      <Header title="ORDER" />
      <div className="p-8">
        <h2 className="mb-4 text-base font-bold text-gray-800">Order</h2>
        <DataTable
          data={orders}
          rowKey={(row) => row.id}
          columns={[
            { key: 'id', label: 'Order ID', render: (r) => <span className="text-gray-400">{r.id}</span> },
            { key: 'customer', label: 'Customer', render: (r) => <span className="font-medium text-gray-800">{r.customer}</span> },
            { key: 'item', label: 'Item Ordered', render: (r) => <span className="text-gray-500">{r.item}</span> },
            { key: 'total', label: 'Total ₱', render: (r) => <span className="text-gray-500">₱{r.total.toFixed(2)}</span> },
            { key: 'date', label: 'Date', render: (r) => <span className="font-semibold text-amber-500">{r.date}</span> },
            { key: 'status', label: 'Status', render: (r) => <span className={`font-semibold ${statusColor[r.status]}`}>{r.status}</span> },
          ]}
        />
      </div>
    </div>
  );
}