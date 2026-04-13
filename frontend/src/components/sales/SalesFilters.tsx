interface Props {
    search: string;
    setSearch: (v: string) => void;
    filterStatus: string;
    setFilterStatus: (v: string) => void;
    statuses: string[];
}

const SalesFilters: React.FC<Props> = ({
    search,
    setSearch,
    filterStatus,
    setFilterStatus,
    statuses,
}) => {
    return (
        <div className="row mb-3 g-2">
        <div className="col-md-6">
          <input
            className="form-control"
            placeholder="Rechercher par client..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="col-md-6">
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

export default SalesFilters;