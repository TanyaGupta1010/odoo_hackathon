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
      location: 'Desk E12',
      isShared: false,
      status: 'Allocated',
    },
  });

  const projector = await prisma.asset.create({
    data: {
      assetTag: 'AF-0062',
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

  const acUnit = await prisma.asset.create({
    data: {
      assetTag: 'AF-0003',
      name: 'AC Unit Carrier 1.5 Ton',
      categoryId: electronics.id,
      serialNumber: 'SN-CARR-7712',
      acquisitionDate: new Date('2024-06-12'),
      acquisitionCost: 650.00,
      condition: 'Fair',
      location: 'HQ Floor 2',
      isShared: false,
      status: 'Under Maintenance',
    },
  });

  const forklift = await prisma.asset.create({
    data: {
      assetTag: 'AF-0078',
      name: 'Toyota Electric Forklift',
      categoryId: vehicles.id,
      serialNumber: 'SN-TOY-8921',
      acquisitionDate: new Date('2023-11-20'),
      acquisitionCost: 15000.00,
      condition: 'Good',
      location: 'Warehouse A',
      isShared: true,
      status: 'Under Maintenance',
    },
  });

  const printer = await prisma.asset.create({
    data: {
      assetTag: 'AF-0897',
      name: 'HP LaserJet Enterprise Printer',
      categoryId: electronics.id,
      serialNumber: 'SN-HP-2299',
      acquisitionDate: new Date('2025-05-18'),
      acquisitionCost: 950.00,
      condition: 'Good',
      location: 'IT Lab',
      isShared: true,
      status: 'Under Maintenance',
    },
  });

  const chairRepair = await prisma.asset.create({
    data: {
      assetTag: 'AF-0873',
      name: 'Executive Mesh Chair',
      categoryId: furniture.id,
      serialNumber: 'SN-STEEL-0992',
      acquisitionDate: new Date('2024-09-05'),
      acquisitionCost: 350.00,
      condition: 'Good',
      location: 'HR Office',
      isShared: false,
      status: 'Available',
    },
  });

  const officeChair = await prisma.asset.create({
    data: {
      assetTag: 'AF-9921',
      name: 'Standard Office Chair',
      categoryId: furniture.id,
      serialNumber: 'SN-CHAIR-9921',
      acquisitionDate: new Date('2025-01-20'),
      acquisitionCost: 150.00,
      condition: 'Good',
      location: 'Desk E14',
      isShared: false,
      status: 'Allocated',
    },
  });

  const monitor = await prisma.asset.create({
    data: {
      assetTag: 'AF-9838',
      name: 'Dell 27-inch 4K Monitor',
      categoryId: electronics.id,
      serialNumber: 'SN-DELL-9838',
      acquisitionDate: new Date('2025-02-15'),
      acquisitionCost: 400.00,
      condition: 'Good',
      location: 'Desk E15',
      isShared: false,
      status: 'Allocated',
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

  await prisma.allocation.create({
    data: {
      assetId: officeChair.id,
      employeeId: raj.id,
      departmentId: eng.id,
      allocatedAt: new Date('2026-04-01T09:00:00Z'),
    },
  });

  await prisma.allocation.create({
    data: {
      assetId: monitor.id,
      employeeId: priya.id,
      departmentId: eng.id,
      allocatedAt: new Date('2026-04-05T09:00:00Z'),
    },
  });

  // 8. Create bookings
  await prisma.booking.create({
    data: {
      resourceId: projector.id,
      employeeId: raj.id,
      startTime: new Date('2026-07-10T09:00:00Z'),
      endTime: new Date('2026-07-10T10:00:00Z'),
      status: 'Completed',
    },
  });

  await prisma.booking.create({
    data: {
      resourceId: forklift.id,
      employeeId: raj.id,
      startTime: new Date('2026-07-12T10:30:00Z'),
      endTime: new Date('2026-07-12T11:30:00Z'),
      status: 'Upcoming',
    },
  });

  // 9. Create Maintenance requests (Screen 7 Kanban)
  await prisma.maintenanceRequest.create({
    data: {
      assetId: projector.id,
      reporterId: priya.id,
      issueDescription: 'Projector bulb not turning on',
      priority: 'High',
      status: 'Pending',
    },
  });

  await prisma.maintenanceRequest.create({
    data: {
      assetId: acUnit.id,
      reporterId: raj.id,
      issueDescription: 'AC unit noisy compressor',
      priority: 'Medium',
      status: 'Approved',
    },
  });

  await prisma.maintenanceRequest.create({
    data: {
      assetId: forklift.id,
      reporterId: sana.id,
      technicianId: rohan.id,
      issueDescription: 'Forklift battery issues',
      priority: 'Urgent',
      status: 'Assigned',
    },
  });

  await prisma.maintenanceRequest.create({
    data: {
      assetId: printer.id,
      reporterId: priya.id,
      technicianId: rohan.id,
      issueDescription: 'Printer Jam - parts ordered',
      priority: 'Low',
      status: 'In_Progress',
    },
  });

  await prisma.maintenanceRequest.create({
    data: {
      assetId: chairRepair.id,
      reporterId: raj.id,
      technicianId: rohan.id,
      issueDescription: 'Chair repair resolved 7 Jul',
      priority: 'Low',
      status: 'Resolved',
      resolvedAt: new Date('2026-07-07T14:00:00Z'),
    },
  });

  // 9.5 Create Audit Cycle & Items (Screen 8)
  const auditCycle = await prisma.auditCycle.create({
    data: {
      title: 'Q3 audit: Engineering dept - 1-15 jul',
      departmentId: eng.id,
      startDate: new Date('2026-07-01'),
      endDate: new Date('2026-07-15'),
      status: 'Active',
      createdById: admin.id,
    },
  });

  await prisma.auditItem.create({
    data: {
      auditCycleId: auditCycle.id,
      assetId: laptop.id,
      status: 'Verified',
      notes: 'Checked at Desk E12',
      verifiedAt: new Date('2026-07-10T10:00:00Z'),
    },
  });

  await prisma.auditItem.create({
    data: {
      auditCycleId: auditCycle.id,
      assetId: officeChair.id,
      status: 'Missing',
      notes: 'Not found at Desk E14',
    },
  });

  await prisma.auditItem.create({
    data: {
      auditCycleId: auditCycle.id,
      assetId: monitor.id,
      status: 'Damaged',
      notes: 'Screen cracked at Desk E15',
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
      details: 'Laptop AF-0014 assigned to Priya shah',
      createdAt: new Date(Date.now() - 2 * 60 * 1000), // 2m ago
    },
  });

  await prisma.activityLog.create({
    data: {
      actorId: admin.id,
      actionType: 'MAINTENANCE_APPROVED',
      details: 'Maintenance request AF-0055 approved',
      createdAt: new Date(Date.now() - 18 * 60 * 1000), // 18m ago
    },
  });

  await prisma.activityLog.create({
    data: {
      actorId: raj.id,
      actionType: 'BOOKING_CONFIRMED',
      details: 'Booking confirmed : Room B2 : 2:00 to 3:00 PM',
      createdAt: new Date(Date.now() - 60 * 60 * 1000), // 1h ago
    },
  });

  await prisma.activityLog.create({
    data: {
      actorId: sana.id,
      actionType: 'TRANSFER_APPROVED',
      details: 'Transfer approved : AF-0033 to facilities dept',
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3h ago
    },
  });

  await prisma.activityLog.create({
    data: {
      actorId: admin.id,
      actionType: 'OVERDUE_ALERT',
      details: 'Overdue return : AF-0021 was due 3 days ago',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1d ago
    },
  });

  await prisma.activityLog.create({
    data: {
      actorId: admin.id,
      actionType: 'AUDIT_DISCREPANCY',
      details: 'audit discrepancy flagged : AF-0088 damaged',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2d ago
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
