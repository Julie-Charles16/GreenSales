import React from "react";

interface Props {
  activeTab: "mine" | "team";
  setActiveTab: (tab: "mine" | "team") => void;
  mineLabel?: string;
  teamLabel?: string;
}

const ManagerTabs: React.FC<Props> = ({
  activeTab,
  setActiveTab,
  mineLabel = "Mes données",
  teamLabel = "Équipe",
}) => {
  return (
    <div className="mb-3">
      <div className="btn-group">
        <button
          className={`btn ${
            activeTab === "mine"
              ? "btn-dark"
              : "btn-outline-dark"
          }`}
          onClick={() => setActiveTab("mine")}
        >
          {mineLabel}
        </button>

        <button
          className={`btn ${
            activeTab === "team"
              ? "btn-dark"
              : "btn-outline-dark"
          }`}
          onClick={() => setActiveTab("team")}
        >
          {teamLabel}
        </button>
      </div>
    </div>
  );
};

export default ManagerTabs;