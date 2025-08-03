import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { loginAdmin, adminAuth } from "../../lib/api";

interface LoginFormData {
  username: string;
  password: string;
}

interface Admin {
  admin_id: string;
  username: string;
}

interface LoginResponse {
  msg: string;
  admin: Admin;
  token: string;
  expiresIn: string;
}

export const Login = (): JSX.Element => {
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState<LoginFormData>({
    username: "",
    password: "",
  });

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already logged in
  useEffect(() => {
    if (adminAuth.isLoggedIn()) {
      navigate("/admin", { replace: true });
    }
  }, [navigate]);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) {
      setError(null);
    }
  };

  // Form validation
  const validateForm = (): boolean => {
    if (!formData.username.trim()) {
      setError("Username is required");
      return false;
    }
    if (!formData.password.trim()) {
      setError("Password is required");
      return false;
    }
    if (formData.username.trim().length < 3) {
      setError("Username must be at least 3 characters long");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response: LoginResponse = await loginAdmin(
        formData.username.trim(),
        formData.password
      );

      // Check if token exists in the response and store it
      if (response.token) {
        localStorage.setItem("jwtToken", response.token); // Store the token
      }

      if (response.admin) {
        // Store admin data using the auth utility
        adminAuth.setAdmin(response.admin);

        // Redirect to admin dashboard
        navigate("/admin", { replace: true });
      } else {
        setError("Login failed. Invalid response from server.");
      }
    } catch (err) {
      console.error("Login error:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Network error. Please check your connection and try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle sign up navigation
  const handleSignUpClick = () => {
    navigate("/admin/signup");
  };

  // Handle key press for better UX
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      handleSubmit(e as any);
    }
  };

  return (
    <div className="bg-[#f4f2ee] flex justify-center items-center min-h-screen w-full">
      <div className="w-full max-w-[1440px] px-4">
        <Card className="mx-auto max-w-md bg-white rounded-[20px] border-[#dfdeda] shadow-none">
          <CardContent className="pt-12 pb-10 px-8 flex flex-col items-center">
            <h1 className="text-4xl font-medium [font-family:'Lexend_Deca',Helvetica] mb-4">
              Login
            </h1>

            <p className="text-base font-light [font-family:'Lexend_Deca',Helvetica] text-center mb-12">
              Enter your credentials to access your account
            </p>

            <form onSubmit={handleSubmit} className="w-full space-y-6" onKeyPress={handleKeyPress}>
              {/* Error message display */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm animate-in slide-in-from-top-2 duration-300">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label
                  htmlFor="username"
                  className="block text-lg font-light [font-family:'Lexend_Deca',Helvetica] text-[#000000de]"
                >
                  Username
                </Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="h-[49px] rounded-lg border-[#dfdeda] focus:border-black focus:ring-1 focus:ring-black transition-colors"
                  disabled={isLoading}
                  autoComplete="username"
                  placeholder="Enter your username"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="block text-lg font-light [font-family:'Lexend_Deca',Helvetica] text-[#000000de]"
                >
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="h-[49px] rounded-lg border-[#dfdeda] focus:border-black focus:ring-1 focus:ring-black transition-colors"
                  disabled={isLoading}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-[54px] mt-8 bg-black hover:bg-black/90 disabled:bg-black/50 disabled:cursor-not-allowed text-white rounded-[180px] text-xl font-semibold [font-family:'Lexend_Deca',Helvetica] transition-all duration-200"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Logging in...
                  </div>
                ) : (
                  "Login"
                )}
              </Button>

              <p className="text-center text-base font-normal text-[#000000b0] [font-family:'Lexend_Deca',Helvetica] mt-4">
                Don&apos;t have an account?{" "}
                <span
                  className="cursor-pointer hover:underline text-black font-medium transition-all duration-200 hover:text-black/80"
                  onClick={handleSignUpClick}
                >
                  Sign Up
                </span>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
