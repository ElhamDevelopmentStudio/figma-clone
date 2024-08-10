import { constructMetadata } from "@/lib/utils";
import { SignUp } from "@clerk/nextjs";
import React from "react";

const SignUpPage = () => {
  return <SignUp />;
};

export default SignUpPage;

export const metadata = constructMetadata({
  title: "Sign Up - Projex",
});
