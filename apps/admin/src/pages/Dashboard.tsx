import { Users, LineChart, CheckCircle2, PawPrint } from 'lucide-react';
import Header from '../components/Header';
import StatCard from '../components/StatCard';
import DailySalesChart from '../components/DailySalesChart';
import PetsBreakdown from '../components/PetsBreakdown';

export default function Dashboard() {
  return (
    <div className="flex-1 bg-gray-50">
      <Header title="DASHBOARD" />

      <div className="p-8">
        <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={Users} value="1,677" label="Visitors" colorClass="bg-orange-400" />
          <StatCard icon={LineChart} value="₱10,000" label="Sales" colorClass="bg-sky-400" />
          <StatCard icon={CheckCircle2} value="100" label="Bookings" colorClass="bg-emerald-400" />
          <StatCard icon={PawPrint} value="20" label="Pets" colorClass="bg-indigo-400" />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <DailySalesChart />
          <PetsBreakdown />
        </div>
      </div>
    </div>
  );
}