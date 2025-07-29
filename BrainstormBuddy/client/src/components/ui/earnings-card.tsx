import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface EarningsCardProps {
  title: string;
  amount: number;
  icon: React.ReactNode;
  trend?: number;
  trendLabel?: string;
  className?: string;
  currency?: string;
}

export default function EarningsCard({
  title,
  amount,
  icon,
  trend = 0,
  trendLabel = "",
  className,
  currency = "₹"
}: EarningsCardProps) {
  const isPositiveTrend = trend > 0;
  const hasTrend = trend !== 0;

  return (
    <Card className={cn("relative overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-white bg-opacity-50 rounded-lg">
              {icon}
            </div>
          </div>
          
          {hasTrend && (
            <Badge 
              variant={isPositiveTrend ? "default" : "secondary"}
              className={cn(
                "text-xs",
                isPositiveTrend 
                  ? "bg-green-100 text-green-800 border-green-200" 
                  : "bg-red-100 text-red-800 border-red-200"
              )}
            >
              {isPositiveTrend ? (
                <TrendingUp className="w-3 h-3 mr-1" />
              ) : (
                <TrendingDown className="w-3 h-3 mr-1" />
              )}
              {currency}{Math.abs(trend)}
            </Badge>
          )}
        </div>
        
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-600 leading-none">
            {title}
          </h3>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-gray-900">
              {currency}{amount.toFixed(2)}
            </span>
            {trendLabel && (
              <span className="text-xs text-gray-500">
                {trendLabel}
              </span>
            )}
          </div>
        </div>
        
        {hasTrend && (
          <div className="mt-4 flex items-center text-xs text-gray-600">
            <span>
              {isPositiveTrend ? "+" : ""}
              {currency}{trend.toFixed(2)} {trendLabel}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
