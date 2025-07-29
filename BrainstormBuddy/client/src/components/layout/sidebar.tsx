import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { 
  Home, 
  Gift, 
  Target, 
  Smartphone, 
  Users, 
  Wallet, 
  User, 
  Crown,
  TrendingUp,
  X
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { DashboardStats } from "@/types/api";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Spin Wheel', href: '/spin', icon: Gift },
  { name: 'Tasks', href: '/tasks', icon: Smartphone },
  { name: 'Missions', href: '/missions', icon: Target },
  { name: 'Referrals', href: '/referrals', icon: Users },
  { name: 'Wallet', href: '/wallet', icon: Wallet },
  { name: 'Profile', href: '/profile', icon: User },
];

export default function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const [location] = useLocation();
  
  const { data: stats } = useQuery<DashboardStats>({
    queryKey: ['/api/dashboard/stats'],
  });

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                <TrendingUp className="text-white h-4 w-4" />
              </div>
              <span className="text-lg font-bold text-gray-900">Menu</span>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Balance</span>
                <span className="text-sm font-semibold text-green-600">
                  ₹{stats?.balance || 0}
                </span>
              </div>
              
              {stats?.availableSpins > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Spins Left</span>
                  <Badge variant="secondary" className="text-xs">
                    {stats.availableSpins}
                  </Badge>
                </div>
              )}
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Streak</span>
                <span className="text-sm font-semibold text-orange-600">
                  🔥 {stats?.streakCount || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const isActive = location === item.href;
              const Icon = item.icon;
              
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start h-11",
                      isActive && "bg-primary text-primary-foreground shadow-sm"
                    )}
                    onClick={onClose}
                  >
                    <Icon className="mr-3 h-4 w-4" />
                    {item.name}
                    
                    {/* Special badges */}
                    {item.name === 'Spin Wheel' && stats?.availableSpins > 0 && (
                      <Badge variant="secondary" className="ml-auto text-xs">
                        {stats.availableSpins}
                      </Badge>
                    )}
                  </Button>
                </Link>
              );
            })}
          </nav>

          {/* Pro Upgrade CTA */}
          {stats?.userRole === 'free' && (
            <div className="p-4 border-t border-gray-200">
              <div className="bg-gradient-to-r from-primary to-secondary rounded-lg p-4 text-white text-center">
                <Crown className="h-6 w-6 text-yellow-300 mx-auto mb-2" />
                <h4 className="font-semibold text-sm mb-1">Go Pro</h4>
                <p className="text-xs text-indigo-100 mb-3">
                  2x spins, higher limits
                </p>
                <Button 
                  size="sm" 
                  className="bg-yellow-400 text-gray-900 hover:bg-yellow-300 w-full font-semibold"
                >
                  Upgrade Now
                </Button>
              </div>
            </div>
          )}

          {/* Version */}
          <div className="p-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              EarnVerse v1.0
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
