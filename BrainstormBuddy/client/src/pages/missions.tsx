import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  Target, 
  Crown, 
  CheckCircle, 
  Clock,
  Award,
  Zap,
  Calendar,
  TrendingUp
} from "lucide-react";
import { Link } from "wouter";
import type { DashboardStats } from "@/types/api";

interface Mission {
  id: string;
  title: string;
  description: string;
  reward: string;
  minUserRole: 'free' | 'pro';
  completed: boolean;
}

export default function Missions() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: missions = [], isLoading } = useQuery<Mission[]>({
    queryKey: ['/api/missions'],
  });

  const { data: stats } = useQuery<DashboardStats>({
    queryKey: ['/api/dashboard/stats'],
  });

  const completeMissionMutation = useMutation({
    mutationFn: async (missionId: string) => {
      const response = await apiRequest('POST', `/api/missions/${missionId}/complete`);
      return response.json();
    },
    onSuccess: (result) => {
      toast({
        title: "Mission Completed! 🎉",
        description: `₹${result.reward} added to your balance`,
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/missions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const completedMissions = missions.filter(m => m.completed).length;
  const totalMissions = missions.length;
  const completionPercentage = totalMissions > 0 ? (completedMissions / totalMissions) * 100 : 0;

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

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
            <Target className="h-8 w-8 text-secondary" />
            Daily Missions
          </h1>
          <p className="text-gray-600">Complete simple tasks for instant rewards</p>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gradient-to-r from-secondary/10 to-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                <Target className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-secondary">{completedMissions}/{totalMissions}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-accent/10 to-yellow-50 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                <Award className="h-5 w-5 text-gray-900" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Current Streak</p>
                <p className="text-2xl font-bold text-accent">🔥 {stats?.streakCount || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-primary/10 to-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Progress</p>
                <p className="text-2xl font-bold text-primary">{Math.round(completionPercentage)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Reset In</p>
                <p className="text-2xl font-bold text-purple-600">
                  {Math.floor((24 - new Date().getHours()))}h
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Daily Progress</h3>
            <Badge variant={completedMissions === totalMissions ? "default" : "secondary"}>
              {completedMissions}/{totalMissions} completed
            </Badge>
          </div>
          <Progress value={completionPercentage} className="h-3 mb-4" />
          <div className="flex justify-between text-sm text-gray-600">
            <span>Keep going! Complete all missions for a streak bonus.</span>
            <span>{Math.round(completionPercentage)}% complete</span>
          </div>
        </CardContent>
      </Card>

      {/* Streak Bonus Info */}
      <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200 mb-8">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
              <Award className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-orange-900 mb-1">7-Day Streak Bonus</h3>
              <p className="text-sm text-orange-800">
                Complete all daily missions for 7 consecutive days to earn a 
                <span className="font-bold"> ₹{stats?.userRole === 'pro' ? '50' : '25'} bonus!</span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Missions List */}
      <div className="space-y-4">
        {missions.map((mission, index) => (
          <Card key={mission.id} className={`transition-all duration-200 ${
            mission.completed 
              ? 'bg-green-50 border-green-200' 
              : 'hover:shadow-md'
          }`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {mission.completed ? (
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-6 w-6 text-white" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold">
                        {index + 1}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-semibold ${
                        mission.completed ? 'text-green-800' : 'text-gray-900'
                      }`}>
                        {mission.title}
                      </h3>
                      
                      {mission.minUserRole === 'pro' && (
                        <Badge className="bg-gradient-to-r from-primary to-secondary text-white border-0">
                          <Crown className="h-3 w-3 mr-1" />
                          Pro
                        </Badge>
                      )}
                    </div>
                    
                    <p className={`text-sm ${
                      mission.completed ? 'text-green-700' : 'text-gray-600'
                    }`}>
                      {mission.description}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">
                      ₹{mission.reward}
                    </div>
                    <div className="text-xs text-gray-500">
                      Instant reward
                    </div>
                  </div>
                  
                  {mission.completed ? (
                    <Badge className="bg-green-500 text-white border-0">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Completed
                    </Badge>
                  ) : (
                    <Button
                      onClick={() => completeMissionMutation.mutate(mission.id)}
                      disabled={completeMissionMutation.isPending}
                      size="sm"
                    >
                      {completeMissionMutation.isPending ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Completing...
                        </>
                      ) : (
                        <>
                          <Zap className="h-4 w-4 mr-2" />
                          Complete
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {missions.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No missions available</h3>
            <p className="text-gray-600 mb-6">
              Check back tomorrow for new daily missions!
            </p>
          </CardContent>
        </Card>
      )}

      {/* Info Panel */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">Mission Information</h4>
              <div className="space-y-2 text-sm text-blue-800">
                <p>• Daily missions reset at midnight (IST)</p>
                <p>• Complete all missions to maintain your earning streak</p>
                <p>• Pro users get access to higher-paying exclusive missions</p>
                <p>• Rewards are added instantly to your available balance</p>
                <p>• 7-day streak bonus: ₹{stats?.userRole === 'pro' ? '50' : '25'}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
