import { prisma } from "../config/prisma";

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
}