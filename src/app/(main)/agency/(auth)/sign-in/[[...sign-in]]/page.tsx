import { constructMetadata } from "@/lib/utils";
import { SignIn } from "@clerk/nextjs";
import React from "react";

const SignInPage = () => {
  return <SignIn />;
};

export default SignInPage;
export const metadata = constructMetadata({
  title: "Sign In - Projex",
});
