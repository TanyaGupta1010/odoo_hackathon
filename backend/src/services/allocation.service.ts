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
        `Asset ${asset.assetTag} is currently ${asset.status}`
      );
    }

    const activeAllocation = await prisma.allocation.findFirst({
      where: {
        assetId: data.assetId,
        returnedAt: null,
      },
    });

    if (activeAllocation) {
      throw new Error(
        "Asset is already allocated. Create a transfer request instead."
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

  static async getHistory(assetId: number) {
    return prisma.allocation.findMany({
      where: {
        assetId,
      },
      include: {
        employee: true,
        department: true,
      },
      orderBy: {
        allocatedAt: "desc",
      },
    });
  }

  static async returnAsset(
    allocationId: number,
    condition: string,
    notes: string
  ) {
    const allocation = await prisma.allocation.findUnique({
      where: {
        id: allocationId,
      },
    });

    if (!allocation) {
      throw new Error("Allocation not found");
    }

    if (allocation.returnedAt) {
      throw new Error("Asset already returned");
    }

    return prisma.$transaction(async (tx) => {
      const updated = await tx.allocation.update({
        where: {
          id: allocationId,
        },
        data: {
          returnedAt: new Date(),
          returnCondition: condition,
          checkinNotes: notes,
        },
      });

      await tx.asset.update({
        where: {
          id: allocation.assetId,
        },
        data: {
          status: "Available",
        },
      });

      return updated;
    });
  }
}