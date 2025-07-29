import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Crown, 
  Check, 
  Zap, 
  Target, 
  Users, 
  Wallet, 
  Star,
  TrendingUp,
  X
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ProUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProUpgradeModal({ isOpen, onClose }: ProUpgradeModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
      onClose();
    },
    onError: (error: Error) => {
      toast({
        title: "Upgrade Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const features = [
    {
      icon: <Zap className="h-5 w-5" />,
      title: "2 Daily Spins",
      description: "Double your chances to win daily rewards",
      highlight: true,
    },
    {
      icon: <Target className="h-5 w-5" />,
      title: "Exclusive High-Paying Tasks",
      description: "Access to offers worth up to ₹500",
      highlight: true,
    },
    {
      icon: <Wallet className="h-5 w-5" />,
      title: "Lower Withdrawal Limit",
      description: "Withdraw from just ₹20 instead of ₹50",
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: "Higher Referral Bonuses",
      description: "Earn ₹10 per referral instead of ₹5",
    },
    {
      icon: <Star className="h-5 w-5" />,
      title: "Premium Missions",
      description: "Access to exclusive daily missions (₹5-₹10)",
    },
    {
      icon: <TrendingUp className="h-5 w-5" />,
      title: "Priority Support",
      description: "Get faster responses to your queries",
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mb-4">
            <Crown className="h-8 w-8 text-yellow-300" />
          </div>
          
          <DialogTitle className="text-2xl font-bold">
            Upgrade to Pro
          </DialogTitle>
          
          <DialogDescription className="text-base">
            Unlock exclusive features and earn up to 25x more money
          </DialogDescription>
        </DialogHeader>

        {/* Pricing */}
        <div className="text-center py-6 bg-gradient-to-r from-primary to-secondary rounded-lg text-white my-6">
          <div className="text-4xl font-bold mb-2">
            ₹99
            <span className="text-lg font-normal opacity-80">/month</span>
          </div>
          <p className="text-indigo-100">
            Average Pro users earn ₹2,500/month
          </p>
          <Badge className="mt-2 bg-yellow-400 text-gray-900 border-0">
            25x ROI
          </Badge>
        </div>

        {/* Features List */}
        <div className="space-y-3">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={`flex items-start space-x-3 p-3 rounded-lg ${
                feature.highlight 
                  ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200' 
                  : 'bg-gray-50'
              }`}
            >
              <div className={`flex-shrink-0 p-2 rounded-lg ${
                feature.highlight 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-300 text-gray-600'
              }`}>
                {feature.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 mb-1">
                  {feature.title}
                </h4>
                <p className="text-sm text-gray-600">
                  {feature.description}
                </p>
              </div>
              <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-1" />
            </div>
          ))}
        </div>

        {/* ROI Breakdown */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-6">
          <h4 className="font-semibold text-blue-900 mb-3">Monthly Earning Potential</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-600">Free User Average:</div>
              <div className="font-semibold text-gray-900">₹100/month</div>
            </div>
            <div>
              <div className="text-gray-600">Pro User Average:</div>
              <div className="font-semibold text-green-600">₹2,500/month</div>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-blue-200">
            <div className="flex justify-between items-center">
              <span className="text-blue-800 font-medium">Monthly Profit:</span>
              <span className="font-bold text-blue-900">₹2,401</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onClose}
          >
            Maybe Later
          </Button>
          <Button
            className="flex-1 bg-gradient-to-r from-primary to-secondary hover:from-indigo-600 hover:to-green-600"
            onClick={() => upgradeMutation.mutate()}
            disabled={upgradeMutation.isPending}
          >
            {upgradeMutation.isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Upgrading...
              </>
            ) : (
              <>
                <Crown className="h-4 w-4 mr-2" />
                Upgrade Now
              </>
            )}
          </Button>
        </div>

        {/* Trust Indicators */}
        <div className="text-center text-xs text-gray-500 mt-4">
          <div className="flex items-center justify-center space-x-4">
            <span>✓ Instant activation</span>
            <span>✓ Cancel anytime</span>
            <span>✓ Money-back guarantee</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
