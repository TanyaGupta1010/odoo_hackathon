export interface Resource {
  id: number;
  assetTag: string;
  name: string;
  status: string;
}

export interface Employee {
  id: number;
  name: string;
}

export interface Booking {
  id: number;

  resourceId: number;
  employeeId: number;

  startTime: string;
  endTime: string;

  status: string;

  createdAt: string;

  resource: Resource;
  employee: Employee;
}

export interface CreateBookingDto {
  resourceId: number;
  employeeId: number;
  startTime: string;
  endTime: string;
}