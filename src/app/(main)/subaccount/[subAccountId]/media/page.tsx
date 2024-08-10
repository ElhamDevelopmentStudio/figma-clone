import BlurPage from "@/components/global/BlurPage";
import MediaComponent from "@/components/media";
import { getMedia } from "@/lib/queries";
import { constructMetadata } from "@/lib/utils";
import React from "react";

type Props = {
  params: { subAccountId: string };
};

const MediaPage = async ({ params }: Props) => {
  const data = await getMedia(params.subAccountId);
  return (
    <BlurPage>
      <MediaComponent data={data} subaccountId={params.subAccountId} />
    </BlurPage>
  );
};

export default MediaPage;

export const metadata = constructMetadata({
  title: "Media - Projex",
});
