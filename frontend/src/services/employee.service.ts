import { apiFetch } from "./http";

export type Employee = {
  id: number;
  name: string;
  email: string;
  role: string;
};

type ListResponse = { success: boolean; message?: string; data?: Employee[] };
type UpdateResponse = { success: boolean; message?: string; data?: Employee };

export const employeeService = {
  list: (): Promise<ListResponse> => apiFetch("/employees"),

  updateRole: (id: number, role: string): Promise<UpdateResponse> =>
    apiFetch(`/employees/${id}/role`, {
      method: "PATCH",
      body: JSON.stringify({ role }),
    }),
};
