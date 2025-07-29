// API response types
export interface DashboardStats {
  balance: number;
  pendingBalance: number;
  lifetimeEarnings: number;
  todayEarnings: number;
  thisMonthEarnings: number;
  streakCount: number;
  availableSpins: number;
  missionsCompleted: number;
  userRole: 'free' | 'pro';
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImageUrl?: string;
  referralCode: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  reward: string;
  provider?: string;
  category: string;
  minUserRole: 'free' | 'pro';
  isActive: boolean;
}

export interface EarningsData {
  earnings: Array<{
    id: string;
    amount: string;
    type: string;
    description: string;
    createdAt: string;
  }>;
  stats: {
    today: number;
    thisMonth: number;
    total: number;
  };
}