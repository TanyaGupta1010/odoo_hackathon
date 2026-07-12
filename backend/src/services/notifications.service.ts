import { prisma } from "../config/prisma";

export class NotificationsService {
  static async getAll(type?: string) {
    let whereClause: any = {};

    if (type === "Alerts") {
      whereClause.actionType = {
        in: ["OVERDUE_ALERT", "AUDIT_DISCREPANCY", "OVERDUE_RETURN"],
      };
    } else if (type === "Approvals") {
      whereClause.actionType = {
        in: ["MAINTENANCE_APPROVED", "TRANSFER_APPROVED", "ALLOCATION_CREATED"],
      };
    } else if (type === "Bookings") {
      whereClause.actionType = {
        in: ["BOOKING_CONFIRMED", "BOOKING_CANCELLED"],
      };
    }

    return prisma.activityLog.findMany({
      where: whereClause,
      include: {
        actor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
}
