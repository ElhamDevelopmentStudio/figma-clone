import MediaComponent from "@/components/media";
import { getMedia } from "@/lib/queries";
import { GetMediaFiles } from "@/lib/types";
import React, { useEffect, useState } from "react";

type Props = {
  subAccountId: string;
};

const MediaBucketTab = (props: Props) => {
  const [data, setdata] = useState<GetMediaFiles>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getMedia(props.subAccountId);
      setdata(response);
    };
    fetchData();
  }, [props.subAccountId]);

  return (
    <div className="h-[900px] overflow-hidden p-4">
      <MediaComponent data={data} subaccountId={props.subAccountId} />
    </div>
  );
};

export default MediaBucketTab;
