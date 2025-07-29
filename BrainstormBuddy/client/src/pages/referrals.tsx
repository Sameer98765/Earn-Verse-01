import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { 
  ArrowLeft, 
  Users, 
  Share2, 
  Copy, 
  Crown, 
  CheckCircle,
  Clock,
  UserCheck,
  Gift,
  TrendingUp,
  MessageCircle
} from "lucide-react";
import { Link } from "wouter";
import type { DashboardStats, User } from "@/types/api";

interface Referral {
  id: string;
  referredId: string;
  status: string;
  rewardEarned: string;
  createdAt: string;
  completedAt: string | null;
}

export default function Referrals() {
  const [copiedCode, setCopiedCode] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const { data: referrals = [] } = useQuery<Referral[]>({
    queryKey: ['/api/referrals'],
  });

  const { data: stats } = useQuery<DashboardStats>({
    queryKey: ['/api/dashboard/stats'],
  });

  const referralCode = user?.referralCode || 'LOADING';
  const referralLink = `${window.location.origin}?ref=${referralCode}`;
  
  const totalEarnings = referrals.reduce((sum, ref) => sum + parseFloat(ref.rewardEarned || '0'), 0);
  const completedReferrals = referrals.filter(ref => ref.status === 'completed').length;
  const pendingReferrals = referrals.filter(ref => ref.status === 'pending').length;

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    toast({
      title: "Copied!",
      description: `${type} copied to clipboard`,
      variant: "default",
    });
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const shareReferral = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join EarnVerse and Start Earning!',
        text: `Hey! I've been earning money with EarnVerse. Join using my referral code ${referralCode} and we both earn extra!`,
        url: referralLink,
      });
    } else {
      copyToClipboard(referralLink, 'Referral link');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        );
      case 'verified':
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            <UserCheck className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        );
      default:
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
    }
  };

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
            <Users className="h-8 w-8 text-purple-600" />
            Referral Program
          </h1>
          <p className="text-gray-600">Invite friends and earn together</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Referrals</p>
                <p className="text-2xl font-bold text-purple-600">{referrals.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{completedReferrals}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingReferrals}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Earned</p>
                <p className="text-2xl font-bold text-blue-600">₹{totalEarnings.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Referral Tools */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Share Your Code */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="h-5 w-5" />
                Share Your Referral Code
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Referral Code */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Your Referral Code
                </label>
                <div className="flex gap-2">
                  <Input 
                    value={referralCode} 
                    readOnly 
                    className="font-mono text-lg font-bold text-center"
                  />
                  <Button 
                    variant="outline"
                    onClick={() => copyToClipboard(referralCode, 'Referral code')}
                  >
                    {copiedCode ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {/* Referral Link */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Your Referral Link
                </label>
                <div className="flex gap-2">
                  <Input 
                    value={referralLink} 
                    readOnly 
                    className="text-sm"
                  />
                  <Button 
                    variant="outline"
                    onClick={() => copyToClipboard(referralLink, 'Referral link')}
                  >
                    {copiedCode ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {/* Share Buttons */}
              <div className="flex gap-2 pt-4">
                <Button onClick={shareReferral} className="flex-1">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Link
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`Hey! I've been earning money with EarnVerse. Join using my code ${referralCode} and we both earn extra! ${referralLink}`)}`;
                    window.open(whatsappUrl, '_blank');
                  }}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  WhatsApp
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Earning Info */}
        <Card className="bg-gradient-to-br from-primary to-secondary text-white">
          <CardContent className="p-6">
            <div className="text-center">
              <Gift className="h-12 w-12 text-yellow-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Earn Per Referral</h3>
              
              <div className="text-4xl font-bold mb-4">
                ₹{stats?.userRole === 'pro' ? '10' : '5'}
              </div>
              
              <div className="space-y-2 text-sm text-indigo-100">
                <p>✓ Friend signs up with your code</p>
                <p>✓ Friend verifies their email</p>
                <p>✓ Friend completes first task</p>
                <p>✓ You both get rewarded!</p>
              </div>
              
              {stats?.userRole === 'free' && (
                <div className="mt-4 p-3 bg-white bg-opacity-20 rounded-lg">
                  <div className="flex items-center justify-center gap-2 text-yellow-300 font-semibold">
                    <Crown className="h-4 w-4" />
                    Pro users earn ₹10 per referral
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Referral History */}
      <Card>
        <CardHeader>
          <CardTitle>Referral History</CardTitle>
        </CardHeader>
        <CardContent>
          {referrals.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No referrals yet</h3>
              <p className="text-gray-600 mb-6">
                Start sharing your referral code to earn money from friends' activities!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {referrals.map((referral, index) => (
                <div key={referral.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        Referral #{referral.id.slice(-8)}
                      </div>
                      <div className="text-sm text-gray-600">
                        Joined: {new Date(referral.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="font-semibold text-green-600">
                        ₹{parseFloat(referral.rewardEarned || '0').toFixed(2)}
                      </div>
                      {referral.completedAt && (
                        <div className="text-xs text-gray-500">
                          Completed: {new Date(referral.completedAt).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    {getStatusBadge(referral.status)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* How It Works */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <h4 className="font-semibold text-blue-900 mb-4 flex items-center gap-2">
            <Gift className="h-5 w-5" />
            How the Referral Program Works
          </h4>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-blue-800">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</div>
                <div>
                  <div className="font-medium">Share your code</div>
                  <div>Send your referral code or link to friends</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</div>
                <div>
                  <div className="font-medium">Friend signs up</div>
                  <div>They create an account using your referral code</div>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</div>
                <div>
                  <div className="font-medium">Email verification</div>
                  <div>Friend verifies their email address</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">4</div>
                <div>
                  <div className="font-medium">You both earn!</div>
                  <div>After their first task, you both get rewarded</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-100 rounded-lg">
            <div className="font-semibold text-blue-900 mb-2">💡 Pro Tips for More Referrals:</div>
            <div className="text-sm text-blue-800 space-y-1">
              <p>• Share on social media platforms</p>
              <p>• Tell friends about your earning experience</p>
              <p>• Explain how easy it is to start earning</p>
              <p>• Mention the various earning methods available</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
