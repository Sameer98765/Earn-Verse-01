import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  Smartphone, 
  FileText, 
  Crown, 
  ExternalLink,
  Lock
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Task {
  id: string;
  title: string;
  description: string;
  reward: string;
  provider: string;
  category: string;
  minUserRole: 'free' | 'pro';
  metadata?: any;
}

interface TaskCardProps {
  task: Task;
  onComplete: () => void;
  isLoading: boolean;
  userRole: 'free' | 'pro';
}

export default function TaskCard({ task, onComplete, isLoading, userRole }: TaskCardProps) {
  const isProOnly = task.minUserRole === 'pro';
  const canAccess = userRole === 'pro' || !isProOnly;
  
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'app_install':
        return <Smartphone className="h-4 w-4" />;
      case 'survey':
        return <FileText className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'app_install':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'survey':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEstimatedTime = (category: string) => {
    switch (category) {
      case 'app_install':
        return '2-5 min';
      case 'survey':
        return '5-15 min';
      default:
        return '3-10 min';
    }
  };

  return (
    <Card className={cn(
      "hover:shadow-lg transition-all duration-200",
      !canAccess && "opacity-75 bg-gray-50"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <Badge className={getCategoryColor(task.category)}>
              {getCategoryIcon(task.category)}
              <span className="ml-1 capitalize">{task.category.replace('_', ' ')}</span>
            </Badge>
            
            {isProOnly && (
              <Badge className="bg-gradient-to-r from-primary to-secondary text-white border-0">
                <Crown className="h-3 w-3 mr-1" />
                Pro
              </Badge>
            )}
          </div>
          
          <div className="text-right">
            <div className="text-lg font-bold text-green-600">₹{task.reward}</div>
            <div className="text-xs text-gray-500">{getEstimatedTime(task.category)}</div>
          </div>
        </div>
        
        <CardTitle className="text-lg leading-tight">
          {task.title}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {task.description}
        </p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <ExternalLink className="h-3 w-3" />
            <span>by {task.provider}</span>
          </div>
          
          <div className="text-xs text-gray-500">
            Pending verification: 24h
          </div>
        </div>
        
        {canAccess ? (
          <Button 
            onClick={onComplete}
            disabled={isLoading}
            className="w-full"
            size="sm"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Completing...
              </>
            ) : (
              <>
                <ExternalLink className="h-4 w-4 mr-2" />
                Start Task
              </>
            )}
          </Button>
        ) : (
          <Button 
            onClick={onComplete}
            variant="outline"
            className="w-full"
            size="sm"
          >
            <Lock className="h-4 w-4 mr-2" />
            Upgrade to Access
          </Button>
        )}
        
        {/* Task Details */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
            <div>
              <span className="font-medium">Category:</span>
              <div className="capitalize">{task.category.replace('_', ' ')}</div>
            </div>
            <div>
              <span className="font-medium">Provider:</span>
              <div>{task.provider}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
