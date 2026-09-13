import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  value: string;
  label: string;
  colorClass: string; // e.g. "bg-orange-400"
}

export default function StatCard({ icon: Icon, value, label, colorClass }: StatCardProps) {
  return (
    <div className={`rounded-2xl p-6 text-white shadow-sm ${colorClass}`}>
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/25">
        <Icon size={20} />
      </div>
      <div className="text-3xl font-extrabold leading-tight">{value}</div>
      <div className="text-sm font-medium opacity-90">{label}</div>
    </div>
  );
}