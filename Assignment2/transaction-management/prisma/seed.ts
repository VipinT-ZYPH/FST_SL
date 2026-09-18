// prisma/seed.ts
// Faker.js seeding — creates relational dummy data in dependency order

import { PrismaClient, UserRole, TransactionType, TransactionStatus, AuditAction, EmailEventType } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { createId } from "@paralleldrive/cuid2";

const prisma = new PrismaClient();

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ─────────────────────────────────────────────────────────────
// Main seed function
// ─────────────────────────────────────────────────────────────

async function main() {
  console.log("🌱 Seed started...");

  // ─── RESET ────────────────────────────────────────────────
  await prisma.emailEvent.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.verification.deleteMany();
  await prisma.user.deleteMany();
  console.log("✓ Existing data cleared");

  // ─── USERS ────────────────────────────────────────────────
  // We create users directly in the User table.
  // Better Auth manages credentials via the Account table.
  // For seeding purposes we create Account entries with hashed password placeholders.

  const roles: { role: UserRole; label: string }[] = [
    { role: UserRole.ADMIN, label: "Admin" },
    { role: UserRole.MEMBER, label: "Member" },
  ];

  console.log(`\n📋 Creating users...`);

  // Fixed accounts for easy testing
  const fixedUsers = [
    {
      id: createId(),
      name: "Admin User",
      email: "admin@txnmanager.dev",
      role: UserRole.ADMIN,
    },
    {
      id: createId(),
      name: "Alice Member",
      email: "alice@txnmanager.dev",
      role: UserRole.MEMBER,
    },
    {
      id: createId(),
      name: "Bob Member",
      email: "bob@txnmanager.dev",
      role: UserRole.MEMBER,
    },
  ];

  // Random users
  const randomUsers = Array.from({ length: 8 }, () => ({
    id: createId(),
    name: faker.person.fullName(),
    email: faker.internet.email().toLowerCase(),
    role: UserRole.MEMBER,
  }));

  const allUserData = [...fixedUsers, ...randomUsers];

  const users = await prisma.$transaction(
    allUserData.map((u) =>
      prisma.user.create({
        data: {
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          emailVerified: true,
          image: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(u.name)}`,
        },
      })
    )
  );

  console.log(`✓ Users created: ${users.length}`);

  // Create Account entries for fixed users (credential providers)
  // NOTE: In production, Better Auth handles password hashing.
  // This seed creates placeholder accounts to show the schema relationship.
  // Real sign-in for seeded users should be done via the /signup page.
  console.log(`  → Note: Use /signup to create real credentials for testing`);
  console.log(`  → Fixed user emails: admin@txnmanager.dev | alice@txnmanager.dev`);

  // ─── TRANSACTIONS ─────────────────────────────────────────

  const memberUsers = users.filter(
    (u) => u.role === UserRole.MEMBER || u.role === UserRole.ADMIN
  );

  const transactionTitles = [
    "Monthly Subscription Payment",
    "Freelance Invoice #",
    "Product Sale",
    "Service Fee",
    "Vendor Payment",
    "Office Supplies",
    "Cloud Infrastructure",
    "Marketing Campaign",
    "Consulting Services",
    "Software License",
    "Equipment Purchase",
    "Team Lunch Expense",
    "Conference Registration",
    "Training Materials",
    "Refund Processed",
    "Bonus Payment",
    "Contractor Invoice",
    "Utility Bill",
    "Insurance Premium",
    "Travel Reimbursement",
  ];

  const transactionData = Array.from({ length: 60 }, () => {
    const user = pick(memberUsers);
    const type = pick([TransactionType.CREDIT, TransactionType.DEBIT]);
    const title = pick(transactionTitles) + (Math.random() > 0.5 ? ` ${faker.number.int({ min: 100, max: 999 })}` : "");

    return {
      id: createId(),
      userId: user.id,
      title,
      description: Math.random() > 0.4 ? faker.lorem.sentence() : undefined,
      amount: parseFloat(faker.finance.amount({ min: 10, max: 5000, dec: 2 })),
      type,
      status: pick([
        TransactionStatus.COMPLETED,
        TransactionStatus.COMPLETED,
        TransactionStatus.PENDING,
        TransactionStatus.FAILED,
        TransactionStatus.CANCELLED,
      ]),
      reference: `TXN-${faker.string.alphanumeric(8).toUpperCase()}`,
      createdAt: faker.date.between({ from: "2025-01-01", to: new Date() }),
    };
  });

  const transactions = await prisma.$transaction(
    transactionData.map((t) =>
      prisma.transaction.create({
        data: {
          id: t.id,
          userId: t.userId,
          title: t.title,
          description: t.description,
          amount: t.amount,
          type: t.type,
          status: t.status,
          reference: t.reference,
          createdAt: t.createdAt,
          updatedAt: t.createdAt,
        },
      })
    )
  );

  console.log(`✓ Transactions created: ${transactions.length}`);

  // ─── AUDIT LOGS ───────────────────────────────────────────

  // Create audit log for each user creation
  const userAuditLogs = users.map((u) => ({
    userId: users[0].id, // admin performed action
    action: AuditAction.USER_CREATED,
    entity: "User",
    entityId: u.id,
    metadata: { email: u.email, role: u.role },
    createdAt: u.createdAt,
  }));

  // Create audit log for each transaction
  const transactionAuditLogs = transactions.slice(0, 40).map((t) => ({
    userId: t.userId,
    action: AuditAction.TRANSACTION_CREATED,
    entity: "Transaction",
    entityId: t.id,
    metadata: { amount: t.amount.toString(), type: t.type },
    createdAt: t.createdAt,
  }));

  // Create some login audit logs
  const loginAuditLogs = Array.from({ length: 15 }, () => {
    const user = pick(users);
    return {
      userId: user.id,
      action: AuditAction.LOGIN,
      entity: "Session",
      entityId: null,
      metadata: { ip: faker.internet.ip() },
      ipAddress: faker.internet.ip(),
      userAgent: faker.internet.userAgent(),
      createdAt: faker.date.recent({ days: 30 }),
    };
  });

  const allAuditData = [
    ...userAuditLogs,
    ...transactionAuditLogs,
    ...loginAuditLogs,
  ];

  const auditLogs = await prisma.$transaction(
    allAuditData.map((log) =>
      prisma.auditLog.create({
        data: {
          userId: log.userId,
          action: log.action,
          entity: log.entity,
          entityId: log.entityId ?? undefined,
          metadata: log.metadata ?? undefined,
          ipAddress: "ipAddress" in log ? log.ipAddress : undefined,
          userAgent: "userAgent" in log ? log.userAgent : undefined,
          createdAt: log.createdAt,
        },
      })
    )
  );

  console.log(`✓ Audit logs created: ${auditLogs.length}`);

  // ─── EMAIL EVENTS ─────────────────────────────────────────

  const emailEventData = transactions.slice(0, 30).map((t) => {
    const user = users.find((u) => u.id === t.userId);
    const eventTypes = [
      EmailEventType.SENT,
      EmailEventType.DELIVERED,
      EmailEventType.DELIVERED,
      EmailEventType.OPENED,
      EmailEventType.BOUNCED,
    ];

    return {
      eventId: `evt_${createId()}`,
      messageId: `msg_${createId()}`,
      recipient: user?.email ?? faker.internet.email(),
      eventType: pick(eventTypes),
      userId: t.userId,
      occurredAt: new Date(t.createdAt.getTime() + 1000 * 60), // 1 min after transaction
      payload: {
        transactionId: t.id,
        subject: `Transaction: ${t.title}`,
      },
    };
  });

  const emailEvents = await prisma.$transaction(
    emailEventData.map((e) =>
      prisma.emailEvent.create({
        data: {
          eventId: e.eventId,
          messageId: e.messageId,
          recipient: e.recipient,
          eventType: e.eventType,
          userId: e.userId,
          occurredAt: e.occurredAt,
          payload: e.payload,
        },
      })
    )
  );

  console.log(`✓ Email events created: ${emailEvents.length}`);

  // ─── SUMMARY ──────────────────────────────────────────────

  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📊 Seed Summary");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`  Roles configured : ${roles.length} (ADMIN, MEMBER)`);
  console.log(`  Users created    : ${users.length}`);
  console.log(`  Transactions     : ${transactions.length}`);
  console.log(`  Audit logs       : ${auditLogs.length}`);
  console.log(`  Email events     : ${emailEvents.length}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("\n✅ Seed completed successfully.");
  console.log("\n⚠️  Important: The seeded users do NOT have login credentials.");
  console.log("   Use /signup to register with these emails, or create new accounts.");
  console.log("   Recommended test accounts:");
  console.log("     admin@txnmanager.dev  → ADMIN");
  console.log("     alice@txnmanager.dev  → MEMBER");
}

// ─────────────────────────────────────────────────────────────
// Run
// ─────────────────────────────────────────────────────────────

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
