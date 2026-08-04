import React from "react";

interface ViewOption<T extends string> {
  value: T;
  label: string;
}

interface Props<T extends string> {
  title: string;
  subtitle: string;

  view: T;
  setView: (view: T) => void;

  views: ViewOption<T>[];

  onAdd: () => void;
  canCreate: boolean;
  addIcon?: string;
}

const PageHeader = <T extends string>({
  title,
  subtitle,
  view,
  setView,
  views,
  onAdd,
  canCreate,
  addIcon = "bi-plus",
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


      <div className="d-flex gap-2">

        {views.length > 1 && (
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


        {canCreate && (
          <button
            className="btn btn-primary"
            onClick={onAdd}
          >
            <i className={`bi ${addIcon}`}></i>
          </button>
        )}

      </div>

    </div>
  );
};

export default PageHeader;