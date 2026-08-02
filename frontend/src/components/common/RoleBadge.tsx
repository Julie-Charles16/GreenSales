import type { Role } from "../../types/user";
import { roleConfig } from "../../utils/roleConfig";

interface Props {
  role: Role;
}

const RoleBadge: React.FC<Props> = ({ role }) => {
  const config = roleConfig[role];

  return (
    <span className={`badge bg-${config.color}`}>
      <i className={`${config.icon} me-1`} />
      {config.label}
    </span>
  );
};

export default RoleBadge;