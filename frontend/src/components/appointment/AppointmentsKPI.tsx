import type{ Appointment } from "../../types/appointment";

interface Props {
  appointments: Appointment[];
}

const AppointmentKPI: React.FC<Props> = ({ appointments }) => {
  const total = appointments.length;

  const planned = appointments.filter(a => a.status === "PLANIFIE").length;
  const done = appointments.filter(a => a.status === "TERMINE").length;
  const cancelled = appointments.filter(a => a.status === "ANNULE").length;

  return (
    <div className="row mb-3">
      
      <div className="col">
        <div className="card shadow-sm">
          <div className="card-body">
            <small className="text-muted">Total RDV</small>
            <h5>{total}</h5>
          </div>
        </div>
      </div>

      <div className="col">
        <div className="card shadow-sm">
          <div className="card-body">
            <small className="text-muted">Planifiés</small>
            <h5>{planned}</h5>
          </div>
        </div>
      </div>

      <div className="col">
        <div className="card shadow-sm">
          <div className="card-body">
            <small className="text-muted">Terminés</small>
            <h5>{done}</h5>
          </div>
        </div>
      </div>
      <div className="col">
        <div className="card shadow-sm">
          <div className="card-body">
            <small className="text-muted">Annulés</small>
            <h5>{cancelled}</h5>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AppointmentKPI;