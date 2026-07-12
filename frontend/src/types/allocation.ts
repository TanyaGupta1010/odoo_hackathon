export interface Asset {
  id: number;
  assetTag: string;
  name: string;
  status: string;
}

export interface Employee {
  id: number;
  name: string;
  email: string;
}

export interface Department {
  id: number;
  name: string;
}

export interface Allocation {
  id: number;
  asset: Asset;
  employee: Employee;
  department?: Department | null;
  allocatedAt: string;
  expectedReturnDate?: string | null;
  returnedAt?: string | null;
}

export interface Transfer {
  id: number;
  asset: Asset;
  fromEmployee: Employee;
  toEmployee: Employee;
  reason: string;
  status: string;
  createdAt: string;
}