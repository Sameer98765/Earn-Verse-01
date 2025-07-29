import {
  users,
  wallets,
  earningsLog,
  tasks,
  userTasks,
  dailyMissions,
  userMissions,
  referrals,
  withdrawals,
  spinResults,
  authTokens,
  type User,
  type UpsertUser,
  type Wallet,
  type EarningsLog,
  type Task,
  type UserTask,
  type DailyMission,
  type UserMission,
  type Referral,
  type Withdrawal,
  type SpinResult,
  type InsertEarningsLog,
  type InsertTask,
  type InsertUserTask,
  type InsertUserMission,
  type InsertReferral,
  type InsertWithdrawal,
  type InsertSpinResult,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, sql, gte, lte } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserRole(userId: string, role: 'free' | 'pro'): Promise<void>;
  getUserWithWallet(id: string): Promise<(User & { wallet: Wallet }) | undefined>;
  
  // Wallet operations
  getWallet(userId: string): Promise<Wallet | undefined>;
  createWallet(userId: string): Promise<Wallet>;
  updateWalletBalance(userId: string, amount: number, pending?: boolean): Promise<void>;
  
  // Earnings operations
  logEarning(earning: InsertEarningsLog): Promise<EarningsLog>;
  getUserEarnings(userId: string, limit?: number): Promise<EarningsLog[]>;
  getUserEarningsStats(userId: string): Promise<{
    today: number;
    thisMonth: number;
    total: number;
  }>;
  
  // Tasks operations
  getTasks(userRole: 'free' | 'pro'): Promise<Task[]>;
  getTask(id: string): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  completeUserTask(userTask: InsertUserTask): Promise<UserTask>;
  getUserTaskHistory(userId: string): Promise<UserTask[]>;
  
  // Missions operations
  getDailyMissions(userRole: 'free' | 'pro'): Promise<DailyMission[]>;
  getUserMissionsToday(userId: string): Promise<UserMission[]>;
  completeMission(mission: InsertUserMission): Promise<UserMission>;
  
  // Spin operations
  getUserSpinsToday(userId: string): Promise<SpinResult[]>;
  recordSpin(spin: InsertSpinResult): Promise<SpinResult>;
  
  // Referral operations
  createReferral(referral: InsertReferral): Promise<Referral>;
  getUserReferrals(userId: string): Promise<Referral[]>;
  updateReferralStatus(id: string, status: string, reward?: number): Promise<void>;
  
  // Withdrawal operations
  createWithdrawal(withdrawal: InsertWithdrawal): Promise<Withdrawal>;
  getUserWithdrawals(userId: string): Promise<Withdrawal[]>;
  updateWithdrawalStatus(id: string, status: any, transactionId?: string): Promise<void>;
  
  // Utility operations
  generateReferralCode(): Promise<string>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        ...userData,
        referralCode: await this.generateReferralCode(),
      })
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    
    // Create wallet for new user if it doesn't exist
    await this.createWallet(user.id);
    
    return user;
  }

  async updateUserRole(userId: string, role: 'free' | 'pro'): Promise<void> {
    const proExpiresAt = role === 'pro' ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : null;
    await db
      .update(users)
      .set({ 
        role, 
        proExpiresAt,
        updatedAt: new Date() 
      })
      .where(eq(users.id, userId));
  }

  async getUserWithWallet(id: string): Promise<(User & { wallet: Wallet }) | undefined> {
    const result = await db
      .select()
      .from(users)
      .leftJoin(wallets, eq(users.id, wallets.userId))
      .where(eq(users.id, id))
      .limit(1);

    if (result.length === 0) return undefined;

    const { users: user, wallets: wallet } = result[0];
    if (!wallet) return undefined;

    return { ...user, wallet };
  }

  async getWallet(userId: string): Promise<Wallet | undefined> {
    const [wallet] = await db.select().from(wallets).where(eq(wallets.userId, userId));
    return wallet;
  }

  async createWallet(userId: string): Promise<Wallet> {
    try {
      const [wallet] = await db
        .insert(wallets)
        .values({ userId })
        .onConflictDoNothing()
        .returning();
      
      if (wallet) return wallet;
      
      // If wallet already exists, return it
      const existing = await this.getWallet(userId);
      return existing!;
    } catch (error) {
      const existing = await this.getWallet(userId);
      if (existing) return existing;
      throw error;
    }
  }

  async updateWalletBalance(userId: string, amount: number, pending = false): Promise<void> {
    const field = pending ? 'pendingBalance' : 'balance';
    await db
      .update(wallets)
      .set({
        [field]: sql`${wallets[field]} + ${amount}`,
        lifetimeEarnings: sql`${wallets.lifetimeEarnings} + ${amount}`,
        updatedAt: new Date(),
      })
      .where(eq(wallets.userId, userId));
  }

  async logEarning(earning: InsertEarningsLog): Promise<EarningsLog> {
    const [log] = await db.insert(earningsLog).values(earning).returning();
    return log;
  }

  async getUserEarnings(userId: string, limit = 50): Promise<EarningsLog[]> {
    return await db
      .select()
      .from(earningsLog)
      .where(eq(earningsLog.userId, userId))
      .orderBy(desc(earningsLog.createdAt))
      .limit(limit);
  }

  async getUserEarningsStats(userId: string): Promise<{
    today: number;
    thisMonth: number;
    total: number;
  }> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    const [todayResult] = await db
      .select({ total: sql<number>`COALESCE(SUM(${earningsLog.amount}), 0)` })
      .from(earningsLog)
      .where(
        and(
          eq(earningsLog.userId, userId),
          gte(earningsLog.createdAt, today)
        )
      );

    const [monthResult] = await db
      .select({ total: sql<number>`COALESCE(SUM(${earningsLog.amount}), 0)` })
      .from(earningsLog)
      .where(
        and(
          eq(earningsLog.userId, userId),
          gte(earningsLog.createdAt, firstDayOfMonth)
        )
      );

    const [totalResult] = await db
      .select({ total: sql<number>`COALESCE(SUM(${earningsLog.amount}), 0)` })
      .from(earningsLog)
      .where(eq(earningsLog.userId, userId));

    return {
      today: Number(todayResult.total),
      thisMonth: Number(monthResult.total),
      total: Number(totalResult.total),
    };
  }

  async getTasks(userRole: 'free' | 'pro'): Promise<Task[]> {
    return await db
      .select()
      .from(tasks)
      .where(
        and(
          eq(tasks.isActive, true),
          userRole === 'free' 
            ? eq(tasks.minUserRole, 'free')
            : sql`${tasks.minUserRole} IN ('free', 'pro')`
        )
      )
      .orderBy(desc(tasks.reward));
  }

  async getTask(id: string): Promise<Task | undefined> {
    const [task] = await db.select().from(tasks).where(eq(tasks.id, id));
    return task;
  }

  async createTask(task: InsertTask): Promise<Task> {
    const [newTask] = await db.insert(tasks).values(task).returning();
    return newTask;
  }

  async completeUserTask(userTask: InsertUserTask): Promise<UserTask> {
    const [completed] = await db.insert(userTasks).values(userTask).returning();
    return completed;
  }

  async getUserTaskHistory(userId: string): Promise<UserTask[]> {
    return await db
      .select()
      .from(userTasks)
      .where(eq(userTasks.userId, userId))
      .orderBy(desc(userTasks.createdAt));
  }

  async getDailyMissions(userRole: 'free' | 'pro'): Promise<DailyMission[]> {
    return await db
      .select()
      .from(dailyMissions)
      .where(
        and(
          eq(dailyMissions.isActive, true),
          userRole === 'free' 
            ? eq(dailyMissions.minUserRole, 'free')
            : sql`${dailyMissions.minUserRole} IN ('free', 'pro')`
        )
      )
      .orderBy(dailyMissions.sortOrder);
  }

  async getUserMissionsToday(userId: string): Promise<UserMission[]> {
    const today = new Date().toISOString().split('T')[0];
    return await db
      .select()
      .from(userMissions)
      .where(
        and(
          eq(userMissions.userId, userId),
          eq(userMissions.date, today)
        )
      );
  }

  async completeMission(mission: InsertUserMission): Promise<UserMission> {
    const today = new Date().toISOString().split('T')[0];
    const [completed] = await db
      .insert(userMissions)
      .values({ ...mission, date: today })
      .returning();
    return completed;
  }

  async getUserSpinsToday(userId: string): Promise<SpinResult[]> {
    const today = new Date().toISOString().split('T')[0];
    return await db
      .select()
      .from(spinResults)
      .where(
        and(
          eq(spinResults.userId, userId),
          eq(spinResults.date, today)
        )
      )
      .orderBy(spinResults.spinNumber);
  }

  async recordSpin(spin: InsertSpinResult): Promise<SpinResult> {
    const today = new Date().toISOString().split('T')[0];
    const [result] = await db
      .insert(spinResults)
      .values({ ...spin, date: today })
      .returning();
    return result;
  }

  async createReferral(referral: InsertReferral): Promise<Referral> {
    const [newReferral] = await db.insert(referrals).values(referral).returning();
    return newReferral;
  }

  async getUserReferrals(userId: string): Promise<Referral[]> {
    return await db
      .select()
      .from(referrals)
      .where(eq(referrals.referrerId, userId))
      .orderBy(desc(referrals.createdAt));
  }

  async updateReferralStatus(id: string, status: string, reward = 0): Promise<void> {
    await db
      .update(referrals)
      .set({ 
        status, 
        rewardEarned: reward.toString(),
        completedAt: status === 'completed' ? new Date() : null
      })
      .where(eq(referrals.id, id));
  }

  async createWithdrawal(withdrawal: InsertWithdrawal): Promise<Withdrawal> {
    const [newWithdrawal] = await db.insert(withdrawals).values(withdrawal).returning();
    return newWithdrawal;
  }

  async getUserWithdrawals(userId: string): Promise<Withdrawal[]> {
    return await db
      .select()
      .from(withdrawals)
      .where(eq(withdrawals.userId, userId))
      .orderBy(desc(withdrawals.createdAt));
  }

  async updateWithdrawalStatus(id: string, status: any, transactionId?: string): Promise<void> {
    await db
      .update(withdrawals)
      .set({
        status,
        processorTransactionId: transactionId,
        processedAt: new Date(),
      })
      .where(eq(withdrawals.id, id));
  }

  async generateReferralCode(): Promise<string> {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    // Check if code exists
    const existing = await db.select().from(users).where(eq(users.referralCode, code));
    if (existing.length > 0) {
      return this.generateReferralCode(); // Recursively generate new code
    }
    
    return code;
  }
}

export const storage = new DatabaseStorage();
