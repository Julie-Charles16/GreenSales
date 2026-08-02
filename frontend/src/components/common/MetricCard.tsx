type Props = {
  icon: string;
  label: string;
  value: string | number;
  color?: string;
};

const MetricCard = ({
  icon,
  label,
  value,
  color = "primary",
}: Props) => {
  return (
    <div className="col-md-3">
      <div className="card shadow-sm h-100 border-0">

        <div className="card-body">

          <div className={`text-${color} mb-2`}>
            <i className={`bi ${icon} fs-4`} />
          </div>

          <small className="text-muted d-block">
            {label}
          </small>

          <div className="fs-4 fw-bold">
            {value}
          </div>

        </div>

      </div>
    </div>
  );
};

export default MetricCard;