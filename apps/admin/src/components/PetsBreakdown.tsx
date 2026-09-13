import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';

const data = [
  { name: 'Cats', value: 7, fill: '#FB923C' },
  { name: 'Guinea Pig', value: 3, fill: '#38BDF8' },
  { name: 'Dogs', value: 5, fill: '#818CF8' },
  { name: 'Rabbits', value: 2, fill: '#1E293B' },
];

export default function PetsBreakdown() {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h2 className="text-base font-bold text-gray-800">20 Pets</h2>
      <p className="mb-2 text-xs text-gray-400">Available</p>

      <div className="relative h-56">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            innerRadius="30%"
            outerRadius="100%"
            data={data}
            startAngle={90}
            endAngle={-270}
          >
            <PolarAngleAxis type="number" domain={[0, 10]} tick={false} />
            <RadialBar dataKey="value" background={{ fill: '#F5F1EC' }} cornerRadius={8} />
          </RadialBarChart>
        </ResponsiveContainer>

        <div className="absolute inset-0 grid grid-cols-2 items-center px-2 text-xs">
          <div className="text-left">
            <p className="font-bold text-orange-400">7% <span className="font-normal text-gray-400">Cats</span></p>
            <p className="mt-16 font-bold text-indigo-400">5% <span className="font-normal text-gray-400">Dogs</span></p>
          </div>
          <div className="text-right">
            <p className="font-bold text-sky-400">3% <span className="font-normal text-gray-400">Guinea Pig</span></p>
            <p className="mt-16 font-bold text-slate-500">2% <span className="font-normal text-gray-400">Rabbits</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}