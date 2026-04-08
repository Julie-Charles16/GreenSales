export type SaleStatus = "EN_ATTENTE" | "ANNULEE" | "TERMINEE"

export interface Sale {
  id: number;
  amount: number;
  status: SaleStatus;
  commission: number;
  signedAt: string;
  clientId: number;
  userId: number;
}

export interface SaleFormData {
  amount: number;
  status: SaleStatus;
  clientId: number;
  userId: number;
}