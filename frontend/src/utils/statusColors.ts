// ==============================
// CLIENTS
// ==============================

export const CLIENT_STATUS_COLORS: Record<string, string> = {
  PROSPECT: "secondary",
  NEGOCIATION: "warning",
  DEVIS_ENVOYE: "info",
  SIGNE: "success",
  PERDU: "danger",
};

export const CLIENT_STATUS_BORDER_COLORS: Record<string, string> = {
  PROSPECT: "#adb5bd",
  NEGOCIATION: "#f59f00",
  DEVIS_ENVOYE: "#339af0",
  SIGNE: "#20c997",
  PERDU: "#fa5252",
};

// ==============================
// VENTES
// ==============================

export const SALE_STATUS_COLORS: Record<string, string> = {
  EN_ATTENTE: "secondary",
  ANNULEE: "danger",
  TERMINEE: "success",
};

export const SALE_STATUS_BORDER_COLORS: Record<string, string> = {
  EN_ATTENTE: "#adb5bd",
  ANNULEE: "#fa5252",
  TERMINEE: "#20c997",
};

// ==============================
// RENDEZ-VOUS
// ==============================

export const APPOINTMENT_STATUS_COLORS: Record<string, string> = {
  PLANIFIE: "info",
  ANNULE: "warning",
  TERMINE: "success",
};

export const APPOINTMENT_STATUS_BORDER_COLORS: Record<string, string> = {
  PLANIFIE: "#339af0",
  ANNULE: "#f59f00",
  TERMINE: "#20c997",
};


export const getClientStatusColor = (status: string) =>
  CLIENT_STATUS_COLORS[status] ?? "secondary";

export const getClientStatusBorderColor = (status: string) =>
  CLIENT_STATUS_BORDER_COLORS[status] ?? "#adb5bd";

export const getSaleStatusColor = (status: string) =>
  SALE_STATUS_COLORS[status] ?? "secondary";

export const getSaleStatusBorderColor = (status: string) =>
  SALE_STATUS_BORDER_COLORS[status] ?? "#adb5bd";

export const getAppointmentStatusColor = (status: string) =>
  APPOINTMENT_STATUS_COLORS[status] ?? "secondary";

export const getAppointmentStatusBorderColor = (status: string) =>
  APPOINTMENT_STATUS_BORDER_COLORS[status] ?? "#adb5bd";