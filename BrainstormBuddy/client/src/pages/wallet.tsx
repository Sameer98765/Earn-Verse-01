import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { 
  ArrowLeft, 
  Wallet as WalletIcon, 
  Download, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  CreditCard,
  Smartphone,
  Building,
  Eye,
  EyeOff
} from "lucide-react";
import { Link } from "wouter";
import type { DashboardStats } from "@/types/api";

interface WalletData {
  wallet: {
    balance: string;
    pendingBalance: string;
    lifetimeEarnings: string;
  };
  earnings: Array<{
    id: string;
    amount: string;
    type: string;
    description: string;
    createdAt: string;
  }>;
  withdrawals: Array<{
    id: string;
    amount: string;
    method: string;
    destination: string;
    status: string;
    createdAt: string;
    processedAt: string | null;
  }>;
}

export default function Wallet() {
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [withdrawalMethod, setWithdrawalMethod] = useState("");
  const [destination, setDestination] = useState("");
  const [showBalance, setShowBalance] = useState(true);
  const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: walletData, isLoading } = useQuery<WalletData>({
    queryKey: ['/api/wallet'],
  });

  const { data: stats } = useQuery<DashboardStats>({
    queryKey: ['/api/dashboard/stats'],
  });

  const withdrawMutation = useMutation({
    mutationFn: async (data: { amount: number; method: string; destination: string }) => {
      const response = await apiRequest('POST', '/api/wallet/withdraw', data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Withdrawal Requested! 💰",
        description: "Your withdrawal request has been submitted successfully",
        variant: "default",
      });
      setIsWithdrawDialogOpen(false);
      setWithdrawalAmount("");
      setDestination("");
      queryClient.invalidateQueries({ queryKey: ['/api/wallet'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Withdrawal Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawalAmount);
    if (!amount || !withdrawalMethod || !destination) {
      toast({
        title: "Invalid Details",
        description: "Please fill in all withdrawal details",
        variant: "destructive",
      });
      return;
    }

    withdrawMutation.mutate({
      amount,
      method: withdrawalMethod,
      destination,
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Completed</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Failed</Badge>;
      case 'in_process':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Processing</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'spin':
        return '🎰';
      case 'task':
        return '📱';
      case 'mission':
        return '🎯';
      case 'referral':
        return '👥';
      case 'bonus':
        return '🎁';
      default:
        return '💰';
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          {[...Array(4)].map((_, i) => (
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

  const balance = parseFloat(walletData?.wallet.balance || '0');
  const pendingBalance = parseFloat(walletData?.wallet.pendingBalance || '0');
  const lifetimeEarnings = parseFloat(walletData?.wallet.lifetimeEarnings || '0');
  const minWithdrawal = stats?.userRole === 'pro' ? 20 : 50;

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
            <WalletIcon className="h-8 w-8 text-green-600" />
            My Wallet
          </h1>
          <p className="text-gray-600">Manage your earnings and withdrawals</p>
        </div>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <WalletIcon className="h-5 w-5 text-white" />
                </div>
                <span className="font-medium text-green-800">Available Balance</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowBalance(!showBalance)}
              >
                {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <div className="text-3xl font-bold text-green-600 mb-2">
              {showBalance ? `₹${balance.toFixed(2)}` : '₹••••'}
            </div>
            <p className="text-sm text-green-700">Ready to withdraw</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <span className="font-medium text-yellow-800">Pending Balance</span>
            </div>
            <div className="text-3xl font-bold text-yellow-600 mb-2">
              {showBalance ? `₹${pendingBalance.toFixed(2)}` : '₹••••'}
            </div>
            <p className="text-sm text-yellow-700">Under verification</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <span className="font-medium text-purple-800">Lifetime Earnings</span>
            </div>
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {showBalance ? `₹${lifetimeEarnings.toFixed(2)}` : '₹••••'}
            </div>
            <p className="text-sm text-purple-700">Total earned</p>
          </CardContent>
        </Card>
      </div>

      {/* Withdraw Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Withdraw Money</span>
            <Badge className="bg-blue-100 text-blue-800">
              Min: ₹{minWithdrawal}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-blue-800 mb-2">
                <AlertCircle className="h-4 w-4" />
                <span className="font-medium">Withdrawal Information</span>
              </div>
              <div className="text-sm text-blue-700 space-y-1">
                <p>• Minimum withdrawal: ₹{minWithdrawal} ({stats?.userRole === 'pro' ? 'Pro users' : 'Free users'})</p>
                <p>• Processing time: 1-3 business days</p>
                <p>• Withdrawals are processed Monday to Friday</p>
                <p>• Make sure your payment details are correct</p>
              </div>
            </div>

            <Dialog open={isWithdrawDialogOpen} onOpenChange={setIsWithdrawDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  className="w-full"
                  disabled={balance < minWithdrawal}
                >
                  <Download className="h-4 w-4 mr-2" />
                  {balance < minWithdrawal 
                    ? `Need ₹${(minWithdrawal - balance).toFixed(2)} more to withdraw`
                    : 'Withdraw Money'
                  }
                </Button>
              </DialogTrigger>
              
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Withdraw Money</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="amount">Amount (₹)</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder={`Min ₹${minWithdrawal}`}
                      value={withdrawalAmount}
                      onChange={(e) => setWithdrawalAmount(e.target.value)}
                      min={minWithdrawal}
                      max={balance}
                    />
                  </div>

                  <div>
                    <Label htmlFor="method">Withdrawal Method</Label>
                    <Select value={withdrawalMethod} onValueChange={setWithdrawalMethod}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="upi">
                          <div className="flex items-center gap-2">
                            <Smartphone className="h-4 w-4" />
                            UPI
                          </div>
                        </SelectItem>
                        <SelectItem value="bank">
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4" />
                            Bank Transfer
                          </div>
                        </SelectItem>
                        <SelectItem value="mobile_recharge">
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4" />
                            Mobile Recharge
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="destination">
                      {withdrawalMethod === 'upi' && 'UPI ID'}
                      {withdrawalMethod === 'bank' && 'Account Number'}
                      {withdrawalMethod === 'mobile_recharge' && 'Mobile Number'}
                      {!withdrawalMethod && 'Payment Details'}
                    </Label>
                    <Input
                      id="destination"
                      placeholder={
                        withdrawalMethod === 'upi' ? 'yourname@upi' :
                        withdrawalMethod === 'bank' ? 'Account number' :
                        withdrawalMethod === 'mobile_recharge' ? 'Mobile number' :
                        'Enter payment details'
                      }
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                    />
                  </div>

                  <Button 
                    onClick={handleWithdraw}
                    disabled={withdrawMutation.isPending}
                    className="w-full"
                  >
                    {withdrawMutation.isPending ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Request Withdrawal
                      </>
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Earnings */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {walletData?.earnings.slice(0, 5).map((earning) => (
                <div key={earning.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">
                      {getTransactionIcon(earning.type)}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {earning.description}
                      </div>
                      <div className="text-sm text-gray-600">
                        {new Date(earning.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-green-600 font-semibold">
                    +₹{parseFloat(earning.amount).toFixed(2)}
                  </div>
                </div>
              ))}
              
              {walletData?.earnings.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No earnings yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Withdrawal History */}
        <Card>
          <CardHeader>
            <CardTitle>Withdrawal History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {walletData?.withdrawals.slice(0, 5).map((withdrawal) => (
                <div key={withdrawal.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <Download className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {withdrawal.method.toUpperCase()} Withdrawal
                      </div>
                      <div className="text-sm text-gray-600">
                        {new Date(withdrawal.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">
                      ₹{parseFloat(withdrawal.amount).toFixed(2)}
                    </div>
                    {getStatusBadge(withdrawal.status)}
                  </div>
                </div>
              ))}
              
              {walletData?.withdrawals.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Download className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No withdrawals yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pro Upgrade CTA for Free Users */}
      {stats?.userRole === 'free' && (
        <Card className="bg-gradient-to-r from-primary to-secondary text-white">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="mb-4 lg:mb-0">
                <h3 className="text-xl font-bold mb-2">Lower Your Withdrawal Limit</h3>
                <p className="text-indigo-100">
                  Pro users can withdraw from just ₹20 instead of ₹50. 
                  Get your money faster!
                </p>
              </div>
              <Button className="bg-yellow-400 text-gray-900 hover:bg-yellow-300 font-bold">
                <Download className="mr-2 h-4 w-4" />
                Upgrade to Pro
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
