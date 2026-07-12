import { prisma } from "../config/prisma";
import { CreateBookingInput } from "../validators/booking.validator";

export class BookingService {
  static async create(data: CreateBookingInput & { employeeId: number }) {
    const resource = await prisma.asset.findUnique({
      where: {
        id: data.resourceId,
      },
    });

    if (!resource) {
      throw new Error("Resource not found");
    }

    const employee = await prisma.employee.findUnique({
      where: {
        id: data.employeeId,
      },
    });

    if (!employee) {
      throw new Error("Employee not found");
    }

    const start = new Date(data.startTime);
    const end = new Date(data.endTime);

    if (start >= end) {
      throw new Error(
        "End time must be after start time"
      );
    }

    const conflict = await prisma.booking.findFirst({
      where: {
        resourceId: data.resourceId,
        status: "Upcoming",
        AND: [
          {
            startTime: {
              lt: end,
            },
          },
          {
            endTime: {
              gt: start,
            },
          },
        ],
      },
    });

    if (conflict) {
      throw new Error(
        "Selected slot is already booked"
      );
    }

    return prisma.booking.create({
      data: {
        resourceId: data.resourceId,
        employeeId: data.employeeId,
        startTime: start,
        endTime: end,
      },
      include: {
        resource: true,
        employee: true,
      },
    });
  }

  static async getAll() {
    return prisma.booking.findMany({
      include: {
        resource: true,
        employee: true,
      },
      orderBy: {
        startTime: "asc",
      },
    });
  }

  static async getByResource(
    resourceId: number
  ) {
    return prisma.booking.findMany({
      where: {
        resourceId,
      },
      include: {
        employee: true,
        resource: true,
      },
      orderBy: {
        startTime: "asc",
      },
    });
  }

  static async cancel(id: number) {
    return prisma.booking.update({
      where: {
        id,
      },
      data: {
        status: "Cancelled",
      },
    });
  }
}