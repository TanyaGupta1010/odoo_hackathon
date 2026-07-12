import { prisma } from "../config/prisma";
import { CreateAssetInput } from "../validators/asset.validator";

export class AssetService {
  static async create(data: CreateAssetInput) {
    const latestAsset = await prisma.asset.findFirst({
      orderBy: {
        id: "desc",
      },
    });

    const nextId = (latestAsset?.id ?? 0) + 1;

    const assetTag = `AF-${nextId.toString().padStart(4, "0")}`;

    return prisma.asset.create({
      data: {
        assetTag,
        name: data.name,
        categoryId: data.categoryId,
        serialNumber: data.serialNumber,
        acquisitionDate: data.acquisitionDate
          ? new Date(data.acquisitionDate)
          : null,
        acquisitionCost: data.acquisitionCost,
        condition: data.condition,
        location: data.location,
        isShared: data.isShared,
        status: "Available",
      },
    });
  }

  static async getAll() {
    return prisma.asset.findMany({
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  static async getAvailableAssets() {
    return prisma.asset.findMany({
      where: {
        status: "Available",
      },
      select: {
        id: true,
        assetTag: true,
        name: true,
        condition: true,
        location: true,
      },
      orderBy: {
        assetTag: "asc",
      },
    });
  }
}