import { useMemo, useState, type FormEvent } from "react";
import { FilePenLine, Globe2, Plus, Search, Trash2 } from "lucide-react";
import {
  useCmsContent,
  useCreateCmsContent,
  useDeleteCmsContent,
  useUpdateCmsContent,
  type CmsContent,
  type CmsContentInput,
  type CmsContentType,
} from "@repo/api";

import Header from "../components/Header";
import Modal from "../components/Modal";

const contentTypes: Array<{
  value: CmsContentType;
  label: string;
}> = [
  { value: "page", label: "Static Page" },
  { value: "banner", label: "Banner" },
  { value: "announcement", label: "Announcement" },
  { value: "faq", label: "FAQ" },
];

const emptyForm: CmsContentInput = {
  content_key: "",
  content_type: "page",
  title: "",
  body: "",
  image_url: "",
  link_url: "",
  is_published: false,
  sort_order: 0,
  metadata: {},
};

function createKey(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getTypeLabel(value: CmsContentType) {
  return contentTypes.find((item) => item.value === value)?.label ?? value;
}

export default function Cms() {
  const { data: content = [], isLoading, isError, error } = useCmsContent();

  const createContent = useCreateCmsContent();
  const updateContent = useUpdateCmsContent();
  const deleteContent = useDeleteCmsContent();

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | CmsContentType>("all");
  const [editing, setEditing] = useState<CmsContent | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<CmsContentInput>(emptyForm);
  const [formError, setFormError] = useState("");

  const filteredContent = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return content.filter((item: CmsContent) => {
      if (typeFilter !== "all" && item.content_type !== typeFilter) {
        return false;
      }

      if (!search) return true;

      return [item.title, item.content_key, item.body, item.content_type]
        .join(" ")
        .toLowerCase()
        .includes(search);
    });
  }, [content, searchTerm, typeFilter]);

  const isSaving = createContent.isPending || updateContent.isPending;

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setFormError("");
    setModalOpen(true);
  }

  function openEdit(item: CmsContent) {
    setEditing(item);
    setForm({
      content_key: item.content_key,
      content_type: item.content_type,
      title: item.title,
      body: item.body,
      image_url: item.image_url ?? "",
      link_url: item.link_url ?? "",
      is_published: item.is_published,
      sort_order: item.sort_order,
      metadata: item.metadata,
    });
    setFormError("");
    setModalOpen(true);
  }

  function closeModal() {
    if (isSaving) return;
    setModalOpen(false);
    setEditing(null);
    setForm(emptyForm);
    setFormError("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");

    const normalizedKey = createKey(form.content_key || form.title);

    if (!normalizedKey || !form.title.trim()) {
      setFormError("Content key and title are required.");
      return;
    }

    const input: CmsContentInput = {
      ...form,
      content_key: normalizedKey,
      title: form.title.trim(),
      body: form.body.trim(),
      sort_order: Number.isFinite(form.sort_order) ? form.sort_order : 0,
    };

    const options = {
      onSuccess: closeModal,
      onError: (cause: unknown) => {
        setFormError(
          cause instanceof Error ? cause.message : "Could not save content.",
        );
      },
    };

    if (editing) {
      updateContent.mutate({ contentId: editing.content_id, input }, options);
      return;
    }

    createContent.mutate(input, options);
  }

  function handleDelete(item: CmsContent) {
    const confirmed = window.confirm(
      `Delete “${item.title}”? This removes it from every PawBorrow screen using this content.`,
    );

    if (confirmed) {
      deleteContent.mutate(item.content_id);
    }
  }

  return (
    <div className="min-h-screen flex-1 bg-gray-50">
      <Header title="CONTENT MANAGEMENT" />

      <main className="p-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-800">
              Website and App Content
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Create, edit, publish, and organize PawBorrow content.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-sky-600"
          >
            <Plus size={17} />
            Add Content
          </button>
        </div>

        <section className="mb-6 flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm md:flex-row">
          <label className="relative flex-1">
            <Search
              size={17}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search content..."
              className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            />
          </label>

          <select
            value={typeFilter}
            onChange={(event) =>
              setTypeFilter(event.target.value as "all" | CmsContentType)
            }
            className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-sky-400"
          >
            <option value="all">All content types</option>
            {contentTypes.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </section>

        {isLoading && (
          <p className="rounded-2xl bg-white p-8 text-center text-sm text-gray-500">
            Loading content...
          </p>
        )}

        {isError && (
          <p className="rounded-2xl border border-red-100 bg-red-50 p-6 text-sm text-red-600">
            {error instanceof Error
              ? error.message
              : "Could not load CMS content."}
          </p>
        )}

        {deleteContent.isError && (
          <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {deleteContent.error instanceof Error
              ? deleteContent.error.message
              : "Could not delete content."}
          </p>
        )}

        {!isLoading && !isError && filteredContent.length === 0 && (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-14 text-center">
            <FilePenLine size={32} className="mx-auto text-gray-300" />
            <p className="mt-3 font-semibold text-gray-700">No content found</p>
            <p className="mt-1 text-sm text-gray-400">
              Add a page, banner, announcement, or FAQ.
            </p>
          </div>
        )}

        {!isLoading && !isError && filteredContent.length > 0 && (
          <div className="grid gap-4 lg:grid-cols-2">
            {filteredContent.map((item: CmsContent) => (
              <article
                key={item.content_id}
                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-sky-50 px-2.5 py-1 text-[11px] font-semibold text-sky-600">
                        {getTypeLabel(item.content_type)}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                          item.is_published
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {item.is_published ? "Published" : "Draft"}
                      </span>
                    </div>

                    <h2 className="mt-3 truncate text-base font-bold text-gray-800">
                      {item.title}
                    </h2>
                    <p className="mt-1 text-xs text-gray-400">
                      Key: {item.content_key}
                    </p>
                  </div>

                  <Globe2
                    size={20}
                    className={
                      item.is_published ? "text-emerald-500" : "text-gray-300"
                    }
                  />
                </div>

                <p className="mt-4 line-clamp-3 whitespace-pre-line text-sm leading-6 text-gray-600">
                  {item.body || "No body content."}
                </p>

                <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
                  <span className="text-xs text-gray-400">
                    Updated {new Date(item.updated_at).toLocaleDateString()}
                  </span>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => openEdit(item)}
                      className="inline-flex items-center gap-1 rounded-lg border border-sky-200 px-3 py-1.5 text-xs font-semibold text-sky-600 hover:bg-sky-50"
                    >
                      <FilePenLine size={14} />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item)}
                      disabled={deleteContent.isPending}
                      className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editing ? "Edit Content" : "Add Content"}
      >
        <form
          onSubmit={handleSubmit}
          className="max-h-[72vh] space-y-4 overflow-y-auto pr-1"
        >
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Content type
            </label>
            <select
              value={form.content_type}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  content_type: event.target.value as CmsContentType,
                }))
              }
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-sky-400"
            >
              {contentTypes.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              value={form.title}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  title: event.target.value,
                  content_key: editing
                    ? current.content_key
                    : createKey(event.target.value),
                }))
              }
              required
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-sky-400"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Unique key
            </label>
            <input
              value={form.content_key}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  content_key: createKey(event.target.value),
                }))
              }
              required
              placeholder="about-us"
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-sky-400"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Body
            </label>
            <textarea
              value={form.body}
              onChange={(event) =>
                setForm((current) => ({ ...current, body: event.target.value }))
              }
              rows={8}
              placeholder="Write the content shown to customers..."
              className="w-full resize-y rounded-xl border border-gray-200 px-3 py-2.5 text-sm leading-6 outline-none focus:border-sky-400"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Image URL
              </label>
              <input
                value={form.image_url ?? ""}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    image_url: event.target.value,
                  }))
                }
                placeholder="https://..."
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-sky-400"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Link URL
              </label>
              <input
                value={form.link_url ?? ""}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    link_url: event.target.value,
                  }))
                }
                placeholder="/pet-category"
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-sky-400"
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 rounded-xl bg-gray-50 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-gray-700">Published</p>
              <p className="text-xs text-gray-400">
                Visible to PawBorrow users
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={form.is_published}
              onClick={() =>
                setForm((current) => ({
                  ...current,
                  is_published: !current.is_published,
                }))
              }
              className={`relative h-6 w-11 rounded-full transition ${
                form.is_published ? "bg-sky-500" : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute top-0.5 size-5 rounded-full bg-white shadow transition ${
                  form.is_published ? "left-5.5" : "left-0.5"
                }`}
              />
            </button>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Display order
            </label>
            <input
              type="number"
              value={form.sort_order}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  sort_order: Number(event.target.value),
                }))
              }
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-sky-400"
            />
          </div>

          {formError && (
            <p
              role="alert"
              className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600"
            >
              {formError}
            </p>
          )}

          <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
            <button
              type="button"
              onClick={closeModal}
              disabled={isSaving}
              className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              {isSaving ? "Saving..." : editing ? "Save Changes" : "Create"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
