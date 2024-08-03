import { getFunnel } from "@/lib/queries";
import React from "react";

type Props = {
  params: {
    funnelId: string;
    subAccountId: string;
  };
};

const FunnelIdPage = async ({ params }: Props) => {
  const funnelsPage = await getFunnel(params.funnelId);

  return <div>FunnelIdPage</div>;
};

export default FunnelIdPage;
