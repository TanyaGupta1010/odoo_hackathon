import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with mock enterprise data...');

  // 1. Clear existing data in reverse dependency order
  await prisma.activityLog.deleteMany({});
  await prisma.auditItem.deleteMany({});
  await prisma.auditCycle.deleteMany({});
  await prisma.maintenanceRequest.deleteMany({});
  await prisma.booking.deleteMany({});
  await prisma.transferRequest.deleteMany({});
  await prisma.allocation.deleteMany({});
  await prisma.asset.deleteMany({});
  await prisma.assetCategory.deleteMany({});
  await prisma.department.updateMany({ data: { headId: null } });
  await prisma.employee.deleteMany({});
  await prisma.department.deleteMany({});

  // 2. Create Departments
  const eng = await prisma.department.create({
    data: { name: 'Engineering', status: 'Active' },
  });
  const fac = await prisma.department.create({
    data: { name: 'Facilities', status: 'Active' },
  });
  const fieldOps = await prisma.department.create({
    data: { name: 'Field Ops', status: 'Inactive' },
  });

  // 3. Create Employees (Screen 1 & 3)
  const admin = await prisma.employee.create({
    data: {
      name: 'System Admin',
      email: 'admin@assetflow.com',
      passwordHash: '$2b$10$xyzAdminHashString',
      role: 'Admin',
      departmentId: eng.id,
    },
  });

  const aditi = await prisma.employee.create({
    data: {
      name: 'Aditi Rao',
      email: 'aditi.rao@assetflow.com',
      passwordHash: '$2b$10$xyzDeptHeadHash1',
      role: 'Department Head',
      departmentId: eng.id,
    },
  });

  const rohan = await prisma.employee.create({
    data: {
      name: 'Rohan Mehta',
      email: 'rohan.mehta@assetflow.com',
      passwordHash: '$2b$10$xyzDeptHeadHash2',
      role: 'Department Head',
      departmentId: fac.id,
    },
  });

  const sana = await prisma.employee.create({
    data: {
      name: 'Sana Iqbal',
      email: 'sana.iqbal@assetflow.com',
      passwordHash: '$2b$10$xyzManagerHash1',
      role: 'Asset Manager',
      departmentId: fieldOps.id,
    },
  });

  const priya = await prisma.employee.create({
    data: {
      name: 'Priya Shah',
      email: 'priya.shah@assetflow.com',
      passwordHash: '$2b$10$xyzEmployeeHash1',
      role: 'Employee',
      departmentId: eng.id,
    },
  });

  const raj = await prisma.employee.create({
    data: {
      name: 'Raj Patel',
      email: 'raj.patel@assetflow.com',
      passwordHash: '$2b$10$xyzEmployeeHash2',
      role: 'Employee',
      departmentId: eng.id,
    },
  });

  // 4. Update Departments with Head IDs
  await prisma.department.update({
    where: { id: eng.id },
    data: { headId: aditi.id },
  });
  await prisma.department.update({
    where: { id: fac.id },
    data: { headId: rohan.id },
  });

  // 5. Create Asset Categories
  const electronics = await prisma.assetCategory.create({
    data: {
      name: 'Electronics',
      description: 'Laptops, tablets, monitors, and servers',
      customFields: { warranty_period_months: 24 },
    },
  });

  const furniture = await prisma.assetCategory.create({
    data: {
      name: 'Furniture',
      description: 'Office chairs, desks, and storage facilities',
      customFields: { warranty_period_months: 12 },
    },
  });

  const vehicles = await prisma.assetCategory.create({
    data: {
      name: 'Vehicles',
      description: 'Company shuttle buses and operations cars',
      customFields: { warranty_period_months: 36 },
    },
  });

  // 6. Create Assets
  const laptop = await prisma.asset.create({
    data: {
      assetTag: 'AF-0114',
      name: 'Dell Latitude 5420 Laptop',
      categoryId: electronics.id,
      serialNumber: 'SN-DELL-9871',
      acquisitionDate: new Date('2025-01-10'),
      acquisitionCost: 1200.00,
      condition: 'Good',
      location: 'Desk 412',
      isShared: false,
      status: 'Allocated',
    },
  });

  const projector = await prisma.asset.create({
    data: {
      assetTag: 'AF-0042',
      name: 'Epson Smart Projector',
      categoryId: electronics.id,
      serialNumber: 'SN-EPS-4412',
      acquisitionDate: new Date('2025-03-15'),
      acquisitionCost: 850.00,
      condition: 'Fair',
      location: 'HQ Room 2',
      isShared: true,
      status: 'Under Maintenance',
    },
  });

  const chair = await prisma.asset.create({
    data: {
      assetTag: 'AF-0301',
      name: 'Ergonomic Office Chair',
      categoryId: furniture.id,
      serialNumber: 'SN-HERM-0301',
      acquisitionDate: new Date('2025-02-05'),
      acquisitionCost: 450.00,
      condition: 'Good',
      location: 'Warehouse',
      isShared: false,
      status: 'Available',
    },
  });

  // 7. Create allocations
  await prisma.allocation.create({
    data: {
      assetId: laptop.id,
      employeeId: priya.id,
      departmentId: eng.id,
      allocatedAt: new Date('2026-03-12T09:00:00Z'),
      expectedReturnDate: new Date('2026-09-12T18:00:00Z'),
    },
  });

  // 8. Create bookings
  await prisma.booking.create({
    data: {
      resourceId: projector.id,
      employeeId: raj.id,
      startTime: new Date('2026-07-12T09:00:00Z'),
      endTime: new Date('2026-07-12T10:00:00Z'),
      status: 'Completed',
    },
  });

  await prisma.booking.create({
    data: {
      resourceId: projector.id,
      employeeId: priya.id,
      startTime: new Date('2026-07-12T10:30:00Z'),
      endTime: new Date('2026-07-12T11:30:00Z'),
      status: 'Upcoming',
    },
  });

  // 9. Create Maintenance request (Screen 7)
  await prisma.maintenanceRequest.create({
    data: {
      assetId: projector.id,
      reporterId: priya.id,
      issueDescription: 'Projector lamp is dim and shuts down randomly after 10 mins',
      priority: 'High',
      status: 'Pending',
    },
  });

  // 10. Create Activity logs (Screen 10)
  await prisma.activityLog.create({
    data: {
      actorId: admin.id,
      actionType: 'SYSTEM_START',
      details: 'System database initialized with mock enterprise data.',
    },
  });

  await prisma.activityLog.create({
    data: {
      actorId: priya.id,
      actionType: 'ALLOCATION_CREATED',
      details: 'Asset AF-0114 (Dell Laptop) allocated to Priya Shah.',
    },
  });

  console.log('Database successfully seeded!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
