import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Star, 
  Shield, 
  Clock, 
  Users, 
  Coins, 
  Smartphone, 
  Target, 
  UserPlus,
  Gift,
  Crown,
  Zap,
  TrendingUp,
  Award,
  CheckCircle,
  ArrowRight
} from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center">
                <Coins className="text-white text-lg" />
              </div>
              <span className="text-xl font-bold text-gray-900">EarnVerse</span>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-primary transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-primary transition-colors">How It Works</a>
              <a href="#pricing" className="text-gray-600 hover:text-primary transition-colors">Pro Features</a>
              <a href="#testimonials" className="text-gray-600 hover:text-primary transition-colors">Reviews</a>
            </nav>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => window.location.href = "/api/login"}>
                Sign In
              </Button>
              <Button onClick={() => window.location.href = "/api/login"}>
                Get Started Free
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-indigo-600 to-secondary overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-10"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white bg-opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-secondary bg-opacity-20 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <Badge className="bg-white bg-opacity-20 text-white border-0 mb-8">
                <Star className="text-accent mr-2 h-4 w-4" />
                Join 250K+ Happy Earners
              </Badge>
              
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Turn Your Free Time Into 
                <span className="text-accent"> Real Money</span>
              </h1>
              
              <p className="text-xl text-indigo-100 mb-8 max-w-2xl">
                Complete simple tasks, spin daily rewards, and earn up to ₹500 monthly. 
                Join India's most trusted earning platform with instant payouts.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button 
                  size="lg" 
                  className="bg-accent text-gray-900 hover:bg-yellow-500 font-bold"
                  onClick={() => window.location.href = "/api/login"}
                >
                  <Gift className="mr-2 h-5 w-5" />
                  Start Earning Now
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="bg-white bg-opacity-20 text-white border-white border-opacity-30 hover:bg-opacity-30"
                >
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Watch Demo
                </Button>
              </div>
              
              <div className="flex flex-wrap items-center gap-8 text-indigo-200 text-sm">
                <div className="flex items-center">
                  <Shield className="text-secondary mr-2 h-4 w-4" />
                  <span>100% Secure</span>
                </div>
                <div className="flex items-center">
                  <Clock className="text-secondary mr-2 h-4 w-4" />
                  <span>Instant Payouts</span>
                </div>
                <div className="flex items-center">
                  <Users className="text-secondary mr-2 h-4 w-4" />
                  <span>250K+ Users</span>
                </div>
              </div>
            </div>
            
            {/* Dashboard Preview */}
            <div className="relative">
              <Card className="transform rotate-3 hover:rotate-0 transition-transform duration-500 bg-white shadow-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="font-bold text-gray-900">Welcome, Priya!</h3>
                      <p className="text-gray-600 text-sm">Today's Earnings</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-secondary">₹45</div>
                      <div className="text-sm text-gray-600">Total: ₹1,240</div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-accent to-orange-400 rounded-xl p-4 mb-4 text-center">
                    <div className="w-16 h-16 bg-white rounded-full mx-auto mb-2 flex items-center justify-center animate-spin">
                      <Gift className="text-accent h-6 w-6" />
                    </div>
                    <p className="text-white font-medium">Daily Spin Available!</p>
                    <Button size="sm" className="bg-white text-accent hover:bg-gray-100 mt-2">
                      Spin Now
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <div className="text-primary font-bold">8</div>
                      <div className="text-xs text-gray-600">Tasks Done</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <div className="text-secondary font-bold">5</div>
                      <div className="text-xs text-gray-600">Day Streak</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Badge className="absolute -top-4 -left-4 bg-accent text-gray-900 animate-bounce">
                +₹10
              </Badge>
              <Badge className="absolute -bottom-4 -right-4 bg-secondary text-white animate-pulse">
                New Task!
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">₹2.5Cr+</div>
              <div className="text-gray-600">Total Paid Out</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-secondary mb-2">250K+</div>
              <div className="text-gray-600">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent mb-2">50K+</div>
              <div className="text-gray-600">Daily Tasks</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">4.8/5</div>
              <div className="text-gray-600">User Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Multiple Ways to Earn</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose from our gamified earning methods designed for different preferences and time commitments
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-8">
            {/* Spin the Wheel */}
            <Card className="hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-gradient-to-r from-accent to-orange-400 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                  <Zap className="text-white h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Daily Spin Wheel</h3>
                <p className="text-gray-600 mb-6 text-center">
                  Spin once daily for guaranteed rewards. Pro users get 2 spins!
                </p>
                <div className="bg-accent bg-opacity-10 rounded-lg p-4 text-center">
                  <div className="text-accent font-bold">₹1 - ₹50</div>
                  <div className="text-sm text-gray-600">Per Spin</div>
                </div>
              </CardContent>
            </Card>
            
            {/* Offerwall Tasks */}
            <Card className="hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-indigo-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                  <Smartphone className="text-white h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">App & Survey Tasks</h3>
                <p className="text-gray-600 mb-6 text-center">
                  Install apps, complete surveys, and earn real money for your time
                </p>
                <div className="bg-primary bg-opacity-10 rounded-lg p-4 text-center">
                  <div className="text-primary font-bold">₹5 - ₹200</div>
                  <div className="text-sm text-gray-600">Per Task</div>
                </div>
              </CardContent>
            </Card>
            
            {/* Quick Missions */}
            <Card className="hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-gradient-to-r from-secondary to-green-500 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                  <Target className="text-white h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Quick Missions</h3>
                <p className="text-gray-600 mb-6 text-center">
                  Simple daily tasks with streak bonuses for consistent participation
                </p>
                <div className="bg-secondary bg-opacity-10 rounded-lg p-4 text-center">
                  <div className="text-secondary font-bold">₹1 - ₹10</div>
                  <div className="text-sm text-gray-600">Per Mission</div>
                </div>
              </CardContent>
            </Card>
            
            {/* Referral Program */}
            <Card className="hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                  <Users className="text-white h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Refer Friends</h3>
                <p className="text-gray-600 mb-6 text-center">
                  Earn commission from friends' activities. No limits on referrals!
                </p>
                <div className="bg-purple-100 rounded-lg p-4 text-center">
                  <div className="text-purple-600 font-bold">₹20 - ₹100</div>
                  <div className="text-sm text-gray-600">Per Referral</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How EarnVerse Works</h2>
            <p className="text-xl text-gray-600">Start earning in just 3 simple steps</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center relative">
              <div className="w-24 h-24 bg-gradient-to-r from-primary to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                <UserPlus className="text-white h-12 w-12" />
                <Badge className="absolute -top-2 -right-2 bg-accent text-gray-900 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </Badge>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Sign Up Free</h3>
              <p className="text-gray-600 text-lg">
                Create your account in seconds with email or social login. Email verification required for security.
              </p>
            </div>
            
            <div className="text-center relative">
              <div className="w-24 h-24 bg-gradient-to-r from-secondary to-green-500 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                <Target className="text-white h-12 w-12" />
                <Badge className="absolute -top-2 -right-2 bg-accent text-gray-900 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </Badge>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Complete Tasks</h3>
              <p className="text-gray-600 text-lg">
                Choose from spins, surveys, app installs, or quick missions. Track your progress and build streaks.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-accent to-orange-400 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                <Coins className="text-white h-12 w-12" />
                <Badge className="absolute -top-2 -right-2 bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </Badge>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Get Paid</h3>
              <p className="text-gray-600 text-lg">
                Withdraw earnings instantly to your UPI, bank account, or mobile recharge. Minimum ₹50 for free users.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-16">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-primary to-secondary text-white"
              onClick={() => window.location.href = "/api/login"}
            >
              <Gift className="mr-2 h-5 w-5" />
              Start Your Journey Now
            </Button>
            <p className="text-gray-600 mt-4">No credit card required • Start earning immediately</p>
          </div>
        </div>
      </section>

      {/* Pro Features */}
      <section id="pricing" className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Unlock Pro Features</h2>
            <p className="text-xl text-gray-300">
              Upgrade to Pro for exclusive high-paying offers and premium benefits
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <Card className="bg-white bg-opacity-10 border-gray-600">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">Free Member</h3>
                  <div className="text-4xl font-bold text-accent mb-2">₹0</div>
                  <p className="text-gray-300">Perfect for getting started</p>
                </div>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center">
                    <CheckCircle className="text-secondary mr-3 h-5 w-5" />
                    <span>1 daily spin wheel</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="text-secondary mr-3 h-5 w-5" />
                    <span>Tasks up to ₹30</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="text-secondary mr-3 h-5 w-5" />
                    <span>Basic quick missions</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="text-secondary mr-3 h-5 w-5" />
                    <span>₹50 minimum withdrawal</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="text-secondary mr-3 h-5 w-5" />
                    <span>Standard referral bonus</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-gray-600 hover:bg-gray-500"
                  onClick={() => window.location.href = "/api/login"}
                >
                  Get Started Free
                </Button>
              </CardContent>
            </Card>
            
            {/* Pro Plan */}
            <Card className="bg-gradient-to-br from-primary to-secondary border-2 border-accent relative">
              <Badge className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-accent text-gray-900 font-bold">
                MOST POPULAR
              </Badge>
              
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">Pro Member</h3>
                  <div className="text-4xl font-bold text-white mb-2">₹99<span className="text-lg">/month</span></div>
                  <p className="text-indigo-100">Unlock your earning potential</p>
                </div>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center">
                    <Crown className="text-accent mr-3 h-5 w-5" />
                    <span>2 daily spin wheels</span>
                  </div>
                  <div className="flex items-center">
                    <Crown className="text-accent mr-3 h-5 w-5" />
                    <span>Exclusive offers up to ₹500</span>
                  </div>
                  <div className="flex items-center">
                    <Crown className="text-accent mr-3 h-5 w-5" />
                    <span>Premium missions (₹5-₹10)</span>
                  </div>
                  <div className="flex items-center">
                    <Crown className="text-accent mr-3 h-5 w-5" />
                    <span>₹20 minimum withdrawal</span>
                  </div>
                  <div className="flex items-center">
                    <Crown className="text-accent mr-3 h-5 w-5" />
                    <span>Higher referral bonuses</span>
                  </div>
                  <div className="flex items-center">
                    <Crown className="text-accent mr-3 h-5 w-5" />
                    <span>Priority customer support</span>
                  </div>
                  <div className="flex items-center">
                    <Crown className="text-accent mr-3 h-5 w-5" />
                    <span>Early access to new features</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-accent text-gray-900 hover:bg-yellow-500 font-bold"
                  onClick={() => window.location.href = "/api/login"}
                >
                  Upgrade to Pro
                </Button>
                
                <p className="text-center text-indigo-200 text-sm mt-4">
                  <Award className="inline mr-1 h-4 w-4" />
                  Average Pro users earn ₹2,500/month
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary via-secondary to-accent relative overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Ready to Start Earning?
          </h2>
          <p className="text-xl md:text-2xl text-white text-opacity-90 mb-8 max-w-3xl mx-auto">
            Join <span className="font-bold">250,000+</span> users who are already earning with EarnVerse. 
            Start your journey today and unlock your earning potential!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-gray-100 font-bold"
              onClick={() => window.location.href = "/api/login"}
            >
              <Gift className="mr-2 h-5 w-5" />
              Join Free Now
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-white bg-opacity-20 text-white border-white border-opacity-30 hover:bg-opacity-30"
              onClick={() => window.location.href = "/api/login"}
            >
              <Crown className="mr-2 h-5 w-5" />
              Go Pro Instantly
            </Button>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8 text-white text-opacity-90">
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4" />
              <span>Setup in 2 minutes</span>
            </div>
            <div className="flex items-center">
              <Coins className="mr-2 h-4 w-4" />
              <span>Withdraw instantly</span>
            </div>
            <div className="flex items-center">
              <Shield className="mr-2 h-4 w-4" />
              <span>100% secure</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center">
                  <Coins className="text-white h-5 w-5" />
                </div>
                <span className="text-xl font-bold">EarnVerse</span>
              </div>
              <p className="text-gray-300 mb-6">
                India's most trusted platform for earning supplemental income through gamified tasks and rewards.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
              <div className="space-y-3 text-gray-300">
                <div><a href="#features" className="hover:text-white transition-colors">Features</a></div>
                <div><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></div>
                <div><a href="#pricing" className="hover:text-white transition-colors">Pro Features</a></div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-6">Earning Methods</h3>
              <div className="space-y-3 text-gray-300">
                <div>Spin the Wheel</div>
                <div>Survey Tasks</div>
                <div>App Installs</div>
                <div>Quick Missions</div>
                <div>Refer Friends</div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-6">Legal & Support</h3>
              <div className="space-y-3 text-gray-300">
                <div>Privacy Policy</div>
                <div>Terms of Service</div>
                <div>Support Center</div>
                <div>Security</div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2025 EarnVerse. All rights reserved. Made with ❤️ in India.
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <div className="flex items-center">
                <Shield className="text-secondary mr-2 h-4 w-4" />
                <span>Secure & Trusted</span>
              </div>
              <div className="flex items-center">
                <Users className="text-secondary mr-2 h-4 w-4" />
                <span>250K+ Users</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
