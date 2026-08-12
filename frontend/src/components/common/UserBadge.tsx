import type { Role } from "../../types/user";
import { roleConfig } from "../../utils/roleConfig";

interface UserBadgeProps {
  pseudo: string;
  role: Role;
}

const UserBadge: React.FC<UserBadgeProps> = ({ pseudo, role }) => {
  const config = roleConfig[role];

  return (
    <span
      className={`badge bg-${config.color} bg-opacity-10 text-${config.color}`}
    >
      <i className="bi bi-person-circle me-1" />
      {pseudo}
    </span>
  );
};

export default UserBadge;