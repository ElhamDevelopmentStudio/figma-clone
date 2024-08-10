import Unauthorized from "@/components/unauthorized.tsx";
import { constructMetadata } from "@/lib/utils";
import React from "react";

const UnauthorizedPage = () => {
  return <Unauthorized />;
};

export default UnauthorizedPage;

export const metadata = constructMetadata({
  title: "Unauthorized - Projex",
});
