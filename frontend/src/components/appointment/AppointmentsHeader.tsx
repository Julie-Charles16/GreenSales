interface Props {
  view: "calendar" | "list" | "cards";
  setView: (view: "calendar" | "list" | "cards") => void;
  onAdd: () => void;
}

const AppointmentsHeader: React.FC<Props> = ({ view, setView, onAdd }) => {
  return (
    <div className="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 className="fw-bold">Rendez-vous</h2>
        <small className="text-muted">
          Gérez et suivez vos rendez-vous
        </small>
      </div>

      <div className="d-flex gap-2">
        <div className="btn-group">
          <button
            className={`btn ${view === "calendar" ? "btn-dark" : "btn-outline-dark"}`}
            onClick={() => setView("calendar")}
          >
            Calendrier
          </button>

          <button
            className={`btn ${view === "list" ? "btn-dark" : "btn-outline-dark"}`}
            onClick={() => setView("list")}
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
          <i className="bi bi-calendar-plus"></i>
          </button>
      </div>
    </div>
  );
};

export default AppointmentsHeader;