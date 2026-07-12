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
    const res = await fetch(
      `${API}/allocations/history/${assetId}`
    );

    return res.json();
  },

  async returnAsset(
    id: number,
    condition = "Good",
    notes = ""
  ) {
    const res = await fetch(
      `${API}/allocations/${id}/return`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          condition,
          notes,
        }),
      }
    );

    return res.json();
  },

  async getAssets() {
    const res = await fetch(`${API}/assets`);
    const data = await res.json();

    return data.data ?? [];
  },

  async getEmployees() {
    const res = await fetch(`${API}/employees`);
    const data = await res.json();

    return data.data ?? [];
  },
};