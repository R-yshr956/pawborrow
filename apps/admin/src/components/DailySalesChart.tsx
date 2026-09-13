import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const data = [
  { day: 'June 30', sales: 480 },
  { day: 'Aug 1', sales: 1150 },
  { day: 'Aug 2', sales: 4450 },
  { day: 'Aug 5', sales: 1200 },
  { day: 'Aug 6', sales: 6700 },
  { day: 'Aug 7', sales: 4050 },
];

export default function DailySalesChart() {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-1 flex items-start justify-between">
        <div>
          <h2 className="text-base font-bold text-gray-800">Daily Sales</h2>
          <p className="text-xs text-gray-400">June 30 – Aug 7</p>
        </div>
        <select className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-600">
          <option>Export</option>
          <option>Export CSV</option>
          <option>Export PDF</option>
        </select>
      </div>

      <p className="mb-4 text-2xl font-extrabold text-green-500">₱6,700.58</p>

      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barSize={28}>
            <CartesianGrid vertical={false} stroke="#F1F1F1" />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: '#9CA3AF' }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: '#9CA3AF' }}
              tickFormatter={(v) => `₱${v}`}
            />
            <Bar dataKey="sales" fill="#8B7CF6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}