import { useState } from 'react';
import Header from '../components/Header';
import Modal from '../components/Modal';

type ApptStatus = 'Approved' | 'Cancelled' | 'Reschedule';

interface Appointment {
  id: number;
  pet: string;
  booker: string;
  status: ApptStatus;
  hasPhoto: boolean;
  start: string;
  end: string;
}

function MiniBars({ heights, highlightColor }: { heights: number[]; highlightColor: string }) {
  return (
    <div className="flex h-9 items-end gap-1">
      {heights.map((h, i) => (
        <div
          key={i}
          className="w-1.5 rounded-sm"
          style={{
            height: `${h}%`,
            backgroundColor: i === heights.length - 2 ? highlightColor : '#E5E7EB',
          }}
        />
      ))}
    </div>
  );
}

function CircularProgress({ percent, color }: { percent: number; color: string }) {
  const size = 44;
  const stroke = 5;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={radius} stroke="#F1F1F1" strokeWidth={stroke} fill="none" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={color}
        strokeWidth={stroke}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
      />
    </svg>
  );
}

const initialAppointments: Appointment[] = [
  { id: 1, pet: 'Haru', booker: 'Anthony', status: 'Approved', hasPhoto: true, start: '12:30 pm', end: '2:30 pm' },
  { id: 2, pet: 'Haru', booker: 'Anthony', status: 'Cancelled', hasPhoto: true, start: '12:30 pm', end: '2:30 pm' },
  { id: 3, pet: 'Haru', booker: 'Anthony', status: 'Reschedule', hasPhoto: false, start: '12:30 pm', end: '2:30 pm' },
];

const statusStyles: Record<ApptStatus, string> = {
  Approved: 'bg-yellow-200 text-yellow-800',
  Cancelled: 'bg-rose-200 text-rose-700',
  Reschedule: 'bg-sky-200 text-sky-700',
};

export default function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const selected = appointments.find((a) => a.id === selectedId) ?? null;

  function updateStatus(id: number, status: ApptStatus) {
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    setSelectedId(null);
  }

  return (
    <div className="flex-1 bg-gray-50">
      <Header title="Appointments" />
      <div className="p-8">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-base font-bold text-gray-800">Appointments</h2>

          <div className="mb-8 grid grid-cols-2 gap-8 sm:grid-cols-4">
            <div className="flex items-center gap-3">
              <MiniBars heights={[35, 55, 40, 90, 60]} highlightColor="#EC4899" />
              <div>
                <p className="text-xs text-gray-500">Total Appointments</p>
                <p className="text-lg font-bold text-gray-800">
                  11 <span className="text-xs font-normal text-gray-400">Today</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MiniBars heights={[30, 45, 35, 70, 50]} highlightColor="#34D399" />
              <div>
                <p className="text-xs text-gray-500">Online Bookings</p>
                <p className="text-lg font-bold text-gray-800">
                  12 <span className="text-xs font-normal text-gray-400">Today</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <CircularProgress percent={18} color="#34D399" />
              <div>
                <p className="text-xs text-gray-500">Pending Approval</p>
                <p className="text-lg font-bold text-gray-800">
                  2 <span className="text-xs font-normal text-gray-400">Today</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <CircularProgress percent={70} color="#A3E635" />
              <div>
                <p className="text-xs text-gray-500">Pet Occupancy</p>
                <p className="text-lg font-bold text-gray-800">
                  70% <span className="text-xs font-normal text-gray-400">Today</span>
                </p>
              </div>
            </div>
          </div>

          <h3 className="mb-4 text-sm font-bold text-gray-800">Upcoming Appointments</h3>
          <div className="mb-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {appointments.map((appt) => (
              <div key={appt.id} className="rounded-xl border border-gray-100 p-4 shadow-sm">
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`h-9 w-9 rounded-full ${appt.hasPhoto ? 'bg-amber-200' : 'bg-gray-200'}`} />
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{appt.pet}</p>
                      <p className="text-xs text-sky-500">Booker: {appt.booker}</p>
                    </div>
                  </div>
                  <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${statusStyles[appt.status]}`}>
                    {appt.status}
                  </span>
                </div>
                <div className="mb-3 flex justify-between text-xs">
                  <div>
                    <p className="text-sky-500">Session Start</p>
                    <p className="text-gray-500">{appt.start}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sky-500">Session End</p>
                    <p className="text-gray-500">{appt.end}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedId(appt.id)}
                  className="w-full rounded-lg border border-gray-200 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50"
                >
                  VIEW DETAILS
                </button>
              </div>
            ))}
          </div>

          <div className="mb-6">
            <h3 className="mb-2 text-sm font-bold text-gray-800">In progress</h3>
            <p className="text-xs text-gray-400">No sessions currently in progress.</p>
          </div>

          <div>
            <h3 className="mb-2 text-sm font-bold text-gray-800">Today</h3>
            <p className="text-xs text-gray-400">No further sessions scheduled for today.</p>
          </div>
        </div>
      </div>

      <Modal
        isOpen={selected !== null}
        onClose={() => setSelectedId(null)}
        title={selected ? `${selected.pet}'s Appointment` : undefined}
      >
        {selected && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className={`h-12 w-12 rounded-full ${selected.hasPhoto ? 'bg-amber-200' : 'bg-gray-200'}`} />
              <div>
                <p className="font-semibold text-gray-800">{selected.pet}</p>
                <p className="text-sm text-sky-500">Booker: {selected.booker}</p>
              </div>
              <span className={`ml-auto rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[selected.status]}`}>
                {selected.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 rounded-xl bg-gray-50 p-4 text-sm">
              <div>
                <p className="text-xs text-sky-500">Session Start</p>
                <p className="font-medium text-gray-700">{selected.start}</p>
              </div>
              <div>
                <p className="text-xs text-sky-500">Session End</p>
                <p className="font-medium text-gray-700">{selected.end}</p>
              </div>
            </div>

            <div>
              <p className="mb-1 text-xs font-semibold uppercase text-gray-400">Notes</p>
              <p className="text-sm text-gray-500">No additional notes for this booking yet.</p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => updateStatus(selected.id, 'Approved')}
                className="flex-1 rounded-lg bg-emerald-500 py-2 text-sm font-semibold text-white hover:bg-emerald-600"
              >
                Approve
              </button>
              <button
                onClick={() => updateStatus(selected.id, 'Reschedule')}
                className="flex-1 rounded-lg bg-sky-500 py-2 text-sm font-semibold text-white hover:bg-sky-600"
              >
                Reschedule
              </button>
              <button
                onClick={() => updateStatus(selected.id, 'Cancelled')}
                className="flex-1 rounded-lg bg-rose-500 py-2 text-sm font-semibold text-white hover:bg-rose-600"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}