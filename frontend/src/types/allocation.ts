export interface Allocation {
  id: number;
  assetId: number;
  employeeId: number;
  allocatedAt: string;
  expectedReturnDate: string | null;
  returnedAt: string | null;

  asset: {
    id: number;
    name: string;
    assetTag: string;
  };

  employee: {
    id: number;
    name: string;
  };
}

export interface Transfer {
  id: number;
  assetId: number;

  asset: {
    name: string;
    assetTag: string;
  };

  fromEmployee: {
    name: string;
  };

  toEmployee: {
    name: string;
  };

  reason: string;

  status: "Pending" | "Approved" | "Rejected";
}