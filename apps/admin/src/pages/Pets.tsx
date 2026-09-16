import { ChevronDown } from 'lucide-react';
import Header from '../components/Header';
import DataTable from '../components/DataTable';
import { useAdminPets, useUpdatePetStatus } from '@repo/api';
import type { Pet, PetStatus } from '@repo/api';

const petStatuses: PetStatus[] = ['available', 'unavailable', 'booked'];

const statusStyles: Record<PetStatus, string> = {
  available: 'bg-emerald-100 text-emerald-600',
  unavailable: 'bg-gray-200 text-gray-600',
  booked: 'bg-indigo-100 text-indigo-600',
};
const statusLabel: Record<PetStatus, string> = {
  available: 'Available',
  unavailable: 'Unavailable',
  booked: 'Booked',
};

const personalityPalette = [
  'text-rose-500',
  'text-emerald-500',
  'text-sky-500',
  'text-gray-500',
  'text-amber-500',
];
function personalityColor(tag: string) {
  let hash = 0;
  for (const ch of tag) hash = (hash * 31 + ch.charCodeAt(0)) % personalityPalette.length;
  return personalityPalette[hash];
}

function StatusSelect({
  pet,
  onChange,
  disabled,
}: {
  pet: Pet;
  onChange: (id: number, status: PetStatus) => void;
  disabled: boolean;
}) {
  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value as PetStatus;
    if (newStatus === pet.status) return;

    if (pet.status === 'booked') {
      const confirmed = window.confirm(
        `${pet.name} is currently marked as booked. Changing this here won't cancel any real reservation tied to it in the booking table — only do this if you're sure. Continue?`
      );
      if (!confirmed) return;
    }

    onChange(pet.id, newStatus);
  }

  return (
    <div className="relative inline-block">
      <select
        value={pet.status}
        onChange={handleChange}
        disabled={disabled}
        className={`cursor-pointer appearance-none rounded-full py-1 pl-3 pr-7 text-xs font-semibold outline-none disabled:opacity-50 ${statusStyles[pet.status]}`}
      >
        {petStatuses.map((s) => (
          <option key={s} value={s}>
            {statusLabel[s]}
          </option>
        ))}
      </select>
      <ChevronDown
        size={12}
        className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 opacity-60"
      />
    </div>
  );
}

export default function Pets() {
  const { data: pets, isLoading, isError, error } = useAdminPets();
  const updateStatus = useUpdatePetStatus();

  function handleStatusChange(petId: number, status: PetStatus) {
    updateStatus.mutate({ petId, status });
  }

  return (
    <div className="flex-1 bg-gray-50">
      <Header title="PET INVENTORY" />
      <div className="p-8">
        {isLoading && <p className="text-sm text-gray-500">Loading pets…</p>}

        {isError && (
          <p className="text-sm text-rose-500">
            Couldn't load pets: {(error as Error)?.message ?? 'Unknown error'}
          </p>
        )}

        {updateStatus.isError && (
          <p className="mb-3 text-sm text-rose-500">
            Couldn't update status — you may not have admin permissions.
          </p>
        )}

        {pets && (
          <DataTable
            data={pets}
            rowKey={(row) => row.id}
            columns={[
              {
                key: 'id',
                label: 'Pet ID',
                render: (r) => <span className="text-gray-400">#{r.id}</span>,
              },
              {
                key: 'name',
                label: 'Name',
                render: (r) => <span className="font-medium text-gray-800">{r.name}</span>,
              },
              {
                key: 'category',
                label: 'Category',
                render: (r) => <span className="text-gray-500">{r.category}</span>,
              },
              {
                key: 'breed',
                label: 'Breed',
                render: (r) => <span className="text-gray-500">{r.breed ?? '—'}</span>,
              },
              {
                key: 'hourlyRate',
                label: 'Rate/hr',
                render: (r) => (
                  <span className="font-semibold text-amber-500">
                    ₱{r.hourlyRate.toLocaleString()}
                  </span>
                ),
              },
              {
                key: 'personality',
                label: 'Personality',
                render: (r) => (
                  <div className="flex flex-wrap gap-1">
                    {r.personality.length === 0 && <span className="text-gray-400">—</span>}
                    {r.personality.map((tag) => (
                      <span key={tag} className={`font-semibold ${personalityColor(tag)}`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                ),
              },
              {
                key: 'status',
                label: 'Status',
                render: (r) => (
                  <StatusSelect
                    pet={r}
                    onChange={handleStatusChange}
                    disabled={updateStatus.isPending}
                  />
                ),
              },
            ]}
          />
        )}
      </div>
    </div>
  );
}