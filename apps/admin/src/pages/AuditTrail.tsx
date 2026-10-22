import { useMemo, useState } from "react";

import { Eye, RefreshCw, Search, ShieldCheck } from "lucide-react";

import { useAuditLogs, type AuditLog } from "@repo/api";

import Header from "../components/Header";
import Modal from "../components/Modal";

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("en-PH", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function formatEntity(value: string): string {
  return value
    .split("_")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatAction(value: string): string {
  return value
    .split("_")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getActionStyle(action: string): string {
  switch (action.toLowerCase()) {
    case "created":
      return "bg-emerald-50 text-emerald-700";

    case "updated":
      return "bg-charlotte-50 text-charlotte-700";

    case "deleted":
      return "bg-red-50 text-red-700";

    case "signed_in":
      return "bg-blue-50 text-blue-700";

    case "signed_out":
      return "bg-amber-50 text-amber-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
}

function getChangedFields(log: AuditLog): string[] {
  if (!log.old_data || !log.new_data) {
    return [];
  }

  const ignoredFields = new Set(["created_at", "updated_at"]);

  const oldFields = Object.keys(log.old_data);

  const newFields = Object.keys(log.new_data);

  const fields = Array.from(new Set([...oldFields, ...newFields]));

  return fields.filter((field) => {
    if (ignoredFields.has(field)) {
      return false;
    }

    const oldValue = log.old_data?.[field];

    const newValue = log.new_data?.[field];

    return JSON.stringify(oldValue) !== JSON.stringify(newValue);
  });
}

function JsonViewer({
  title,
  value,
}: {
  title: string;
  value: Record<string, unknown> | null;
}) {
  if (!value) {
    return null;
  }

  return (
    <section>
      <h3 className="mb-2 text-sm font-semibold text-gray-700">{title}</h3>

      <pre
        className="
          max-h-72 overflow-auto
          whitespace-pre-wrap wrap-break-word
          rounded-xl bg-gray-950
          p-4 text-xs leading-5
          text-gray-100
        "
      >
        {JSON.stringify(value, null, 2)}
      </pre>
    </section>
  );
}

export default function AuditTrail() {
  const {
    data: logs = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useAuditLogs();

  const [searchTerm, setSearchTerm] = useState("");

  const [actionFilter, setActionFilter] = useState("all");

  const [entityFilter, setEntityFilter] = useState("all");

  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const actions = useMemo<string[]>(() => {
    const values = logs.map((log: AuditLog) => log.action);

    return Array.from(new Set(values)).sort((first, second) =>
      first.localeCompare(second),
    );
  }, [logs]);

  const entities = useMemo<string[]>(() => {
    const values = logs.map((log: AuditLog) => log.entity_type);

    return Array.from(new Set(values)).sort((first, second) =>
      first.localeCompare(second),
    );
  }, [logs]);

  const filteredLogs = useMemo<AuditLog[]>(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return logs.filter((log: AuditLog) => {
      if (actionFilter !== "all" && log.action !== actionFilter) {
        return false;
      }

      if (entityFilter !== "all" && log.entity_type !== entityFilter) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      const searchableValue = [
        log.admin_email ?? "",
        log.action,
        log.entity_type,
        log.entity_id ?? "",
      ]
        .join(" ")
        .toLowerCase();

      return searchableValue.includes(normalizedSearch);
    });
  }, [logs, searchTerm, actionFilter, entityFilter]);

  const changedFields = selectedLog ? getChangedFields(selectedLog) : [];

  return (
    <div className="min-h-screen flex-1 bg-gray-50">
      <Header title="AUDIT TRAIL" />

      <main className="p-8">
        <div
          className="
            mb-6 flex flex-wrap
            items-center justify-between
            gap-4
          "
        >
          <div>
            <h1 className="text-xl font-bold text-gray-800">
              Administrator Activity
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              View the history of important changes made by administrators.
            </p>
          </div>

          <button
            type="button"
            disabled={isFetching}
            onClick={() => {
              void refetch();
            }}
            className="
              inline-flex items-center
              gap-2 rounded-xl border
              border-gray-200 bg-white
              px-4 py-2.5 text-sm
              font-semibold text-gray-600
              shadow-sm transition
              hover:bg-gray-50
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            <RefreshCw size={16} className={isFetching ? "animate-spin" : ""} />

            {isFetching ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        <section
          className="
            mb-6 grid gap-3 rounded-2xl
            border border-gray-100
            bg-white p-4 shadow-sm
            md:grid-cols-[1fr_auto_auto]
          "
        >
          <label className="relative">
            <span className="sr-only">Search audit records</span>

            <Search
              size={17}
              className="
                pointer-events-none
                absolute left-3 top-1/2
                -translate-y-1/2
                text-gray-400
              "
            />

            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search administrator, action, or record..."
              className="
                w-full rounded-xl border
                border-gray-200 py-2.5
                pl-10 pr-4 text-sm
                outline-none transition
                focus:border-charlotte-400
                focus:ring-2
                focus:ring-charlotte-100
              "
            />
          </label>

          <label>
            <span className="sr-only">Filter by action</span>

            <select
              value={actionFilter}
              onChange={(event) => setActionFilter(event.target.value)}
              className="
                w-full rounded-xl border
                border-gray-200 bg-white
                px-4 py-2.5 text-sm
                outline-none transition
                focus:border-charlotte-400
              "
            >
              <option value="all">All actions</option>

              {actions.map((action: string) => (
                <option key={action} value={action}>
                  {formatAction(action)}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="sr-only">Filter by module</span>

            <select
              value={entityFilter}
              onChange={(event) => setEntityFilter(event.target.value)}
              className="
                w-full rounded-xl border
                border-gray-200 bg-white
                px-4 py-2.5 text-sm
                outline-none transition
                focus:border-charlotte-400
              "
            >
              <option value="all">All modules</option>

              {entities.map((entity: string) => (
                <option key={entity} value={entity}>
                  {formatEntity(entity)}
                </option>
              ))}
            </select>
          </label>
        </section>

        {isLoading && (
          <div className="space-y-3">
            {Array.from({
              length: 5,
            }).map((_, index) => (
              <div
                key={index}
                className="
                  h-16 animate-pulse
                  rounded-xl bg-white
                  shadow-sm
                "
              />
            ))}
          </div>
        )}

        {isError && (
          <div
            className="
              rounded-2xl border
              border-red-100 bg-red-50
              p-6 text-center
            "
            role="alert"
          >
            <p className="text-sm text-red-700">
              {error instanceof Error
                ? error.message
                : "Could not load audit records."}
            </p>

            <button
              type="button"
              onClick={() => {
                void refetch();
              }}
              className="
                mt-4 rounded-xl
                bg-red-600 px-4 py-2
                text-sm font-semibold
                text-white
                hover:bg-red-700
              "
            >
              Try Again
            </button>
          </div>
        )}

        {!isLoading && !isError && filteredLogs.length === 0 && (
          <div
            className="
                rounded-2xl border
                border-dashed
                border-gray-200 bg-white
                px-6 py-14 text-center
              "
          >
            <ShieldCheck size={36} className="mx-auto text-gray-300" />

            <p className="mt-3 font-semibold text-gray-700">
              No audit records found
            </p>

            <p className="mt-1 text-sm text-gray-400">
              Administrator changes will appear here automatically.
            </p>
          </div>
        )}

        {!isLoading && !isError && filteredLogs.length > 0 && (
          <div
            className="
                overflow-hidden
                rounded-2xl border
                border-gray-100
                bg-white shadow-sm
              "
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead
                  className="
                      bg-gray-50 text-xs
                      uppercase tracking-wide
                      text-gray-400
                    "
                >
                  <tr>
                    <th className="px-5 py-4">Date and time</th>

                    <th className="px-5 py-4">Administrator</th>

                    <th className="px-5 py-4">Action</th>

                    <th className="px-5 py-4">Module</th>

                    <th className="px-5 py-4">Record</th>

                    <th className="px-5 py-4 text-right">Details</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredLogs.map((log: AuditLog) => (
                    <tr
                      key={log.audit_id}
                      className="transition hover:bg-gray-50/70"
                    >
                      <td
                        className="
                              whitespace-nowrap
                              px-5 py-4
                              text-gray-500
                            "
                      >
                        {formatDate(log.created_at)}
                      </td>

                      <td
                        className="
                              px-5 py-4
                              font-medium
                              text-gray-800
                            "
                      >
                        {log.admin_email ?? "Unknown administrator"}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`
                                inline-flex
                                rounded-full
                                px-2.5 py-1
                                text-xs
                                font-semibold
                                ${getActionStyle(log.action)}
                              `}
                        >
                          {formatAction(log.action)}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-gray-600">
                        {formatEntity(log.entity_type)}
                      </td>

                      <td
                        className="
                              px-5 py-4
                              font-mono text-xs
                              text-gray-500
                            "
                      >
                        {log.entity_id ?? "—"}
                      </td>

                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedLog(log)}
                          className="
                                inline-flex
                                items-center
                                gap-1.5
                                rounded-lg border
                                border-gray-200
                                px-3 py-1.5
                                text-xs
                                font-semibold
                                text-gray-600
                                transition
                                hover:bg-gray-50
                              "
                        >
                          <Eye size={14} />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      <Modal
        isOpen={Boolean(selectedLog)}
        onClose={() => setSelectedLog(null)}
        title="Audit Details"
      >
        {selectedLog && (
          <div
            className="
              max-h-[72vh]
              space-y-5
              overflow-y-auto pr-1
              text-sm
            "
          >
            <div
              className="
                grid grid-cols-1
                gap-3 rounded-xl
                bg-gray-50 p-4
                sm:grid-cols-2
              "
            >
              <div>
                <p className="text-xs text-gray-400">Administrator</p>

                <p
                  className="
                    mt-1 break-all
                    font-semibold
                    text-gray-700
                  "
                >
                  {selectedLog.admin_email ?? "Unknown"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">Date and time</p>

                <p className="mt-1 font-semibold text-gray-700">
                  {formatDate(selectedLog.created_at)}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">Action</p>

                <p className="mt-1 font-semibold text-gray-700">
                  {formatAction(selectedLog.action)}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">Module</p>

                <p className="mt-1 font-semibold text-gray-700">
                  {formatEntity(selectedLog.entity_type)}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">Record ID</p>

                <p className="mt-1 font-mono text-xs text-gray-700">
                  {selectedLog.entity_id ?? "—"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">Administrator ID</p>

                <p className="mt-1 break-all font-mono text-xs text-gray-700">
                  {selectedLog.admin_id ?? "—"}
                </p>
              </div>
            </div>

            {changedFields.length > 0 && (
              <section>
                <h3 className="mb-2 font-semibold text-gray-700">
                  Changed fields
                </h3>

                <div className="flex flex-wrap gap-2">
                  {changedFields.map((field: string) => (
                    <span
                      key={field}
                      className="
                          rounded-full
                          bg-charlotte-50
                          px-2.5 py-1
                          text-xs
                          font-semibold
                          text-charlotte-700
                        "
                    >
                      {formatEntity(field)}
                    </span>
                  ))}
                </div>
              </section>
            )}

            <JsonViewer title="Previous data" value={selectedLog.old_data} />

            <JsonViewer title="New data" value={selectedLog.new_data} />

            <JsonViewer
              title="Additional details"
              value={selectedLog.details}
            />
          </div>
        )}
      </Modal>
    </div>
  );
}
