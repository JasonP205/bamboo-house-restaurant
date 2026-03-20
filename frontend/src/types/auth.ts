export interface Customer {
  _id: string;
  displayName: string;
  email: string;
  role: "customer";
  tiers: "Sprout" | "Shoot" | "Stem" | "Grove" | "Legend";
  points: number;
  avatarUrl?: string;
}
export interface Staff {
  _id: string;
  staffId: string;
  displayName: string;
  role: "staff" | "manager";
  branchId: string;
  avatarUrl?: string;
  phoneNumber: string;
  dateOfJoining: string;
  gender: "male" | "female" | "other";
}
export interface CustomerRegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
export interface StaffRegisterData {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  gender: "male" | "female" | "other";
  securityCode: string;
  branchId?: string;
}
export interface CustomerLoginData {
  email: string;
  password: string;
}
export interface StaffLoginData {
  staffId: string;
  password: string;
}

export interface AuthState {
  loading: boolean;
  accessToken: string | null;
  user: Customer | Staff | null;
  role: string | null;
  branchId: string | null;
  setBranchId: (branchId: string) => void;
  setAccessToken: (token: string) => void;
  clearSession: () => void;
  staffLogin: (loginData: StaffLoginData) => Promise<void>;
  customerLogin: (loginData: CustomerLoginData) => Promise<void>;
  customerRegister: (
    data: CustomerRegisterData
  ) => Promise<void>;
  staffRegister: (
    data: StaffRegisterData
  ) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  fetchMe: () => Promise<void>;
}
