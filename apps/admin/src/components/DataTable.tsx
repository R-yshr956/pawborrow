import {
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react";

export interface Column<T> {
  key: string;
  label: string;
  render?: (row: T) => ReactNode;
}

export interface TableFilterOption {
  value: string;
  label: string;
  count?: number;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  rowKey: (row: T) => string;
  pageSize?: number;
  filterValue?: string;
  filterOptions?: TableFilterOption[];
  onFilterChange?: (value: string) => void;
}

export default function DataTable<T>({
  data,
  columns,
  rowKey,
  pageSize = 10,
  filterValue = "all",
  filterOptions,
  onFilterChange,
}: DataTableProps<T>) {
  const [page, setPage] = useState(1);
  const [selected, setSelected] =
    useState<Set<string>>(new Set());

  const displayedFilterOptions =
    filterOptions && filterOptions.length > 0
      ? filterOptions
      : [
          {
            value: "all",
            label: "All",
            count: data.length,
          },
        ];

  const totalPages = Math.max(
    1,
    Math.ceil(data.length / pageSize)
  );

  useEffect(() => {
    setPage(1);
  }, [data, filterValue, pageSize]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const start = (page - 1) * pageSize;
  const pageRows = data.slice(
    start,
    start + pageSize
  );

  const allOnPageSelected =
    pageRows.length > 0 &&
    pageRows.every((row) =>
      selected.has(rowKey(row))
    );

  function toggleRow(key: string) {
    setSelected((previous) => {
      const next = new Set(previous);

      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }

      return next;
    });
  }

  function toggleAllOnPage() {
    setSelected((previous) => {
      const next = new Set(previous);

      if (allOnPageSelected) {
        pageRows.forEach((row) =>
          next.delete(rowKey(row))
        );
      } else {
        pageRows.forEach((row) =>
          next.add(rowKey(row))
        );
      }

      return next;
    });
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="relative mb-4 inline-block">
        <select
          value={filterValue}
          onChange={(event) =>
            onFilterChange?.(event.target.value)
          }
          disabled={!onFilterChange}
          aria-label="Filter table"
          className="cursor-pointer appearance-none rounded-lg border border-gray-200 bg-white py-1.5 pl-3 pr-8 text-sm text-gray-600 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100 disabled:cursor-default"
        >
          {displayedFilterOptions.map(
            (option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
                {option.count !== undefined
                  ? ` (${option.count})`
                  : ""}
              </option>
            )
          )}
        </select>

        <ChevronDown
          size={14}
          className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
        />
      </div>

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
                  aria-label="Select all rows on this page"
                />
              </th>

              {columns.map((column) => (
                <th
                  key={column.key}
                  className="py-3 font-semibold"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {pageRows.map((row) => {
              const key = rowKey(row);

              return (
                <tr
                  key={key}
                  className="border-b border-gray-50 last:border-0 hover:bg-gray-50"
                >
                  <td className="py-4">
                    <input
                      type="checkbox"
                      checked={selected.has(key)}
                      onChange={() =>
                        toggleRow(key)
                      }
                      className="h-4 w-4 rounded border-gray-300"
                      aria-label={`Select row ${key}`}
                    />
                  </td>

                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className="py-4"
                    >
                      {column.render
                        ? column.render(row)
                        : String(
                            (
                              row as Record<
                                string,
                                unknown
                              >
                            )[column.key] ?? ""
                          )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex items-center justify-between text-xs text-gray-500">
        <span>
          SHOWING{" "}
          {data.length === 0 ? 0 : start + 1}–
          {Math.min(
            start + pageSize,
            data.length
          )}{" "}
          OF {data.length} ENTRIES
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() =>
              setPage((current) =>
                Math.max(1, current - 1)
              )
            }
            disabled={page === 1}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 disabled:opacity-40"
            aria-label="Previous page"
          >
            <ChevronLeft size={14} />
          </button>

          <span className="flex h-7 min-w-7 items-center justify-center rounded-full border border-gray-800 px-2 font-semibold text-gray-800">
            {page}
          </span>

          <button
            type="button"
            onClick={() =>
              setPage((current) =>
                Math.min(
                  totalPages,
                  current + 1
                )
              )
            }
            disabled={page === totalPages}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 disabled:opacity-40"
            aria-label="Next page"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}