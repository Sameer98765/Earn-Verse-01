import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Coins, 
  Menu, 
  Bell, 
  Crown, 
  User, 
  Settings, 
  LogOut,
  Wallet 
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import type { DashboardStats, User as UserType } from "@/types/api";

interface NavbarProps {
  onMenuClick?: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const { user, isAuthenticated } = useAuth();
  
  const { data: stats } = useQuery<DashboardStats>({
    queryKey: ['/api/dashboard/stats'],
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) return null;

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={onMenuClick}
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            <Link href="/">
              <div className="flex items-center space-x-2 cursor-pointer">
                <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center">
                  <Coins className="text-white h-5 w-5" />
                </div>
                <span className="text-xl font-bold text-gray-900 hidden sm:block">EarnVerse</span>
              </div>
            </Link>
          </div>

          {/* Center - Balance Display */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-lg border border-green-200">
              <Wallet className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">
                ₹{stats?.balance || 0}
              </span>
            </div>
            
            {stats?.pendingBalance > 0 && (
              <div className="flex items-center space-x-2 bg-yellow-50 px-4 py-2 rounded-lg border border-yellow-200">
                <Crown className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800">
                  ₹{stats.pendingBalance} pending
                </span>
              </div>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Pro Badge */}
            {stats?.userRole === 'pro' && (
              <Badge className="bg-gradient-to-r from-primary to-secondary text-white border-0 hidden sm:flex">
                <Crown className="mr-1 h-3 w-3" />
                Pro
              </Badge>
            )}
            
            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.profileImageUrl} alt={user?.firstName} />
                    <AvatarFallback>
                      {user?.firstName?.charAt(0) || user?.email?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex flex-col space-y-1 p-2">
                  <p className="text-sm font-medium leading-none">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
                
                <DropdownMenuSeparator />
                
                {/* Balance on mobile */}
                <div className="md:hidden p-2">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Balance:</span>
                    <span className="text-sm font-medium text-green-600">₹{stats?.balance || 0}</span>
                  </div>
                  {stats?.pendingBalance > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Pending:</span>
                      <span className="text-sm font-medium text-yellow-600">₹{stats.pendingBalance}</span>
                    </div>
                  )}
                </div>
                
                <DropdownMenuSeparator className="md:hidden" />
                
                <Link href="/profile">
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                </Link>
                
                <Link href="/wallet">
                  <DropdownMenuItem>
                    <Wallet className="mr-2 h-4 w-4" />
                    <span>Wallet</span>
                  </DropdownMenuItem>
                </Link>
                
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem onClick={() => window.location.href = "/api/logout"}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
