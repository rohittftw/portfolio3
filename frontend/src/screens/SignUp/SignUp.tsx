import React from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

export const SignUp = (): JSX.Element => {
  return (
    <div className="bg-[#f4f2ee] flex justify-center items-center min-h-screen w-full">
      <div className="w-full max-w-[1440px] px-4">
        <Card className="mx-auto max-w-md bg-white rounded-[20px] border-[#dfdeda] shadow-none">
          <CardContent className="pt-8 pb-6 px-8 flex flex-col items-center">
            <h1 className="text-4xl font-medium [font-family:'Lexend_Deca',Helvetica] mb-4">
              Sign Up
            </h1>

            <p className="text-base font-light [font-family:'Lexend_Deca',Helvetica] text-center mb-6">
              Create your account to get started
            </p>

            <div className="w-full space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="fullName"
                  className="block text-lg font-light [font-family:'Lexend_Deca',Helvetica] text-[#000000de]"
                >
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  className="h-[49px] rounded-lg border-[#dfdeda]"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="block text-lg font-light [font-family:'Lexend_Deca',Helvetica] text-[#000000de]"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  className="h-[49px] rounded-lg border-[#dfdeda]"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="username"
                  className="block text-lg font-light [font-family:'Lexend_Deca',Helvetica] text-[#000000de]"
                >
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  className="h-[49px] rounded-lg border-[#dfdeda]"
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
                  type="password"
                  className="h-[49px] rounded-lg border-[#dfdeda]"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="block text-lg font-light [font-family:'Lexend_Deca',Helvetica] text-[#000000de]"
                >
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  className="h-[49px] rounded-lg border-[#dfdeda]"
                />
              </div>

              <Button className="w-full h-[54px] mt-4 bg-black hover:bg-black/90 text-white rounded-[180px] text-xl font-semibold [font-family:'Lexend_Deca',Helvetica]">
                Create Account
              </Button>

              <p className="text-center text-base font-normal text-[#000000b0] [font-family:'Lexend_Deca',Helvetica] mt-2">
                Already have an account?{" "}
                <span className="cursor-pointer hover:underline">Login</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};