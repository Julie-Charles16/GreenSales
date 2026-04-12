interface Props {
  search: string;
  setSearch: (v: string) => void;
  filterCity: string;
  setFilterCity: (v: string) => void;
  filterStatus: string;
  setFilterStatus: (v: string) => void;
  cities: string[];
  statuses: string[];
}

const ClientsFilters: React.FC<Props> = ({
  search,
  setSearch,
  filterCity,
  setFilterCity,
  filterStatus,
  setFilterStatus,
  cities,
  statuses,
}) => {
  return (
    <div className="row mb-3 g-2">
      <div className="col-md-4">
        <input
          className="form-control"
          placeholder="Rechercher..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="col-md-4">
        <select
          className="form-select"
          value={filterCity}
          onChange={(e) => setFilterCity(e.target.value)}
        >
          <option value="">Toutes les villes</option>
          {cities.map((city) => (
            <option key={city}>{city}</option>
          ))}
        </select>
      </div>

      <div className="col-md-4">
        <select
          className="form-select"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">Tous statuts</option>
          {statuses.map((status) => (
            <option key={status}>{status}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ClientsFilters;