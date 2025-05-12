import { Switch, Route, useLocation } from "wouter";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "./lib/firebase"; 
import { auth } from "./lib/firebase";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import HomePage from "@/pages/HomePage";
import EventDetailPage from "@/pages/EventDetailPage";
import ProfilePage from "@/pages/ProfilePage";
import MessagesPage from "@/pages/MessagesPage";
import FindBuddiesPage from "@/pages/FindBuddiesPage";
import RegisterPage from "@/pages/RegisterPage";
import LoginPage from "@/pages/LoginPage";
import NotFound from "@/pages/not-found";

import Sidebar from "@/components/layout/Sidebar";
import MobileHeader from "@/components/layout/MobileHeader";
import MobileNavigation from "@/components/layout/MobileNavigation";
import { FirebaseUser } from "./lib/firebase";

function App() {
  const [location] = useLocation();
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Don't render layout elements for auth pages
  const isAuthPage = location === "/login" || location === "/register";

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className={`flex flex-col ${!isAuthPage ? "h-screen" : ""}`}>
        {!isAuthPage && <MobileHeader />}
        
        <div className="flex flex-1 overflow-hidden">
          {!isAuthPage && <Sidebar currentUser={currentUser} />}
          
          <main className={`${isAuthPage ? 'w-full' : 'flex-1 overflow-auto bg-gray-50'}`}>
            <Switch>
              <Route path="/" component={() => <HomePage />} />
              <Route path="/event/:id" component={EventDetailPage} />
              <Route path="/profile/:id?" component={ProfilePage} />
              <Route path="/messages/:id?" component={MessagesPage} />
              <Route path="/find-buddies" component={FindBuddiesPage} />
              <Route path="/register" component={RegisterPage} />
              <Route path="/login" component={LoginPage} />
              <Route component={NotFound} />
            </Switch>
          </main>
        </div>
        
        {!isAuthPage && <MobileNavigation />}
      </div>
      <Toaster />
    </TooltipProvider>
  );
}

export default App;
