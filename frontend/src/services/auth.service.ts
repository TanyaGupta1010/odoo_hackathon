const API = "https://odoo-hackathon-oi06.onrender.com/api";

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  role: string;
};

type AuthResponse = {
  success: boolean;
  message?: string;
  data?: { token: string; user: AuthUser };
};

async function post(path: string, body: unknown): Promise<AuthResponse> {
  try {
    const res = await fetch(`${API}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return res.json();
  } catch {
    return { success: false, message: "Cannot reach the server. Is the backend running?" };
  }
}

export const authService = {
  signup: (data: { name: string; email: string; password: string }) =>
    post("/auth/signup", data),

  login: (data: { email: string; password: string }) =>
    post("/auth/login", data),

  google: (accessToken: string) => post("/auth/google", { accessToken }),
};
