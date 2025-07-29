import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useEffect } from "react";
import { 
  ArrowLeft, 
  User, 
  Crown, 
  Mail, 
  Calendar, 
  Award, 
  TrendingUp,
  Shield,
  Settings,
  LogOut,
  Star,
  Gift,
  Target,
  Users as UsersIcon,
  Smartphone
} from "lucide-react";
import { Link } from "wouter";
import type { DashboardStats, User as UserType, EarningsData } from "@/types/api";

export default function Profile() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: stats } = useQuery<DashboardStats>({
    queryKey: ['/api/dashboard/stats'],
    enabled: isAuthenticated,
  });

  const { data: earningsData } = useQuery<EarningsData>({
    queryKey: ['/api/earnings'],
    enabled: isAuthenticated,
  });

  const upgradeMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/user/upgrade-pro');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Welcome to Pro! 🎉",
        description: "You now have access to all premium features",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Upgrade Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  const memberSince = user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown';
  const isPro = stats?.userRole === 'pro';

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <User className="h-8 w-8 text-primary" />
            My Profile
          </h1>
          <p className="text-gray-600">Manage your account and preferences</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <Avatar className="h-24 w-24 mx-auto mb-4">
                  <AvatarImage src={user?.profileImageUrl} alt={user?.firstName} />
                  <AvatarFallback className="text-xl">
                    {user?.firstName?.charAt(0) || user?.email?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  {user?.firstName} {user?.lastName}
                </h2>
                
                <p className="text-gray-600 mb-4">{user?.email}</p>
                
                <div className="flex justify-center mb-4">
                  {isPro ? (
                    <Badge className="bg-gradient-to-r from-primary to-secondary text-white border-0">
                      <Crown className="h-3 w-3 mr-1" />
                      Pro Member
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      Free Member
                    </Badge>
                  )}
                </div>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center justify-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {memberSince}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Shield className="h-4 w-4" />
                    <span>Verified Account</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Settings className="h-4 w-4 mr-2" />
                Account Settings
              </Button>
              
              <Button variant="outline" className="w-full justify-start">
                <Shield className="h-4 w-4 mr-2" />
                Security & Privacy
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start text-red-600 hover:text-red-700"
                onClick={() => window.location.href = "/api/logout"}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Log Out
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Stats and Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Earning Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Earning Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    ₹{stats?.balance || 0}
                  </div>
                  <div className="text-sm text-gray-600">Available Balance</div>
                </div>
                
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 mb-1">
                    ₹{earningsData?.stats?.total || 0}
                  </div>
                  <div className="text-sm text-gray-600">Total Earned</div>
                </div>
                
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600 mb-1">
                    🔥 {stats?.streakCount || 0}
                  </div>
                  <div className="text-sm text-gray-600">Current Streak</div>
                </div>
                
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {stats?.missionsCompleted || 0}
                  </div>
                  <div className="text-sm text-gray-600">Tasks Today</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Features */}
          <Card>
            <CardHeader>
              <CardTitle>Account Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Gift className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="font-medium">Daily Spins</div>
                    <div className="text-sm text-gray-600">
                      {isPro ? '2 spins per day' : '1 spin per day'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                    <Smartphone className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="font-medium">Task Access</div>
                    <div className="text-sm text-gray-600">
                      {isPro ? 'Up to ₹500 tasks' : 'Up to ₹30 tasks'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                  <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                    <UsersIcon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="font-medium">Referral Bonus</div>
                    <div className="text-sm text-gray-600">
                      {isPro ? '₹10 per referral' : '₹5 per referral'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                  <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="font-medium">Withdrawal Limit</div>
                    <div className="text-sm text-gray-600">
                      {isPro ? 'Minimum ₹20' : 'Minimum ₹50'}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pro Upgrade */}
          {!isPro && (
            <Card className="bg-gradient-to-r from-primary to-secondary text-white">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="mb-4 lg:mb-0">
                    <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                      <Crown className="h-5 w-5 text-yellow-300" />
                      Upgrade to Pro
                    </h3>
                    <p className="text-indigo-100 mb-2">
                      Unlock all premium features and earn up to 25x more money
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center">
                        <Star className="mr-1 h-3 w-3 text-yellow-300" />
                        <span>2 daily spins</span>
                      </div>
                      <div className="flex items-center">
                        <Star className="mr-1 h-3 w-3 text-yellow-300" />
                        <span>High-paying tasks</span>
                      </div>
                      <div className="flex items-center">
                        <Star className="mr-1 h-3 w-3 text-yellow-300" />
                        <span>Lower withdrawal limits</span>
                      </div>
                    </div>
                  </div>
                  <Button 
                    className="bg-yellow-400 text-gray-900 hover:bg-yellow-300 font-bold"
                    onClick={() => upgradeMutation.mutate()}
                    disabled={upgradeMutation.isPending}
                  >
                    {upgradeMutation.isPending ? (
                      <>
                        <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin mr-2"></div>
                        Upgrading...
                      </>
                    ) : (
                      <>
                        <Crown className="mr-2 h-4 w-4" />
                        Upgrade Now - ₹99/month
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Pro Benefits */}
          {isPro && (
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                    <Crown className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-green-900">Pro Member Benefits</h3>
                    <p className="text-green-700">You're enjoying all premium features!</p>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center text-green-800">
                    <Award className="mr-2 h-4 w-4" />
                    <span>2 daily spin wheels</span>
                  </div>
                  <div className="flex items-center text-green-800">
                    <Award className="mr-2 h-4 w-4" />
                    <span>Tasks up to ₹500</span>
                  </div>
                  <div className="flex items-center text-green-800">
                    <Award className="mr-2 h-4 w-4" />
                    <span>Premium missions</span>
                  </div>
                  <div className="flex items-center text-green-800">
                    <Award className="mr-2 h-4 w-4" />
                    <span>₹20 minimum withdrawal</span>
                  </div>
                  <div className="flex items-center text-green-800">
                    <Award className="mr-2 h-4 w-4" />
                    <span>Higher referral bonuses</span>
                  </div>
                  <div className="flex items-center text-green-800">
                    <Award className="mr-2 h-4 w-4" />
                    <span>Priority support</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Account Security */}
          <Card>
            <CardHeader>
              <CardTitle>Account Security</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <Shield className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-green-900">Email Verified</div>
                      <div className="text-sm text-green-700">Your email is verified and secure</div>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800 border-green-200">Verified</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <Shield className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-blue-900">Secure Login</div>
                      <div className="text-sm text-blue-700">Protected by advanced security</div>
                    </div>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200">Active</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
