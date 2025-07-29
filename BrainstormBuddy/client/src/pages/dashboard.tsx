import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import EarningsCard from "@/components/ui/earnings-card";
import { 
  Coins, 
  Gift, 
  Target, 
  Users, 
  TrendingUp, 
  Clock,
  Crown,
  ArrowRight,
  Zap,
  Award
} from "lucide-react";
import { Link } from "wouter";

interface DashboardStats {
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

export default function Dashboard() {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ['/api/dashboard/stats'],
  });

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back!</h1>
          <p className="text-gray-600 mt-1">Ready to earn some money today?</p>
        </div>
        
        {stats?.userRole === 'free' && (
          <Button className="mt-4 lg:mt-0 bg-gradient-to-r from-primary to-secondary">
            <Crown className="mr-2 h-4 w-4" />
            Upgrade to Pro
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <EarningsCard
          title="Available Balance"
          amount={stats?.balance || 0}
          icon={<Coins className="h-5 w-5" />}
          trend={stats?.todayEarnings || 0}
          trendLabel="Today"
          className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200"
        />
        
        <EarningsCard
          title="Pending Earnings"
          amount={stats?.pendingBalance || 0}
          icon={<Clock className="h-5 w-5" />}
          trend={0}
          trendLabel="Processing"
          className="bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200"
        />
        
        <EarningsCard
          title="This Month"
          amount={stats?.thisMonthEarnings || 0}
          icon={<TrendingUp className="h-5 w-5" />}
          trend={0}
          trendLabel="30 days"
          className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200"
        />
        
        <EarningsCard
          title="Lifetime Total"
          amount={stats?.lifetimeEarnings || 0}
          icon={<Award className="h-5 w-5" />}
          trend={0}
          trendLabel="All time"
          className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Spin Wheel */}
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-orange-100"></div>
          <CardHeader className="relative">
            <CardTitle className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-r from-accent to-orange-400 rounded-xl flex items-center justify-center">
                <Gift className="h-5 w-5 text-white" />
              </div>
              Daily Spin
            </CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Available Spins</span>
                <Badge variant={stats?.availableSpins! > 0 ? "default" : "secondary"}>
                  {stats?.availableSpins} / {stats?.userRole === 'pro' ? 2 : 1}
                </Badge>
              </div>
              
              {stats?.availableSpins! > 0 ? (
                <Link href="/spin">
                  <Button className="w-full bg-gradient-to-r from-accent to-orange-400 hover:from-orange-400 hover:to-accent">
                    <Zap className="mr-2 h-4 w-4" />
                    Spin Now
                  </Button>
                </Link>
              ) : (
                <Button disabled className="w-full">
                  Come back tomorrow
                </Button>
              )}
              
              <p className="text-xs text-gray-500 text-center">
                Win ₹1-50 instantly!
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Missions */}
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-green-100"></div>
          <CardHeader className="relative">
            <CardTitle className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-r from-secondary to-green-500 rounded-xl flex items-center justify-center">
                <Target className="h-5 w-5 text-white" />
              </div>
              Daily Missions
            </CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Progress</span>
                <span className="text-sm font-medium">{stats?.missionsCompleted}/5</span>
              </div>
              
              <Progress value={(stats?.missionsCompleted || 0) * 20} className="h-2" />
              
              <Link href="/missions">
                <Button variant="outline" className="w-full">
                  <Target className="mr-2 h-4 w-4" />
                  View Missions
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              
              <p className="text-xs text-gray-500 text-center">
                Complete all for streak bonus!
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Streak Counter */}
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-blue-100"></div>
          <CardHeader className="relative">
            <CardTitle className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-blue-500 rounded-xl flex items-center justify-center">
                <Award className="h-5 w-5 text-white" />
              </div>
              Earning Streak
            </CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  🔥 {stats?.streakCount}
                </div>
                <p className="text-sm text-gray-600">
                  {stats?.streakCount === 1 ? 'Day' : 'Days'} Streak
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Next bonus at 7 days</span>
                  <span>{Math.max(0, 7 - (stats?.streakCount || 0))} to go</span>
                </div>
                <Progress value={((stats?.streakCount || 0) / 7) * 100} className="h-2" />
              </div>
              
              <p className="text-xs text-gray-500 text-center">
                Complete tasks daily to maintain streak
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/tasks">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-indigo-600 rounded-xl flex items-center justify-center">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">Browse Tasks</h3>
                  <p className="text-sm text-gray-600">Complete surveys & app installs</p>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 ml-auto" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/referrals">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">Invite Friends</h3>
                  <p className="text-sm text-gray-600">Earn ₹{stats?.userRole === 'pro' ? '10' : '5'} per referral</p>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 ml-auto" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/wallet">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <Coins className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">Withdraw Money</h3>
                  <p className="text-sm text-gray-600">Minimum ₹{stats?.userRole === 'pro' ? '20' : '50'}</p>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 ml-auto" />
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Pro Upgrade CTA for Free Users */}
      {stats?.userRole === 'free' && (
        <Card className="bg-gradient-to-r from-primary to-secondary text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-10"></div>
          <CardContent className="p-8 relative">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="mb-6 lg:mb-0">
                <h3 className="text-2xl font-bold mb-2">Unlock Your Earning Potential</h3>
                <p className="text-indigo-100 mb-4">
                  Pro users earn 25x more on average. Get exclusive offers up to ₹500!
                </p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center">
                    <Crown className="mr-2 h-4 w-4 text-yellow-300" />
                    <span>2 daily spins</span>
                  </div>
                  <div className="flex items-center">
                    <Crown className="mr-2 h-4 w-4 text-yellow-300" />
                    <span>Premium offers</span>
                  </div>
                  <div className="flex items-center">
                    <Crown className="mr-2 h-4 w-4 text-yellow-300" />
                    <span>Lower withdrawal limits</span>
                  </div>
                </div>
              </div>
              <Button className="bg-yellow-400 text-gray-900 hover:bg-yellow-300 font-bold">
                <Crown className="mr-2 h-5 w-5" />
                Upgrade to Pro - ₹99/month
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
