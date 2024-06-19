import LoadingPage from "@/components/global/LoadingPage";
import React from "react";

type Props = {};

const LoadingPipeline = (props: Props) => {
  return (
    <div className="-mt-8 h-screen">
      <LoadingPage />
    </div>
  );
};

export default LoadingPipeline;
