import type { Role } from "../types/user";


/**
 * Vérifie si un utilisateur peut modifier
 * une donnée métier qui lui appartient
 */
export const canEditOwnData = (
  role: Role,
  ownerId: number,
  userId: number
): boolean => {

  // L'admin a uniquement un rôle de supervision
  if (role === "ADMIN") {
    return false;
  }

  // Manager et Commercial :
  // uniquement leurs propres données
  return ownerId === userId;
};



/**
 * Vérifie si un utilisateur peut supprimer
 * une donnée métier qui lui appartient
 */
export const canDeleteOwnData = (
  role: Role,
  ownerId: number,
  userId: number
): boolean => {

  if (role === "ADMIN") {
    return false;
  }

  return ownerId === userId;
};



/**
 * Vérifie si l'utilisateur est administrateur
 */
export const isAdmin = (role: Role): boolean => {
  return role === "ADMIN";
};



/**
 * Vérifie si l'utilisateur est manager
 */
export const isManager = (role: Role): boolean => {
  return role === "MANAGER";
};


/**
 * Vérifie si l'utilisateur est commercial
 */
export const isCommercial = (role: Role): boolean => {
  return role === "COMMERCIAL";
};

/**
 * Vérifie si l'utilisateur peut créer
 * une donnée métier
 */
export const canCreateBusinessData = (
  role: Role
): boolean => {
  return role !== "ADMIN";
};


/**
 * Vérifie si un utilisateur peut voir
 * les données d'un autre utilisateur
 */
export const canViewUserData = (
  role: Role,
  ownerId: number,
  userId: number
): boolean => {

  if (role === "ADMIN") {
    return true;
  }

  if (role === "MANAGER") {
    // temporairement :
    // on autorisera l'équipe quand on aura
    // la relation managerId
    return ownerId === userId;
  }

  return ownerId === userId;
};


export const getBusinessPermissions = (role: Role) => ({
  canCreate: role !== "ADMIN",
  canEdit: role !== "ADMIN",
  canDelete: role !== "ADMIN",
});


/** L'administration des comptes est réservée à l'administrateur. */
export const canManageUsers = (role: Role): boolean => role === "ADMIN";
