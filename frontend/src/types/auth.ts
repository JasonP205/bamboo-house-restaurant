import type { AddStaffFormData } from "@/components/branch/AddStaffForm";

export interface Staff {
  _id: string;
  staffId: string;
  email: string;
  displayName: string;
  role: "staff" | "manager";
  branchId?: string;
  avatarUrl?: string;
  dateOfJoining?: string;
  gender?: "male" | "female" | "other";
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
  deviceId: string | null;
  loading: boolean;
  accessToken: string | null;
  user: Staff | null;
  role: string | null;
  branchId: string | null;
  getDeviceId: () => void;
  setBranchId: (branchId: string) => void;
  setAccessToken: (token: string) => void;
  clearSession: () => void;
  staffLogin: (loginData: StaffLoginData) => Promise<void>;
  staffRegister: (
    data: AddStaffFormData
  ) => Promise<string>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  fetchMe: () => Promise<void>;
  uploadAvatar: (avatar: File) => Promise<void>;
}
