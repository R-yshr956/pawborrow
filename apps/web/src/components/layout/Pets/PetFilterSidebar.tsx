interface FilterItem {
  label: string;
  count: number;
}

interface FilterGroupProps {
  title: string;
  items: FilterItem[];
  selected?: string;
  onSelect: (label: string) => void;
}

function CheckboxFilterGroup({
  title,
  items,
  selected,
  onSelect,
}: FilterGroupProps) {
  return (
    <div className="filter-group">
      <h3>{title}</h3>

      <ul>
        {items.map((item) => (
          <li key={item.label}>
            <label>
              <input
                type="checkbox"
                checked={selected === item.label}
                onChange={() => onSelect(item.label)}
              />

              <span>{item.label}</span>
            </label>

            <span className="filter-count">
              {item.count}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const personalityTags = [
  "Friendly",
  "Playful",
  "Quiet",
  "Obedient",
  "Shy",
  "Loyal",
];

interface Props {
  categoryItems: FilterItem[];

  selectedCategory: string;
  selectedBreed: string;
  selectedPersonality: string;

  breedItems: FilterItem[];
  breedFilterTitle: string;

  showPersonality: boolean;

  onSelectCategory: (label: string) => void;
  onSelectBreed: (label: string) => void;
  onSelectPersonality: (label: string) => void;
}

export default function PetsFilterSidebar({
  categoryItems,
  selectedCategory,
  selectedBreed,
  selectedPersonality,
  breedItems,
  breedFilterTitle,
  showPersonality,
  onSelectCategory,
  onSelectBreed,
  onSelectPersonality,
}: Props) {
  return (
    <aside className="pets-filter-sidebar">


      <CheckboxFilterGroup
        title="Filter by categories"
        items={categoryItems}
        selected={selectedCategory}
        onSelect={onSelectCategory}
      />


      <CheckboxFilterGroup
        title={breedFilterTitle}
        items={breedItems}
        selected={selectedBreed}
        onSelect={onSelectBreed}
      />


      {showPersonality && (
        <div className="filter-group">

          <h3>
            Filter by personality
          </h3>

          <div className="personality-tags">

            {personalityTags.map((tag) => (
              <button
                type="button"
                key={tag}
                className={`personality-tag ${
                  selectedPersonality === tag
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  onSelectPersonality(tag)
                }
              >
                {tag}
              </button>
            ))}

          </div>

        </div>
      )}

    </aside>
  );
}