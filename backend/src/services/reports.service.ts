import { prisma } from "../config/prisma";

export class ReportsService {
  static async getSummary() {
    // 1. Department Utilization Summary
    // Count active allocations per department
    const departments = await prisma.department.findMany({
      include: {
        allocations: {
          where: { returnedAt: null },
        },
      },
    });

    const totalAssetsCount = await prisma.asset.count();
    const utilizationByDepartment = departments.map((dept) => {
      const activeAllocations = dept.allocations.length;
      const utilizationRate =
        totalAssetsCount > 0 ? Math.round((activeAllocations / totalAssetsCount) * 100) : 0;
      return {
        name: dept.name,
        utilization: utilizationRate,
      };
    });

    // 2. Maintenance Frequency (Monthly count for the last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const maintenanceRequests = await prisma.maintenanceRequest.findMany({
      where: {
        createdAt: {
          gte: sixMonthsAgo,
        },
      },
      select: {
        createdAt: true,
      },
    });

    const monthlyCounts: { [key: string]: number } = {};
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Initialize last 6 months with 0
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const label = monthNames[d.getMonth()];
      monthlyCounts[label] = 0;
    }

    maintenanceRequests.forEach((req) => {
      const label = monthNames[req.createdAt.getMonth()];
      if (monthlyCounts[label] !== undefined) {
        monthlyCounts[label]++;
      }
    });

    const maintenanceFrequency = Object.keys(monthlyCounts).map((month) => ({
      month,
      count: monthlyCounts[month],
    }));

    // 3. Most Used Assets (Top booked shared resources)
    const bookingsGrouped = await prisma.booking.groupBy({
      by: ["resourceId"],
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: "desc",
        },
      },
      take: 5,
    });

    const mostUsedAssets = await Promise.all(
      bookingsGrouped.map(async (group) => {
        const asset = await prisma.asset.findUnique({
          where: { id: group.resourceId },
        });
        return {
          assetTag: asset?.assetTag || "Unknown",
          name: asset?.name || "Shared Resource",
          category: "Spaces/Resources",
          bookingsCount: group._count.id,
        };
      })
    );

    // 4. Idle Assets (Available assets that have not been allocated or booked recently, or ever)
    // For simplicity, we query available assets that are not currently allocated
    const idleAssetsRaw = await prisma.asset.findMany({
      where: {
        status: "Available",
      },
      include: {
        allocations: {
          orderBy: { allocatedAt: "desc" },
          take: 1,
        },
      },
      take: 5,
    });

    const idleAssets = idleAssetsRaw.map((asset) => {
      const lastAllocation = asset.allocations[0];
      const daysIdle = lastAllocation
        ? Math.floor((Date.now() - new Date(lastAllocation.allocatedAt).getTime()) / (1000 * 60 * 60 * 24))
        : 60; // Default to 60+ days if never allocated

      return {
        assetTag: asset.assetTag,
        name: asset.name,
        idleDays: daysIdle,
      };
    });

    // 5. Assets Due for Maintenance / Nearing Retirement
    // Due for maintenance: status is Under Maintenance
    const dueForMaintenanceAssets = await prisma.asset.findMany({
      where: {
        status: "Under Maintenance",
      },
      take: 3,
    });

    // Nearing retirement: Laptops/Electronics bought > 3 years ago
    const threeYearsAgo = new Date();
    threeYearsAgo.setFullYear(threeYearsAgo.getFullYear() - 3);
    const nearingRetirementAssets = await prisma.asset.findMany({
      where: {
        acquisitionDate: {
          lt: threeYearsAgo,
        },
      },
      take: 3,
    });

    const dueForMaintenance = [
      ...dueForMaintenanceAssets.map((a) => ({
        id: a.id,
        name: a.name,
        assetTag: a.assetTag,
        type: "service_due",
        label: "Service active/due",
      })),
      ...nearingRetirementAssets.map((a) => {
        const age = Math.round(
          (Date.now() - new Date(a.acquisitionDate || "").getTime()) / (1000 * 60 * 60 * 24 * 365)
        );
        return {
          id: a.id,
          name: a.name,
          assetTag: a.assetTag,
          type: "retirement",
          label: `${age} years old : nearing retirement`,
        };
      }),
    ];

    return {
      utilizationByDepartment,
      maintenanceFrequency,
      mostUsedAssets,
      idleAssets,
      dueForMaintenance,
    };
  }
}
