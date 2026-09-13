import { IonIcon } from '@ionic/react';
import { searchOutline } from 'ionicons/icons';
import './SearchBar.css';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchBar = ({ value, onChange, placeholder = 'Search' }: SearchBarProps) => {
  return (
    <div className="search-bar">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      <button className="search-bar-btn" aria-label="Search" type="button">
        <IonIcon icon={searchOutline} />
      </button>
    </div>
  );
};

export default SearchBar;