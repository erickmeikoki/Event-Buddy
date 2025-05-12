import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { UserIcon, Mail, Lock } from "lucide-react";
import { 
  auth, 
  signInWithEmailAndPassword, 
  signInWithGoogle, 
  signInWithGoogleRedirect, 
  getRedirectResult,
  db, 
  doc, 
  getDoc, 
  setDoc 
} from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
  rememberMe: z.boolean().default(false),
});

export default function LoginPage() {
  const [, navigate] = useLocation();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  // Handle Google redirect result
  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        setGoogleLoading(true);
        
        // Get the result of the redirect sign-in
        const result = await getRedirectResult(auth);
        
        if (result?.user) {
          // Check if the user already exists in Firestore
          const userRef = doc(db, "users", result.user.uid);
          const userDoc = await getDoc(userRef);
          
          if (!userDoc.exists()) {
            // If the user doesn't exist, create a new document
            await setDoc(userRef, {
              uid: result.user.uid,
              displayName: result.user.displayName || "User",
              email: result.user.email,
              profileImageUrl: result.user.photoURL || "",
              location: "",
              bio: "",
              createdAt: new Date()
            });
          }
          
          toast({
            title: "Login successful!",
            description: "Welcome to EventBuddy.",
            variant: "default",
          });
          
          navigate("/");
        }
      } catch (error: any) {
        console.error("Error handling redirect result:", error);
        
        if (error.code !== 'auth/credential-already-in-use') {
          toast({
            title: "Google Sign-In failed",
            description: "There was an issue signing in with Google. Please try again.",
            variant: "destructive",
          });
        }
      } finally {
        setGoogleLoading(false);
      }
    };
    
    handleRedirectResult();
  }, [toast, navigate]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      // Sign in with Firebase Authentication
      await signInWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );

      toast({
        title: "Login successful!",
        description: "Welcome back to EventBuddy.",
        variant: "default",
      });

      // Navigate to home page
      navigate("/");
    } catch (error: any) {
      console.error("Error during login:", error);
      let errorMessage = "Failed to log in. Please check your credentials and try again.";
      
      if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
        errorMessage = "Invalid email or password. Please try again.";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Too many failed login attempts. Please try again later or reset your password.";
      }
      
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      
      // Use the appropriate method based on device type
      const result = isMobile 
        ? await signInWithGoogleRedirect() 
        : await signInWithGoogle();
      
      // This will only execute for signInWithPopup (desktop)
      // For redirect method, the page will reload and we need to handle in useEffect
      if (result?.user) {
        // Check if the user already exists in Firestore
        const userRef = doc(db, "users", result.user.uid);
        const userDoc = await getDoc(userRef);
        
        if (!userDoc.exists()) {
          // If the user doesn't exist, create a new document
          await setDoc(userRef, {
            uid: result.user.uid,
            displayName: result.user.displayName || "User",
            email: result.user.email,
            profileImageUrl: result.user.photoURL || "",
            location: "",
            bio: "",
            createdAt: new Date()
          });
        }
        
        toast({
          title: "Login successful!",
          description: "Welcome to EventBuddy.",
          variant: "default",
        });
        
        navigate("/");
      }
    } catch (error: any) {
      console.error("Error signing in with Google:", error);
      
      toast({
        title: "Google Sign-In failed",
        description: "There was an issue signing in with Google. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <UserIcon className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>
            Log in to your EventBuddy account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                        <Input className="pl-10" placeholder="you@example.com" type="email" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Password</FormLabel>
                      <Button variant="link" size="sm" className="p-0 h-auto text-xs" onClick={() => navigate("/forgot-password")}>
                        Forgot password?
                      </Button>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                        <Input className="pl-10" placeholder="••••••••" type="password" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <div className="flex items-center">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent mr-2"></span>
                    Logging in...
                  </div>
                ) : (
                  "Log In"
                )}
              </Button>
            </form>
          </Form>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">Or continue with</span>
              </div>
            </div>
            
            <Button 
              type="button" 
              variant="outline" 
              className="w-full mt-4 flex items-center justify-center"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
            >
              {googleLoading ? (
                <div className="flex items-center">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-600 border-t-transparent mr-2"></span>
                  Connecting...
                </div>
              ) : (
                <>
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Sign in with Google
                </>
              )}
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col">
          <Separator className="mb-4" />
          <p className="text-center text-sm">
            Don't have an account yet?{" "}
            <Button variant="link" className="p-0 h-auto" onClick={() => navigate("/register")}>
              Sign up
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
