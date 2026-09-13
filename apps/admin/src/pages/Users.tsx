import { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import Header from '../components/Header';

interface UserRow {
  id: string;
  username: string;
  email: string;
  totalSpent: number;
  role: 'Customer' | 'Seller' | 'Super Admin';
}

// Placeholder data — swap this out once real user data is available
// (e.g. fetched from @repo/api).
const allUsers: UserRow[] = Array.from({ length: 100 }, (_, i) => {
  const roles: UserRow['role'][] = ['Customer', 'Customer', 'Customer', 'Seller', 'Super Admin'];
  return {
    id: `#${String(i + 1).padStart(4, '0')}`,
    username: i === 0 ? 'Anthony Balungay' : `User ${i + 1}`,
    email: i === 0 ? 'qa..b@gmail.com' : `user${i + 1}@example.com`,
    totalSpent: Math.round(Math.random() * 100000),
    role: i === 0 ? 'Super Admin' : roles[i % roles.length],
  };
});

const PAGE_SIZE = 10;

const roleColor: Record<UserRow['role'], string> = {
  Customer: 'text-gray-500',
  Seller: 'text-sky-500',
  'Super Admin': 'text-amber-500',
};

export default function Users() {
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const totalPages = Math.ceil(allUsers.length / PAGE_SIZE);
  const start = (page - 1) * PAGE_SIZE;
  const pageRows = allUsers.slice(start, start + PAGE_SIZE);
  const allOnPageSelected = pageRows.every((u) => selected.has(u.id));

  function toggleRow(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleAllOnPage() {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allOnPageSelected) {
        pageRows.forEach((u) => next.delete(u.id));
      } else {
        pageRows.forEach((u) => next.add(u.id));
      }
      return next;
    });
  }

  return (
    <div className="flex-1 bg-gray-50">
      <Header title="USERS" />

      <div className="p-8">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-800">Users List</h2>
          </div>

          <button className="mb-4 flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600">
            All ({allUsers.length}) <ChevronDown size={14} />
          </button>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-xs uppercase tracking-wide text-gray-400">
                  <th className="w-10 py-3">
                    <input
                      type="checkbox"
                      checked={allOnPageSelected}
                      onChange={toggleAllOnPage}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                  </th>
                  <th className="py-3 font-semibold">User ID</th>
                  <th className="py-3 font-semibold">Username</th>
                  <th className="py-3 font-semibold">Email</th>
                  <th className="py-3 font-semibold">Total Spent ₱</th>
                  <th className="py-3 font-semibold">Role</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((user) => (
                  <tr key={user.id} className="border-b border-gray-50 last:border-0">
                    <td className="py-4">
                      <input
                        type="checkbox"
                        checked={selected.has(user.id)}
                        onChange={() => toggleRow(user.id)}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                    </td>
                    <td className="py-4 text-gray-400">{user.id}</td>
                    <td className="py-4 font-medium text-gray-800">{user.username}</td>
                    <td className="py-4 text-gray-500">{user.email}</td>
                    <td className="py-4 text-gray-500">₱{user.totalSpent.toLocaleString()}</td>
                    <td className={`py-4 font-semibold ${roleColor[user.role]}`}>{user.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex items-center justify-between text-xs text-gray-500">
            <span>
              SHOWING {start + 1}–{Math.min(start + PAGE_SIZE, allUsers.length)} of {allUsers.length} Entries
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 disabled:opacity-40"
                aria-label="Previous page"
              >
                <ChevronLeft size={14} />
              </button>
              <span className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-800 font-semibold text-gray-800">
                {page}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 disabled:opacity-40"
                aria-label="Next page"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}