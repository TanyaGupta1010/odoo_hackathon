import { prisma } from "../config/prisma";
import { UpdateAuditItemInput } from "../validators/audit.validator";

export class AuditService {
  static async getActiveCycle() {
    return prisma.auditCycle.findFirst({
      where: {
        status: "Active",
      },
      include: {
        auditItems: {
          include: {
            asset: true,
            auditor: true,
          },
        },
      },
    });
  }
  static async getAll() {
    return prisma.auditCycle.findMany({
      orderBy: {
        startDate: "desc",
      },
    });
  }

  static async getById(id: number) {
    return prisma.auditCycle.findUnique({
      where: { id },
      include: {
        auditItems: {
          include: {
            asset: true,
            auditor: true,
          },
        },
      },
    });
  }
  static async updateItem(id: number, data: UpdateAuditItemInput, auditorId?: number) {
    const item = await prisma.auditItem.findUnique({
      where: { id },
      include: { asset: true },
    });

    if (!item) {
      throw new Error("Audit item not found");
    }

    return prisma.auditItem.update({
      where: { id },
      data: {
        status: data.status,
        notes: data.notes ?? undefined,
        verifiedAt: new Date(),
        auditorId: auditorId || undefined,
      },
    });
  }

  static async closeCycle(id: number) {
    const cycle = await prisma.auditCycle.findUnique({
      where: { id },
      include: { auditItems: { include: { asset: true } } },
    });

    if (!cycle) {
      throw new Error("Audit cycle not found");
    }

    if (cycle.status !== "Active") {
      throw new Error("Audit cycle is already closed");
    }

    return prisma.$transaction(async (tx) => {
      // 1. Update cycle status
      const updatedCycle = await tx.auditCycle.update({
        where: { id },
        data: { status: "Closed" },
      });

      let missingCount = 0;
      let damagedCount = 0;

      // 2. Resolve asset conditions & statuses based on item states
      for (const item of cycle.auditItems) {
        if (item.status === "Missing") {
          missingCount++;
          await tx.asset.update({
            where: { id: item.assetId },
            data: { status: "Lost" },
          });
        } else if (item.status === "Damaged") {
          damagedCount++;
          await tx.asset.update({
            where: { id: item.assetId },
            data: { condition: "Poor" },
          });
        }
      }

      // 3. Log cycle closure
      await tx.activityLog.create({
        data: {
          actorId: cycle.createdById || null,
          actionType: "AUDIT_CYCLE_CLOSED",
          details: `Audit cycle "${cycle.title}" closed. Resolved: ${missingCount} missing (marked Lost), ${damagedCount} damaged (marked Poor).`,
        },
      });

      return updatedCycle;
    });
  }
}
