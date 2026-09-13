import { popularFriends } from "@/components/layout/Pets/pets";

interface FilterGroupProps {
  title: string;
  items: { label: string; count: number }[];
  selected?: string;
  onSelect: (label: string) => void;
}

function CheckboxFilterGroup({ title, items, selected, onSelect }: FilterGroupProps) {
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
            <span className="filter-count">{item.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const categoryItems = [
  { label: "Cat", count: 21 },
  { label: "Dog", count: 28 },
  { label: "Guinea Pig", count: 12 },
  { label: "Rabbit", count: 12 },
  { label: "Pet Food", count: 14 },
  { label: "Bed & Comfort", count: 10 },
  { label: "Pet Toys", count: 13 },
];

const personalityTags = [
  "Friendly", "Playful", "Quiet", "Obedient", "Shy", "Loyal",
];

interface Props {
  selectedCategory: string;
  selectedBreed: string;
  selectedPersonality: string;
  breedItems: { label: string; count: number }[];
  breedFilterTitle: string;
  showPersonality: boolean;
  onSelectCategory: (label: string) => void;
  onSelectBreed: (label: string) => void;
  onSelectPersonality: (label: string) => void;
}

export default function PetsFilterSidebar({
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
          <h3>Filter by personality</h3>
          <div className="personality-tags">
            {personalityTags.map((tag) => (
              <button
                key={tag}
                className={`personality-tag ${selectedPersonality === tag ? "active" : ""}`}
                onClick={() => onSelectPersonality(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="filter-group">
        <h3>Popular Paw Friend</h3>
        <ul className="popular-friends">
          {popularFriends.map((friend) => (
            <li key={friend.name}>
              <img src={friend.image} alt={friend.name} className="friend-thumb" />
              <div>
                <strong>{friend.name}</strong>
                <span>Breed: {friend.breed || "—"}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}