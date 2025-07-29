import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import SpinWheel from "@/pages/spin-wheel";
import Tasks from "@/pages/tasks";
import Missions from "@/pages/missions";
import Referrals from "@/pages/referrals";
import Wallet from "@/pages/wallet";
import Profile from "@/pages/profile";
import NotFound from "@/pages/not-found";
import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/layout/sidebar";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Switch>
      {!isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="flex">
              <Sidebar />
              <main className="flex-1 lg:ml-64">
                <Switch>
                  <Route path="/" component={Dashboard} />
                  <Route path="/spin" component={SpinWheel} />
                  <Route path="/tasks" component={Tasks} />
                  <Route path="/missions" component={Missions} />
                  <Route path="/referrals" component={Referrals} />
                  <Route path="/wallet" component={Wallet} />
                  <Route path="/profile" component={Profile} />
                  <Route component={NotFound} />
                </Switch>
              </main>
            </div>
          </div>
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
