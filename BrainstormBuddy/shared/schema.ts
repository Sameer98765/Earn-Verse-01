import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  decimal,
  integer,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Enums
export const userRoleEnum = pgEnum('user_role', ['free', 'pro']);
export const userStatusEnum = pgEnum('user_status', ['unverified', 'active', 'suspended']);
export const transactionTypeEnum = pgEnum('transaction_type', ['spin', 'task', 'mission', 'referral', 'bonus', 'withdrawal']);
export const withdrawalStatusEnum = pgEnum('withdrawal_status', ['pending', 'in_process', 'completed', 'failed', 'refunded']);
export const taskStatusEnum = pgEnum('task_status', ['available', 'in_progress', 'completed', 'failed']);

// User storage table.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: userRoleEnum("role").default('free').notNull(),
  status: userStatusEnum("status").default('unverified').notNull(),
  referralCode: varchar("referral_code").unique(),
  referredBy: varchar("referred_by"),
  lastSpinAt: timestamp("last_spin_at"),
  streakCount: integer("streak_count").default(0),
  lastActivityAt: timestamp("last_activity_at").defaultNow(),
  proExpiresAt: timestamp("pro_expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Wallet table
export const wallets = pgTable("wallets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull().unique(),
  balance: decimal("balance", { precision: 10, scale: 2 }).default('0.00').notNull(),
  pendingBalance: decimal("pending_balance", { precision: 10, scale: 2 }).default('0.00').notNull(),
  lifetimeEarnings: decimal("lifetime_earnings", { precision: 10, scale: 2 }).default('0.00').notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Earnings log table
export const earningsLog = pgTable("earnings_log", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  type: transactionTypeEnum("type").notNull(),
  sourceId: varchar("source_id"),
  description: text("description"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Tasks table
export const tasks = pgTable("tasks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  description: text("description"),
  reward: decimal("reward", { precision: 10, scale: 2 }).notNull(),
  provider: varchar("provider"), // tapjoy, unity, etc
  externalId: varchar("external_id"),
  category: varchar("category"), // app_install, survey, etc
  minUserRole: userRoleEnum("min_user_role").default('free'),
  isActive: boolean("is_active").default(true),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User tasks table (tracking completion)
export const userTasks = pgTable("user_tasks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  taskId: varchar("task_id").references(() => tasks.id).notNull(),
  status: taskStatusEnum("status").default('available').notNull(),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Daily missions table
export const dailyMissions = pgTable("daily_missions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  description: text("description"),
  reward: decimal("reward", { precision: 10, scale: 2 }).notNull(),
  minUserRole: userRoleEnum("min_user_role").default('free'),
  isActive: boolean("is_active").default(true),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// User mission completions
export const userMissions = pgTable("user_missions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  missionId: varchar("mission_id").references(() => dailyMissions.id).notNull(),
  completedAt: timestamp("completed_at").defaultNow(),
  date: varchar("date").notNull(), // YYYY-MM-DD format for daily tracking
});

// Referrals table
export const referrals = pgTable("referrals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  referrerId: varchar("referrer_id").references(() => users.id).notNull(),
  referredId: varchar("referred_id").references(() => users.id).notNull(),
  status: varchar("status").default('pending'), // pending, verified, completed
  rewardEarned: decimal("reward_earned", { precision: 10, scale: 2 }).default('0.00'),
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

// Withdrawals table
export const withdrawals = pgTable("withdrawals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  method: varchar("method").notNull(), // upi, bank, mobile_recharge
  destination: varchar("destination").notNull(), // UPI ID, account number, mobile number
  status: withdrawalStatusEnum("status").default('pending').notNull(),
  processorTransactionId: varchar("processor_transaction_id"),
  failureReason: text("failure_reason"),
  createdAt: timestamp("created_at").defaultNow(),
  processedAt: timestamp("processed_at"),
});

// Spin results table
export const spinResults = pgTable("spin_results", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  result: varchar("result").notNull(), // try_again, amount, bonus_task
  amount: decimal("amount", { precision: 10, scale: 2 }).default('0.00'),
  date: varchar("date").notNull(), // YYYY-MM-DD format
  spinNumber: integer("spin_number").default(1), // 1 or 2 for pro users
  createdAt: timestamp("created_at").defaultNow(),
});

// Auth tokens table
export const authTokens = pgTable("auth_tokens", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  tokenHash: varchar("token_hash").notNull(),
  type: varchar("type").notNull(), // email_verification, password_reset
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  wallet: one(wallets, {
    fields: [users.id],
    references: [wallets.userId],
  }),
  earnings: many(earningsLog),
  userTasks: many(userTasks),
  userMissions: many(userMissions),
  referralsGiven: many(referrals, { relationName: "referrer" }),
  referralsReceived: many(referrals, { relationName: "referred" }),
  withdrawals: many(withdrawals),
  spinResults: many(spinResults),
  authTokens: many(authTokens),
}));

export const walletsRelations = relations(wallets, ({ one }) => ({
  user: one(users, {
    fields: [wallets.userId],
    references: [users.id],
  }),
}));

export const earningsLogRelations = relations(earningsLog, ({ one }) => ({
  user: one(users, {
    fields: [earningsLog.userId],
    references: [users.id],
  }),
}));

export const userTasksRelations = relations(userTasks, ({ one }) => ({
  user: one(users, {
    fields: [userTasks.userId],
    references: [users.id],
  }),
  task: one(tasks, {
    fields: [userTasks.taskId],
    references: [tasks.id],
  }),
}));

export const userMissionsRelations = relations(userMissions, ({ one }) => ({
  user: one(users, {
    fields: [userMissions.userId],
    references: [users.id],
  }),
  mission: one(dailyMissions, {
    fields: [userMissions.missionId],
    references: [dailyMissions.id],
  }),
}));

export const referralsRelations = relations(referrals, ({ one }) => ({
  referrer: one(users, {
    fields: [referrals.referrerId],
    references: [users.id],
    relationName: "referrer",
  }),
  referred: one(users, {
    fields: [referrals.referredId],
    references: [users.id],
    relationName: "referred",
  }),
}));

// Insert schemas
export const upsertUserSchema = createInsertSchema(users).pick({
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
});

export const insertWalletSchema = createInsertSchema(wallets).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEarningsLogSchema = createInsertSchema(earningsLog).omit({
  id: true,
  createdAt: true,
});

export const insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserTaskSchema = createInsertSchema(userTasks).omit({
  id: true,
  createdAt: true,
});

export const insertUserMissionSchema = createInsertSchema(userMissions).omit({
  id: true,
  completedAt: true,
});

export const insertReferralSchema = createInsertSchema(referrals).omit({
  id: true,
  createdAt: true,
  completedAt: true,
});

export const insertWithdrawalSchema = createInsertSchema(withdrawals).omit({
  id: true,
  createdAt: true,
  processedAt: true,
});

export const insertSpinResultSchema = createInsertSchema(spinResults).omit({
  id: true,
  createdAt: true,
});

// Types
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type User = typeof users.$inferSelect;
export type Wallet = typeof wallets.$inferSelect;
export type EarningsLog = typeof earningsLog.$inferSelect;
export type Task = typeof tasks.$inferSelect;
export type UserTask = typeof userTasks.$inferSelect;
export type DailyMission = typeof dailyMissions.$inferSelect;
export type UserMission = typeof userMissions.$inferSelect;
export type Referral = typeof referrals.$inferSelect;
export type Withdrawal = typeof withdrawals.$inferSelect;
export type SpinResult = typeof spinResults.$inferSelect;
export type InsertEarningsLog = z.infer<typeof insertEarningsLogSchema>;
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type InsertUserTask = z.infer<typeof insertUserTaskSchema>;
export type InsertUserMission = z.infer<typeof insertUserMissionSchema>;
export type InsertReferral = z.infer<typeof insertReferralSchema>;
export type InsertWithdrawal = z.infer<typeof insertWithdrawalSchema>;
export type InsertSpinResult = z.infer<typeof insertSpinResultSchema>;
