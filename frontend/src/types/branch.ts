export interface Branch {
  _id: string;
  name: string;
  location: string;
  openingHours: {
    mondayToFriday: {
      open: string;
      close: string;
    };
    saturdayAndSunday: {
      open: string;
      close: string;
    };
  };
  contactNumber: string;
}

export interface branchState {
  branches: Branch[];
  loading: boolean;
}
