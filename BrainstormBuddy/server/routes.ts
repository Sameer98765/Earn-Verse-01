import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const userWithWallet = await storage.getUserWithWallet(userId);
      if (!userWithWallet) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(userWithWallet);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Dashboard stats
  app.get('/api/dashboard/stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      const wallet = await storage.getWallet(userId);
      const earnings = await storage.getUserEarningsStats(userId);
      const spinsToday = await storage.getUserSpinsToday(userId);
      const missionsToday = await storage.getUserMissionsToday(userId);
      
      const maxSpins = user?.role === 'pro' ? 2 : 1;
      const availableSpins = maxSpins - spinsToday.length;

      res.json({
        balance: wallet?.balance || 0,
        pendingBalance: wallet?.pendingBalance || 0,
        lifetimeEarnings: wallet?.lifetimeEarnings || 0,
        todayEarnings: earnings.today,
        thisMonthEarnings: earnings.thisMonth,
        streakCount: user?.streakCount || 0,
        availableSpins,
        missionsCompleted: missionsToday.length,
        userRole: user?.role || 'free',
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // Spin the wheel
  app.post('/api/rewards/spin', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const spinsToday = await storage.getUserSpinsToday(userId);
      const maxSpins = user.role === 'pro' ? 2 : 1;

      if (spinsToday.length >= maxSpins) {
        return res.status(400).json({ message: "Daily spin limit reached" });
      }

      // Weighted probability system
      const random = Math.random();
      let result: string;
      let amount = 0;

      if (random < 0.4) {
        result = 'try_again';
      } else if (random < 0.7) {
        result = 'amount';
        amount = 1;
      } else if (random < 0.85) {
        result = 'bonus_task';
        amount = 5;
      } else if (random < 0.95) {
        result = 'amount';
        amount = 5;
      } else {
        result = 'amount';
        amount = 10;
      }

      // Record spin
      const spinNumber = spinsToday.length + 1;
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
      await storage.recordSpin({
        userId,
        result,
        amount: amount.toString(),
        spinNumber,
        date: today,
      });

      // Update wallet if amount won
      if (amount > 0) {
        await storage.updateWalletBalance(userId, amount);
        await storage.logEarning({
          userId,
          amount: amount.toString(),
          type: 'spin',
          description: `Daily spin reward - ${result}`,
        });
      }

      res.json({
        result,
        amount,
        message: amount > 0 ? `Congratulations! You won ₹${amount}` : 'Better luck next time!'
      });
    } catch (error) {
      console.error("Error processing spin:", error);
      res.status(500).json({ message: "Failed to process spin" });
    }
  });

  // Get tasks
  app.get('/api/tasks', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const tasks = await storage.getTasks(user.role);
      res.json(tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  });

  // Complete task
  app.post('/api/tasks/:taskId/complete', isAuthenticated, async (req: any, res) => {
    try {
      const { taskId } = req.params;
      const userId = req.user.claims.sub;
      
      const task = await storage.getTask(taskId);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      // Check if user already completed this task
      const history = await storage.getUserTaskHistory(userId);
      const alreadyCompleted = history.some(ut => ut.taskId === taskId && ut.status === 'completed');
      
      if (alreadyCompleted) {
        return res.status(400).json({ message: "Task already completed" });
      }

      // Complete task
      await storage.completeUserTask({
        userId,
        taskId,
        status: 'completed',
        completedAt: new Date(),
      });

      // Add to pending balance (tasks need verification)
      await storage.updateWalletBalance(userId, Number(task.reward), true);
      await storage.logEarning({
        userId,
        amount: task.reward,
        type: 'task',
        sourceId: taskId,
        description: `Task completed: ${task.title}`,
      });

      res.json({ 
        message: "Task completed successfully",
        reward: task.reward,
        status: 'pending'
      });
    } catch (error) {
      console.error("Error completing task:", error);
      res.status(500).json({ message: "Failed to complete task" });
    }
  });

  // Get daily missions
  app.get('/api/missions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const missions = await storage.getDailyMissions(user.role);
      const completedToday = await storage.getUserMissionsToday(userId);
      const completedIds = completedToday.map(m => m.missionId);

      const missionsWithStatus = missions.map(mission => ({
        ...mission,
        completed: completedIds.includes(mission.id),
      }));

      res.json(missionsWithStatus);
    } catch (error) {
      console.error("Error fetching missions:", error);
      res.status(500).json({ message: "Failed to fetch missions" });
    }
  });

  // Complete mission
  app.post('/api/missions/:missionId/complete', isAuthenticated, async (req: any, res) => {
    try {
      const { missionId } = req.params;
      const userId = req.user.claims.sub;
      
      const mission = await storage.getDailyMissions('pro').then(missions => 
        missions.find(m => m.id === missionId)
      );
      
      if (!mission) {
        return res.status(404).json({ message: "Mission not found" });
      }

      // Check if already completed today
      const completedToday = await storage.getUserMissionsToday(userId);
      const alreadyCompleted = completedToday.some(m => m.missionId === missionId);
      
      if (alreadyCompleted) {
        return res.status(400).json({ message: "Mission already completed today" });
      }

      // Complete mission
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
      await storage.completeMission({
        userId,
        missionId,
        date: today,
      });

      // Add reward immediately (missions are instant)
      await storage.updateWalletBalance(userId, Number(mission.reward));
      await storage.logEarning({
        userId,
        amount: mission.reward,
        type: 'mission',
        sourceId: missionId,
        description: `Mission completed: ${mission.title}`,
      });

      res.json({ 
        message: "Mission completed successfully",
        reward: mission.reward
      });
    } catch (error) {
      console.error("Error completing mission:", error);
      res.status(500).json({ message: "Failed to complete mission" });
    }
  });

  // Get referrals
  app.get('/api/referrals', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const referrals = await storage.getUserReferrals(userId);
      res.json(referrals);
    } catch (error) {
      console.error("Error fetching referrals:", error);
      res.status(500).json({ message: "Failed to fetch referrals" });
    }
  });

  // Get wallet and transactions
  app.get('/api/wallet', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const wallet = await storage.getWallet(userId);
      const earnings = await storage.getUserEarnings(userId);
      const withdrawals = await storage.getUserWithdrawals(userId);

      res.json({
        wallet,
        earnings,
        withdrawals,
      });
    } catch (error) {
      console.error("Error fetching wallet:", error);
      res.status(500).json({ message: "Failed to fetch wallet" });
    }
  });

  // Create withdrawal
  const withdrawalSchema = z.object({
    amount: z.number().min(1),
    method: z.enum(['upi', 'bank', 'mobile_recharge']),
    destination: z.string().min(1),
  });

  app.post('/api/wallet/withdraw', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      const wallet = await storage.getWallet(userId);
      
      if (!user || !wallet) {
        return res.status(404).json({ message: "User or wallet not found" });
      }

      const { amount, method, destination } = withdrawalSchema.parse(req.body);
      
      // Check minimum withdrawal amount
      const minWithdrawal = user.role === 'pro' ? 20 : 50;
      if (amount < minWithdrawal) {
        return res.status(400).json({ 
          message: `Minimum withdrawal amount is ₹${minWithdrawal}` 
        });
      }

      // Check balance
      if (Number(wallet.balance) < amount) {
        return res.status(400).json({ message: "Insufficient balance" });
      }

      // Create withdrawal request
      const withdrawal = await storage.createWithdrawal({
        userId,
        amount: amount.toString(),
        method,
        destination,
      });

      // Deduct from wallet
      await storage.updateWalletBalance(userId, -amount);

      res.json({
        message: "Withdrawal request created successfully",
        withdrawal,
      });
    } catch (error) {
      console.error("Error creating withdrawal:", error);
      res.status(500).json({ message: "Failed to create withdrawal" });
    }
  });

  // Upgrade to Pro
  app.post('/api/user/upgrade-pro', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // In a real app, you'd integrate with payment processor here
      await storage.updateUserRole(userId, 'pro');

      res.json({ message: "Successfully upgraded to Pro!" });
    } catch (error) {
      console.error("Error upgrading to pro:", error);
      res.status(500).json({ message: "Failed to upgrade to pro" });
    }
  });

  // Get earnings history
  app.get('/api/earnings', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const earnings = await storage.getUserEarnings(userId);
      const stats = await storage.getUserEarningsStats(userId);
      
      res.json({
        earnings,
        stats,
      });
    } catch (error) {
      console.error("Error fetching earnings:", error);
      res.status(500).json({ message: "Failed to fetch earnings" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
