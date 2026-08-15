interface ViewOption<T extends string> {
  value: T;
  label: string;
}

interface HeaderAction {
  label: string;
  icon?: string;
  onClick: () => void;
  variant?: string;
}

interface Props<T extends string> {
  title: string;
  subtitle: string;

  view?: T;
  setView?: (view: T) => void;
  views?: ViewOption<T>[];

  actions?: HeaderAction[];
}

const PageHeader = <T extends string>({
  title,
  subtitle,
  view,
  setView,
  views = [],
  actions = [],
}: Props<T>) => {
  return (
    <div className="d-flex justify-content-between align-items-center mb-4">

      <div>
        <h2 className="fw-bold">
          {title}
        </h2>

        <small className="text-muted">
          {subtitle}
        </small>
      </div>

      {(
        (views.length > 1 && view && setView) ||
        actions.length > 0
      ) && (
        <div className="d-flex gap-2">

          {views.length > 1 && view && setView && (
            <div className="btn-group">
              {views.map((item) => (
                <button
                  key={item.value}
                  className={`btn ${
                    view === item.value
                      ? "btn-dark"
                      : "btn-outline-dark"
                  }`}
                  onClick={() => setView(item.value)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}

          {actions.map((action) => (
            <button
              key={action.label}
              className={`btn ${action.variant ?? "btn-dark"}`}
              onClick={action.onClick}
            >
              {action.icon && (
                <i className={`bi ${action.icon} me-2`}></i>
              )}

              {action.label}
            </button>
          ))}

        </div>
      )}
    </div>
  );
};

export default PageHeader;