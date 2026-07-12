import { prisma } from "../config/prisma";
import { AllocateAssetInput } from "../validators/allocation.validator";

export class AllocationService {
  static async allocate(data: AllocateAssetInput) {
    const asset = await prisma.asset.findUnique({
      where: {
        id: data.assetId,
      },
    });

    if (!asset) {
      throw new Error("Asset not found");
    }

    if (asset.status !== "Available") {
      throw new Error(
        `Asset is currently ${asset.status} and cannot be allocated`
      );
    }

    return prisma.$transaction(async (tx) => {
      const allocation = await tx.allocation.create({
        data: {
          assetId: data.assetId,
          employeeId: data.employeeId,
          departmentId: data.departmentId,
          expectedReturnDate: data.expectedReturnDate
            ? new Date(data.expectedReturnDate)
            : null,
        },
      });

      await tx.asset.update({
        where: {
          id: data.assetId,
        },
        data: {
          status: "Allocated",
        },
      });

      return allocation;
    });
  }

  static async getAll() {
    return prisma.allocation.findMany({
      include: {
        asset: true,
        employee: true,
        department: true,
      },
      orderBy: {
        allocatedAt: "desc",
      },
    });
  }
}