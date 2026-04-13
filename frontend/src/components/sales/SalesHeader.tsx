interface Props {
  view: "table" | "pipeline";
  setView: (view: "table" | "pipeline") => void;
  onAdd: () => void;
}

const SalesHeader: React.FC<Props> = ({ view, setView, onAdd }) => {
    return (
        <div className="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 className="fw-bold">Ventes</h2>
        <small className="text-muted">
          Suivez et gérez vos opportunités commerciales
        </small>
      </div>

      <div className="d-flex gap-2">
        <div className="btn-group">
          <button
            className={`btn ${view === "table" ? "btn-dark" : "btn-outline-dark"}`}
            onClick={() => setView("table")}
          >
            Tableau
          </button>

          <button
            className={`btn ${view === "pipeline" ? "btn-dark" : "btn-outline-dark"}`}
            onClick={() => setView("pipeline")}
          >
            Pipeline
          </button>
        </div>
        <button className="btn btn-primary" onClick={onAdd}>
          + Ajouter
        </button>
      </div>
    </div>
    );
};

export default SalesHeader;