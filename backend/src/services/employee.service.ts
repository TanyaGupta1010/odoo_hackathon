import { prisma } from "../config/prisma";

const httpError = (status: number, message: string) =>
  Object.assign(new Error(message), { status });

export const ROLES = ["Admin", "Asset Manager", "Department Head", "Employee"] as const;
export type Role = (typeof ROLES)[number];

export class EmployeeService {
  static async getAll() {
    return prisma.employee.findMany({
      where: {
        status: "Active",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
      orderBy: {
        name: "asc",
      },
    });
  }

  /** Change an employee's role. Admin-only (enforced at the route). */
  static async updateRole(id: number, role: string) {
    if (!ROLES.includes(role as Role)) {
      throw httpError(400, `Role must be one of: ${ROLES.join(", ")}`);
    }

    const employee = await prisma.employee.findUnique({ where: { id } });
    if (!employee) throw httpError(404, "Employee not found");

    return prisma.employee.update({
      where: { id },
      data: { role },
      select: { id: true, name: true, email: true, role: true },
    });
  }
}