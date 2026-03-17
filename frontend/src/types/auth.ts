export interface Customer {
  _id: string;
  displayName: string;
  email: string;
  role: "Customer";
  tiers: "Sprout" | "Shoot" | "Stem" | "Grove" | "Legend";
  points: number;
  avatarUrl?: string;
}
export interface Staff {
  _id: string;
  staffId: string;
  displayName: string;
  role: "Staff" | "Manager";
  branchId: string;
  avatarUrl?: string;
  phoneNumber: string;
  dateOfJoining: string;
  gender: "Male" | "Female" | "Other";
}
export interface CustomerRegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
export interface StaffRegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  gender: "Male" | "Female" | "Other";
  branchId: string;
}
export interface CustomerLoginData {
  email: string;
  password: string;
}
export interface StaffLoginData {
  staffNumber: string;
  password: string;
}

export interface AuthState {
  loading: boolean;
  accessToken: string | null;
  user: Customer | Staff | null;
  branchId: string | null;
  clearSession: () => void;
  staffLogin: (loginData: StaffLoginData) => Promise<void>;
  customerLogin: (loginData: CustomerLoginData) => Promise<void>;
  customerRegister: (
    data: CustomerRegisterData
  ) => Promise<void>;
  staffRegister: (
    data: StaffRegisterData
  ) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
  fetchMe: () => Promise<void>;
}
