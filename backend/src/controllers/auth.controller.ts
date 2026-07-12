import { Request, Response } from "express";

import { AuthService } from "../services/auth.service";
import { signupSchema, loginSchema } from "../validators/auth.validator";
import { AuthRequest } from "../middleware/auth.middleware";

export class AuthController {
  static async signup(req: Request, res: Response) {
    const parsed = signupSchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ success: false, message: parsed.error.issues[0].message });
    }

    const user = await AuthService.signup(parsed.data);
    const token = AuthService.signToken(user);

    res.status(201).json({ success: true, data: { token, user } });
  }

  static async login(req: Request, res: Response) {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ success: false, message: parsed.error.issues[0].message });
    }

    const user = await AuthService.login(parsed.data);
    const token = AuthService.signToken(user);

    res.json({ success: true, data: { token, user } });
  }

  static async google(req: Request, res: Response) {
    const accessToken = req.body?.accessToken;
    if (typeof accessToken !== "string" || !accessToken) {
      return res
        .status(400)
        .json({ success: false, message: "Missing Google access token" });
    }

    const user = await AuthService.googleLogin(accessToken);
    const token = AuthService.signToken(user);

    res.json({ success: true, data: { token, user } });
  }

  static async me(req: AuthRequest, res: Response) {
    const user = await AuthService.getById(req.user!.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, data: user });
  }

  static async logout(_req: Request, res: Response) {
    // JWT is stateless — the client discards the token on logout.
    res.json({ success: true, message: "Logged out" });
  }
}
