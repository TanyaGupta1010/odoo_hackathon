import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { randomBytes } from "crypto";

import { prisma } from "../config/prisma";
import { env } from "../config/env";
import { SignupInput, LoginInput } from "../validators/auth.validator";

const httpError = (status: number, message: string) =>
  Object.assign(new Error(message), { status });

const SAFE_FIELDS = {
  id: true,
  name: true,
  email: true,
  role: true,
  departmentId: true,
  status: true,
} as const;

export class AuthService {
  static async signup({ name, email, password }: SignupInput) {
    const existing = await prisma.employee.findUnique({ where: { email } });
    if (existing) throw httpError(409, "An account with this email already exists");

    const passwordHash = await bcrypt.hash(password, 10);

    return prisma.employee.create({
      data: { name, email, passwordHash },
      select: SAFE_FIELDS,
    });
  }

  static async login({ email, password }: LoginInput) {
    const employee = await prisma.employee.findUnique({ where: { email } });
    if (!employee || employee.status !== "Active")
      throw httpError(401, "Invalid email or password");

    const ok = await bcrypt.compare(password, employee.passwordHash);
    if (!ok) throw httpError(401, "Invalid email or password");

    const { passwordHash, createdAt, ...user } = employee;
    return user;
  }

  static async googleLogin(accessToken: string) {
    if (!env.GOOGLE_CLIENT_ID) {
      throw httpError(500, "Google login is not configured");
    }

    // 1) Verify the token was actually issued for THIS app (audience binding).
    //    Without this, an access token minted for any other Google app would be accepted.
    const tokenInfoResp = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?access_token=${encodeURIComponent(accessToken)}`,
    );
    if (!tokenInfoResp.ok) throw httpError(401, "Could not verify Google token");

    const tokenInfo = (await tokenInfoResp.json()) as { aud?: string };
    if (tokenInfo.aud !== env.GOOGLE_CLIENT_ID) {
      throw httpError(401, "Google token was not issued for this app");
    }

    // 2) Fetch the profile.
    const resp = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!resp.ok) throw httpError(401, "Could not verify Google account");

    const profile = (await resp.json()) as {
      email?: string;
      name?: string;
      email_verified?: boolean | string;
    };

    // Only trust a verified email — otherwise an unverified Google email could
    // be used to link into (take over) an existing account.
    if (profile.email_verified !== true && profile.email_verified !== "true") {
      throw httpError(401, "Google email is not verified");
    }
    if (!profile.email) throw httpError(401, "Google account has no email");

    const email = profile.email.toLowerCase();
    const existing = await prisma.employee.findUnique({ where: { email } });

    const employee =
      existing ??
      (await prisma.employee.create({
        data: {
          name: profile.name || email.split("@")[0],
          email,
          // Google users authenticate via Google — store an unusable random hash.
          passwordHash: await bcrypt.hash(randomBytes(24).toString("hex"), 10),
        },
      }));

    if (employee.status !== "Active") throw httpError(403, "Account is inactive");

    const { passwordHash, createdAt, ...user } = employee;
    return user;
  }

  static async getById(id: number) {
    return prisma.employee.findUnique({
      where: { id },
      select: SAFE_FIELDS,
    });
  }

  static signToken(user: { id: number; role: string }) {
    return jwt.sign({ id: user.id, role: user.role }, env.JWT_SECRET, {
      expiresIn: "7d",
    });
  }
}
