import { prisma } from "../config/prisma";

export class ResourceService {
  static async getAll() {
    return prisma.asset.findMany({
      orderBy: {
        assetTag: "asc",
      },
      select: {
        id: true,
        assetTag: true,
        name: true,
        status: true,
      },
    });
  }
}