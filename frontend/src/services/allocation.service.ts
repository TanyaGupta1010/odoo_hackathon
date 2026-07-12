const API = "http://localhost:5000/api";

export const allocationService = {
  async getAll() {
    const res = await fetch(`${API}/allocations`);
    return res.json();
  },

  async create(data: {
    assetId: number;
    employeeId: number;
    expectedReturnDate?: string;
    departmentId?: number;
  }) {
    const res = await fetch(`${API}/allocations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return res.json();
  },

  async getHistory(assetId: number) {
    const res = await fetch(`${API}/allocations/history/${assetId}`);
    return res.json();
  },

  async returnAsset(id: number) {
    const res = await fetch(`${API}/allocations/return/${id}`, {
      method: "PUT",
    });

    return res.json();
  },
};