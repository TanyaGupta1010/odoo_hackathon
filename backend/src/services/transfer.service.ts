import { prisma } from "../config/prisma";
import { CreateTransferInput } from "../validators/transfer.validator";

export class TransferService {
  static async create(data: CreateTransferInput) {
    const asset = await prisma.asset.findUnique({
      where: {
        id: data.assetId,
      },
    });

    if (!asset) {
      throw new Error("Asset not found");
    }

    if (asset.status !== "Allocated") {
      throw new Error("Asset is not currently allocated");
    }

    const activeAllocation = await prisma.allocation.findFirst({
      where: {
        assetId: data.assetId,
        returnedAt: null,
      },
    });

    if (!activeAllocation) {
      throw new Error("No active allocation found");
    }

    const pending = await prisma.transferRequest.findFirst({
      where: {
        assetId: data.assetId,
        status: "Pending",
      },
    });

    if (pending) {
      throw new Error("Transfer request already exists");
    }

    return prisma.transferRequest.create({
      data: {
        assetId: data.assetId,
        fromEmployeeId: data.fromEmployeeId,
        toEmployeeId: data.toEmployeeId,
        reason: data.reason,
      },
    });
  }

  static async getAll() {
    return prisma.transferRequest.findMany({
      include: {
        asset: true,
        fromEmployee: true,
        toEmployee: true,
        approver: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  static async approve(id: number, approverId: number) {
    const request = await prisma.transferRequest.findUnique({
      where: {
        id,
      },
    });

    if (!request) {
      throw new Error("Transfer request not found");
    }

    if (request.status !== "Pending") {
      throw new Error("Transfer already processed");
    }

    return prisma.$transaction(async (tx) => {
      await tx.allocation.updateMany({
        where: {
          assetId: request.assetId,
          returnedAt: null,
        },
        data: {
          returnedAt: new Date(),
          checkinNotes: "Transferred",
        },
      });

      await tx.allocation.create({
        data: {
          assetId: request.assetId,
          employeeId: request.toEmployeeId,
        },
      });

      const updated = await tx.transferRequest.update({
        where: {
          id,
        },
        data: {
          status: "Approved",
          approvedById: approverId,
        },
      });

      return updated;
    });
  }

  static async reject(id: number, approverId: number) {
    return prisma.transferRequest.update({
      where: {
        id,
      },
      data: {
        status: "Rejected",
        approvedById: approverId,
      },
    });
  }
}