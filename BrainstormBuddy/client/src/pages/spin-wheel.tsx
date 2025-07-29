import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SpinningWheel from "@/components/ui/spinning-wheel";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Gift, Clock, Crown, ArrowLeft, Sparkles } from "lucide-react";
import { Link } from "wouter";

interface SpinResult {
  result: string;
  amount: number;
  message: string;
}

interface DashboardStats {
  availableSpins: number;
  userRole: 'free' | 'pro';
}

export default function SpinWheel() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [lastResult, setLastResult] = useState<SpinResult | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: stats } = useQuery<DashboardStats>({
    queryKey: ['/api/dashboard/stats'],
  });

  const spinMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/rewards/spin');
      return response.json();
    },
    onSuccess: (result: SpinResult) => {
      setLastResult(result);
      setIsSpinning(false);
      
      if (result.amount > 0) {
        toast({
          title: "Congratulations! 🎉",
          description: result.message,
          variant: "default",
        });
      } else {
        toast({
          title: "Better luck next time!",
          description: result.message,
          variant: "default",
        });
      }
      
      // Refresh dashboard stats
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
    },
    onError: (error: Error) => {
      setIsSpinning(false);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleSpin = () => {
    setIsSpinning(true);
    setLastResult(null);
    spinMutation.mutate();
  };

  const canSpin = (stats?.availableSpins || 0) > 0;
  const maxSpins = stats?.userRole === 'pro' ? 2 : 1;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
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
            <Gift className="h-8 w-8 text-accent" />
            Daily Spin Wheel
          </h1>
          <p className="text-gray-600">Spin once daily for guaranteed rewards!</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Spin Wheel */}
        <div className="lg:col-span-2">
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-orange-50"></div>
            <CardContent className="p-8 relative">
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Badge variant={canSpin ? "default" : "secondary"} className="text-lg px-4 py-2">
                    <Clock className="mr-2 h-4 w-4" />
                    {stats?.availableSpins} / {maxSpins} Spins Available
                  </Badge>
                </div>
              </div>

              {/* Spinning Wheel Component */}
              <div className="flex justify-center mb-8">
                <SpinningWheel 
                  isSpinning={isSpinning} 
                  result={lastResult?.result}
                />
              </div>

              {/* Spin Button */}
              <div className="text-center">
                {canSpin ? (
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-accent to-orange-400 hover:from-orange-400 hover:to-accent text-gray-900 font-bold px-8 py-4 text-lg"
                    onClick={handleSpin}
                    disabled={isSpinning || spinMutation.isPending}
                  >
                    {isSpinning ? (
                      <>
                        <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin mr-2"></div>
                        Spinning...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-5 w-5" />
                        Spin the Wheel!
                      </>
                    )}
                  </Button>
                ) : (
                  <div className="text-center">
                    <Button size="lg" disabled className="mb-4">
                      <Clock className="mr-2 h-4 w-4" />
                      No Spins Remaining
                    </Button>
                    <p className="text-gray-600">Come back tomorrow for more spins!</p>
                  </div>
                )}
              </div>

              {/* Last Result */}
              {lastResult && (
                <div className="mt-8 p-6 bg-white rounded-lg border-2 border-dashed border-gray-200 text-center">
                  <div className="text-2xl mb-2">
                    {lastResult.amount > 0 ? '🎉' : '😊'}
                  </div>
                  <h3 className="font-bold text-lg mb-2">
                    {lastResult.amount > 0 ? `You won ₹${lastResult.amount}!` : 'Try again tomorrow!'}
                  </h3>
                  <p className="text-gray-600">{lastResult.message}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* Spin Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">How It Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">₹1 - Most common (30%)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">₹5 - Good luck (15%)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm">₹10 - Jackpot (5%)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-sm">Bonus Task (15%)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  <span className="text-sm">Try Again (40%)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pro Upgrade for Free Users */}
          {stats?.userRole === 'free' && (
            <Card className="bg-gradient-to-br from-primary to-secondary text-white">
              <CardContent className="p-6">
                <div className="text-center">
                  <Crown className="h-8 w-8 text-yellow-300 mx-auto mb-3" />
                  <h3 className="font-bold mb-2">Unlock Pro Benefits</h3>
                  <p className="text-sm text-indigo-100 mb-4">
                    Get 2 daily spins instead of 1!
                  </p>
                  <Button className="bg-yellow-400 text-gray-900 hover:bg-yellow-300 w-full">
                    Upgrade to Pro
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Rules */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Rules</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                <span>Free users get 1 spin per day</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                <span>Pro users get 2 spins per day</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                <span>Spins reset at midnight (IST)</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                <span>Rewards are added instantly</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                <span>Bonus tasks unlock quick missions</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
