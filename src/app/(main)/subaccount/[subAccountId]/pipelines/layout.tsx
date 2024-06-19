import BlurPage from "@/components/global/BlurPage";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const LayoutPipeline = ({ children }: Props) => {
  return <BlurPage>{children}</BlurPage>;
};

export default LayoutPipeline;
