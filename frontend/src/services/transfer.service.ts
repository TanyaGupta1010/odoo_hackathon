import { apiFetch } from "./http";

export const transferService = {
  getAll() {
    return apiFetch("/transfers");
  },

  create(data: {
    assetId: number;
    fromEmployeeId: number;
    toEmployeeId: number;
    reason: string;
  }) {
    return apiFetch("/transfers", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  approve(id: number, approverId = 1) {
    return apiFetch(`/transfers/${id}/approve`, {
      method: "PATCH",
      body: JSON.stringify({ approverId }),
    });
  },

  reject(id: number, approverId = 1) {
    return apiFetch(`/transfers/${id}/reject`, {
      method: "PATCH",
      body: JSON.stringify({ approverId }),
    });
  },
};
