const API = "http://localhost:5000/api";

export const transferService = {
  async getAll() {
    const res = await fetch(`${API}/transfers`);
    return res.json();
  },

  async create(data: {
    assetId: number;
    fromEmployeeId: number;
    toEmployeeId: number;
    reason: string;
  }) {
    const res = await fetch(`${API}/transfers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return res.json();
  },

  async approve(
    id: number,
    approverId: number = 1
  ) {
    const res = await fetch(
      `${API}/transfers/${id}/approve`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          approverId,
        }),
      }
    );

    return res.json();
  },

  async reject(
    id: number,
    approverId: number = 1
  ) {
    const res = await fetch(
      `${API}/transfers/${id}/reject`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          approverId,
        }),
      }
    );

    return res.json();
  },
};