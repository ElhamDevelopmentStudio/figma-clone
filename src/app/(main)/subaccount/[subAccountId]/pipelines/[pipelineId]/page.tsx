import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { db } from "@/lib/db";
import { getLanesWithTicketAndTags, getPipelineDetails } from "@/lib/queries";
import { LaneDetails } from "@/lib/types";
import { redirect } from "next/navigation";
import React from "react";
import PipelineInfoBar from "../_components/PipelineInfoBar";

type Props = {
  params: { subaccountId: string; pipelineId: string };
};

const PipelinesIdPage = async ({ params }: Props) => {
  const pipelineDetails = await getPipelineDetails(params.pipelineId);
  if (!pipelineDetails)
    return redirect(`/subaccount/${params.subaccountId}/pipelines`);

  const pipelines = await db.pipeline.findMany({
    where: { subAccountId: params.subaccountId },
  });

  const lanes = (await getLanesWithTicketAndTags(
    params.pipelineId
  )) as LaneDetails[];

  return (
    <Tabs defaultValue="view" className="w-full">
      <TabsList className="bg-transparent border-b-2 h-16 w-full justify-between mb-4">
        <PipelineInfoBar
          pipelineId={params.pipelineId}
          subAccountId={params.subaccountId}
          pipelines={pipelines}
        />
        <div>
          <TabsTrigger value="view">Pipeline View</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </div>
      </TabsList>
    </Tabs>
  );
};

export default PipelinesIdPage;
