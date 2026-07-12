import { prisma } from "../config/prisma";
import { CreateMaintenanceInput, UpdateMaintenanceInput } from "../validators/maintenance.validator";

export class MaintenanceService {
  static async getAll() {
    return prisma.maintenanceRequest.findMany({
      include: {
        asset: true,
        reporter: true,
        technician: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  static async create(data: CreateMaintenanceInput) {
    const asset = await prisma.asset.findUnique({
      where: { id: data.assetId },
    });

    if (!asset) {
      throw new Error("Asset not found");
    }

    return prisma.$transaction(async (tx) => {
      // 1. Create maintenance request
      const request = await tx.maintenanceRequest.create({
        data: {
          assetId: data.assetId,
          issueDescription: data.issueDescription,
          priority: data.priority || "Medium",
          reporterId: data.reporterId || null,
          status: "Pending",
          photoUrl: data.photoUrl || null,
        },
      });

      // 2. Create activity log
      await tx.activityLog.create({
        data: {
          actorId: data.reporterId || null,
          actionType: "MAINTENANCE_CREATED",
          details: `Maintenance request raised for asset ${asset.assetTag}: ${data.issueDescription.substring(0, 50)}...`,
        },
      });

      return request;
    });
  }

  static async update(id: number, data: UpdateMaintenanceInput) {
    const request = await prisma.maintenanceRequest.findUnique({
      where: { id },
      include: { asset: true },
    });

    if (!request) {
      throw new Error("Maintenance request not found");
    }

    return prisma.$transaction(async (tx) => {
      // 1. Update the request
      const updated = await tx.maintenanceRequest.update({
        where: { id },
        data: {
          status: data.status || undefined,
          technicianId: data.technicianId || undefined,
          priority: data.priority || undefined,
          photoUrl: data.photoUrl || undefined,
          resolvedAt: data.status === "Resolved" ? new Date() : undefined,
        },
      });

      // 2. Sync asset status based on maintenance state transition
      if (data.status && data.status !== request.status) {
        let newAssetStatus = request.asset.status;
        if (data.status === "Approved") {
          newAssetStatus = "Under Maintenance";
        } else if (data.status === "Resolved") {
          newAssetStatus = "Available";
        }

        if (newAssetStatus !== request.asset.status) {
          await tx.asset.update({
            where: { id: request.assetId },
            data: { status: newAssetStatus },
          });
        }

        // 3. Log activity for state transitions
        await tx.activityLog.create({
          data: {
            actorId: data.technicianId || request.reporterId || null,
            actionType: `MAINTENANCE_${data.status.toUpperCase()}`,
            details: `Maintenance request for asset ${request.asset.assetTag} moved to ${data.status.replace("_", " ")}.`,
          },
        });
      }

      return updated;
    });
  }
}
