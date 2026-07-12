import { apiFetch } from "./http";

export const allocationService = {
  getAll() {
    return apiFetch("/allocations");
  },

  create(data: {
    assetId: number;
    employeeId: number;
    expectedReturnDate?: string;
    departmentId?: number;
  }) {
    return apiFetch("/allocations", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  getHistory(assetId: number) {
    return apiFetch(`/allocations/history/${assetId}`);
  },

  returnAsset(id: number, condition = "Good", notes = "") {
    return apiFetch(`/allocations/${id}/return`, {
      method: "PATCH",
      body: JSON.stringify({ condition, notes }),
    });
  },

  async getAssets() {
    const data = await apiFetch("/assets");
    return data.data ?? [];
  },

  async getEmployees() {
    const data = await apiFetch("/employees");
    return data.data ?? [];
  },
};
