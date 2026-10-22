import { forwardRef } from "react";
import { IonIcon } from "@ionic/react";
import { closeOutline, searchOutline } from "ionicons/icons";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
  ({ value, onChange, placeholder = "Search pets or categories" }, ref) => (
    <div className="flex h-12 w-full items-center gap-3 rounded-2xl border border-stone-200 bg-white px-4 transition focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100">
      <IonIcon icon={searchOutline} aria-hidden="true" className="shrink-0 text-xl text-stone-400" />
      <input
        ref={ref}
        type="search"
        aria-label="Search pets or categories"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 appearance-none border-0 bg-transparent text-sm text-stone-800 outline-none placeholder:text-stone-400 [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => onChange("")}
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-stone-400 transition hover:bg-orange-50 hover:text-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-400"
        >
          <IonIcon icon={closeOutline} aria-hidden="true" className="text-xl" />
        </button>
      )}
    </div>
  ),
);

SearchBar.displayName = "SearchBar";
export default SearchBar;
