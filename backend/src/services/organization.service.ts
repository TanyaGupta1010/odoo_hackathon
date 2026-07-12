import { prisma } from "../config/prisma";
import {
  CreateDepartmentInput,
  UpdateDepartmentInput,
  CreateCategoryInput,
  UpdateCategoryInput,
  UpdateEmployeeAssignmentInput,
} from "../validators/organization.validator";

export class OrganizationService {
  // --- Departments ---
  static async getDepartments() {
    return prisma.department.findMany({
      include: {
        head: {
          select: { id: true, name: true },
        },
        parentDepartment: {
          select: { id: true, name: true },
        },
      },
      orderBy: { name: "asc" },
    });
  }

  static async createDepartment(data: CreateDepartmentInput) {
    return prisma.department.create({
      data: {
        name: data.name,
        parentDepartmentId: data.parentDepartmentId ?? null,
        headId: data.headId ?? null,
        status: data.status ?? "Active",
      },
    });
  }

  static async updateDepartment(id: number, data: UpdateDepartmentInput) {
    return prisma.department.update({
      where: { id },
      data: {
        name: data.name,
        parentDepartmentId: data.parentDepartmentId !== undefined ? data.parentDepartmentId : undefined,
        headId: data.headId !== undefined ? data.headId : undefined,
        status: data.status,
      },
    });
  }

  // --- Categories ---
  static async getCategories() {
    return prisma.assetCategory.findMany({
      orderBy: { name: "asc" },
    });
  }

  static async createCategory(data: CreateCategoryInput) {
    return prisma.assetCategory.create({
      data: {
        name: data.name,
        description: data.description ?? null,
        customFields: data.customFields ?? null,
      },
    });
  }

  static async updateCategory(id: number, data: UpdateCategoryInput) {
    return prisma.assetCategory.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description !== undefined ? data.description : undefined,
        customFields: data.customFields !== undefined ? data.customFields : undefined,
      },
    });
  }

  // --- Employees ---
  static async getEmployees() {
    return prisma.employee.findMany({
      include: {
        department: {
          select: { id: true, name: true },
        },
      },
      orderBy: { name: "asc" },
    });
  }

  static async updateEmployee(id: number, data: UpdateEmployeeAssignmentInput) {
    return prisma.employee.update({
      where: { id },
      data: {
        role: data.role,
        departmentId: data.departmentId !== undefined ? data.departmentId : undefined,
        status: data.status,
      },
    });
  }
}
