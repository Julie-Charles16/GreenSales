interface Props {
  view: "table" | "cards";
  setView: (view: "table" | "cards") => void;
  onAdd: () => void;
}

const ClientsHeader: React.FC<Props> = ({ view, setView, onAdd }) => {
  return (
    <div className="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 className="fw-bold">Clients</h2>
        <small className="text-muted">
          Gérez et suivez vos relations clients
        </small>
      </div>

      <div className="d-flex gap-2">
        <div className="btn-group">
          <button
            className={`btn ${view === "table" ? "btn-dark" : "btn-outline-dark"}`}
            onClick={() => setView("table")}
          >
            Liste
          </button>

          <button
            className={`btn ${view === "cards" ? "btn-dark" : "btn-outline-dark"}`}
            onClick={() => setView("cards")}
          >
            Cartes
          </button>
        </div>
        <button className="btn btn-primary" onClick={onAdd}>
          <i className="bi bi-person-plus"></i>
        </button>
      </div>
    </div>
  );
};

export default ClientsHeader;