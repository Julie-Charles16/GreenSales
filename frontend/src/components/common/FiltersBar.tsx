import React from "react";

interface FilterOption {
  value: string;
  label: string;
}

interface Props {
  search: string;
  setSearch: (value: string) => void;

  searchPlaceholder?: string;

  selects?: {
    value: string;
    setValue: (value: string) => void;
    placeholder: string;
    options: FilterOption[];
  }[];
}

const FiltersBar: React.FC<Props> = ({
  search,
  setSearch,
  searchPlaceholder = "Rechercher...",
  selects = [],
}) => {
  return (
    <div className="row mb-3 g-2">

      {/* Recherche */}
      <div className={`col-md-${selects.length ? 6 : 12}`}>
        <input
          className="form-control"
          placeholder={searchPlaceholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>


      {/* Selects dynamiques */}
      {selects.map((select, index) => (
        <div
          className={`col-md-${selects.length === 1 ? 6 : 3}`}
          key={index}
        >
          <select
            className="form-select"
            value={select.value}
            onChange={(e) => select.setValue(e.target.value)}
          >
            <option value="">
              {select.placeholder}
            </option>

            {select.options.map((option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>
      ))}

    </div>
  );
};

export default FiltersBar;