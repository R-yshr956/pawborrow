import { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';

// Placeholder notifications — swap for real data once it exists.
const notifications = [
  { id: 1, text: 'New booking request from Anthony for Haru.', time: '5 min ago' },
  { id: 2, text: 'Guinea Pig stock is running low (2 left).', time: '1 hour ago' },
  { id: 3, text: 'Juan Omoya left a 5-star review.', time: '3 hours ago' },
  { id: 4, text: 'Appointment with Haru was cancelled.', time: 'Yesterday' },
];

export default function Header({ title }: { title: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="flex items-center justify-between border-b border-gray-100 bg-white px-8 py-5">
      <h1 className="text-lg font-bold tracking-wide text-gray-800">
        {title}
      </h1>

      <div className="flex items-center gap-3">
        <div className="relative" ref={ref}>
          <button
            onClick={() => setOpen((o) => !o)}
            className="relative flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50"
            aria-label="Notifications"
          >
            <Bell size={16} />
            <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-rose-500" />
          </button>

          {open && (
            <div className="absolute right-0 top-full z-40 mt-2 w-72 rounded-xl border border-gray-100 bg-white p-2 shadow-lg">
              <p className="px-3 py-2 text-xs font-semibold uppercase text-gray-400">
                Notifications
              </p>
              <div className="max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="rounded-lg px-3 py-2 text-sm hover:bg-gray-50">
                    <p className="text-gray-700">{n.text}</p>
                    <p className="mt-0.5 text-xs text-gray-400">{n.time}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-300 text-sm font-bold text-white">
          PB
        </div>
      </div>
    </header>
  );
}