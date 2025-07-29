import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import TaskCard from "@/components/ui/task-card";
import ProUpgradeModal from "@/components/ui/pro-upgrade-modal";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { 
  ArrowLeft, 
  Search, 
  Filter,
  Smartphone,
  FileText,
  Crown,
  Clock,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { Link } from "wouter";
import type { DashboardStats, Task } from "@/types/api";



export default function Tasks() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showProModal, setShowProModal] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading } = useQuery<Task[]>({
    queryKey: ['/api/tasks'],
  });

  const { data: userStats } = useQuery<DashboardStats>({
    queryKey: ['/api/dashboard/stats'],
  });

  const completeTaskMutation = useMutation({
    mutationFn: async (taskId: string) => {
      const response = await apiRequest('POST', `/api/tasks/${taskId}/complete`);
      return response.json();
    },
    onSuccess: (result) => {
      toast({
        title: "Task Completed! 🎉",
        description: `₹${result.reward} added to pending balance`,
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
      queryClient.invalidateQueries({ queryKey: ['/api/wallet'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || task.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: "all", label: "All Tasks", icon: <TrendingUp className="h-4 w-4" /> },
    { id: "app_install", label: "App Installs", icon: <Smartphone className="h-4 w-4" /> },
    { id: "survey", label: "Surveys", icon: <FileText className="h-4 w-4" /> },
  ];

  const handleTaskClick = (task: Task) => {
    if (task.minUserRole === 'pro' && userStats?.userRole === 'free') {
      setShowProModal(true);
      return;
    }
    completeTaskMutation.mutate(task.id);
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          {[...Array(6)].map((_, i) => (
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
            <Smartphone className="h-8 w-8 text-primary" />
            Available Tasks
          </h1>
          <p className="text-gray-600">Complete tasks to earn money</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="whitespace-nowrap"
            >
              {category.icon}
              <span className="ml-2">{category.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Available Tasks</p>
                <p className="text-2xl font-bold text-blue-600">{filteredTasks.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg. Completion</p>
                <p className="text-2xl font-bold text-green-600">5-15 min</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
                <Crown className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pro Only Tasks</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {tasks.filter(t => t.minUserRole === 'pro').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pro Upgrade Banner for Free Users */}
      {userStats?.userRole === 'free' && (
        <Card className="bg-gradient-to-r from-primary to-secondary text-white mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="mb-4 lg:mb-0">
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                  <Crown className="h-5 w-5 text-yellow-300" />
                  Unlock High-Paying Tasks
                </h3>
                <p className="text-indigo-100">
                  Pro users get access to exclusive offers worth up to ₹500. 
                  Current limit: ₹30 per task.
                </p>
              </div>
              <Button 
                className="bg-yellow-400 text-gray-900 hover:bg-yellow-300 font-bold"
                onClick={() => setShowProModal(true)}
              >
                <Crown className="mr-2 h-4 w-4" />
                Upgrade to Pro
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tasks Grid */}
      {filteredTasks.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No tasks found</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || selectedCategory !== "all" 
                ? "Try adjusting your search or filters" 
                : "Check back later for new tasks"}
            </p>
            {(searchQuery || selectedCategory !== "all") && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
              >
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onComplete={() => handleTaskClick(task)}
              isLoading={completeTaskMutation.isPending}
              userRole={userStats?.userRole || 'free'}
            />
          ))}
        </div>
      )}

      {/* Information Panel */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">Important Information</h4>
              <div className="space-y-2 text-sm text-blue-800">
                <p>• Task rewards are added to your pending balance for verification</p>
                <p>• Pending earnings move to available balance within 24 hours</p>
                <p>• Do not uninstall apps immediately after installation</p>
                <p>• Complete surveys honestly for best results</p>
                <p>• Some tasks may have geographic restrictions</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pro Upgrade Modal */}
      <ProUpgradeModal 
        isOpen={showProModal} 
        onClose={() => setShowProModal(false)} 
      />
    </div>
  );
}
